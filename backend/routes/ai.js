const express = require('express');
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'gemma2-9b-it'];

async function askGroq(systemPrompt, userMessage, maxTokens = 2000) {
  let lastError;
  for (const model of MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        model, temperature: 0.7, max_tokens: maxTokens
      });
      return completion.choices[0]?.message?.content || '';
    } catch (err) {
      console.error(`Modèle ${model} échoué:`, err.message);
      lastError = err;
      if (err.status === 401 || err.status === 403) break;
    }
  }
  throw lastError;
}

// ─── Analyse offre d'emploi vs CV ──────────────────────────────────────────
router.post('/analyze-job', authMiddleware, async (req, res) => {
  try {
    const { jobOffer } = req.body;
    if (!jobOffer || jobOffer.trim().length < 20) return res.status(400).json({ message: "Offre d'emploi trop courte" });

    const user = await User.findById(req.user._id);
    const cv = user.cv || {};
    const userCity = cv.personalInfo?.city || user.city || '';
    const userSkills = (cv.skills || []).join(', ') || 'Non renseignées';
    const userExperiences = (cv.experience || []).map(e => `${e.title} chez ${e.company}: ${e.description}`).join(' | ') || 'Aucune';
    const userEducation = (cv.education || []).map(e => `${e.degree} à ${e.school}`).join(' | ') || 'Aucune';
    const userLanguages = (cv.languages || []).map(l => `${l.language} (${l.level})`).join(', ') || 'Non renseignées';

    const cvText = `Nom: ${cv.personalInfo?.name || user.name}
Ville: ${userCity}
Objectif: ${cv.personalInfo?.objective || 'Non renseigné'}
Compétences: ${userSkills}
Expériences: ${userExperiences}
Formation: ${userEducation}
Langues: ${userLanguages}`;

    const systemPrompt = `Tu es un expert en recrutement au Maroc. Analyse la compatibilité entre un CV et une offre d'emploi.
Réponds UNIQUEMENT avec un JSON valide sans balises markdown.
Structure exacte:
{
  "score": <0-100>,
  "matchedSkills": ["..."],
  "missingSkills": ["..."],
  "atsKeywords": ["..."],
  "recommendation": "...",
  "strengths": ["..."],
  "improvements": ["..."],
  "jobRecommendations": [
    {
      "title": "Titre du poste recommandé",
      "company": "Exemple d'entreprise recrutant ce profil au Maroc",
      "location": "Ville",
      "matchScore": <0-100>,
      "reason": "Pourquoi ce poste correspond à votre profil",
      "sector": "Secteur d'activité",
      "searchUrl": "https://www.rekrute.com/offres-emploi.html?s=<titre+encodé>&p=1&nbr=1"
    }
  ]
}
Pour jobRecommendations: génère 4 offres d'emploi similaires ou complémentaires qui correspondent aux compétences du candidat.
Prends en compte la ville du candidat pour proposer des postes dans sa région ou en remote.
Les entreprises doivent être réelles et connues au Maroc (Capgemini, Concentrix, Webhelp, Attijariwafa, OCP, Maroc Telecom, etc.).`;

    const result = await askGroq(systemPrompt, `CV du candidat:\n${cvText}\n\nOffre analysée:\n${jobOffer}`);

    let parsed;
    try {
      parsed = JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      parsed = {
        score: 50, matchedSkills: [], missingSkills: [], atsKeywords: [],
        recommendation: result.substring(0, 500), strengths: [], improvements: [],
        jobRecommendations: []
      };
    }
    res.json(parsed);
  } catch (err) {
    console.error('Erreur analyze-job:', err.message);
    res.status(500).json({ message: 'Erreur IA. Réessayez.', error: err.message });
  }
});

// ─── Recommandations d'offres basées sur le profil ─────────────────────────
router.post('/recommend-jobs', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cv = user.cv || {};
    const userCity = cv.personalInfo?.city || user.city || 'Maroc';
    const userSkills = (cv.skills || []).join(', ') || 'Non renseignées';
    const userExperiences = (cv.experience || []).map(e => `${e.title} chez ${e.company}`).join(', ') || 'Aucune';
    const userObjective = cv.personalInfo?.objective || '';

    if (!userSkills || userSkills === 'Non renseignées') {
      return res.status(400).json({ message: 'Ajoutez des compétences à votre CV pour obtenir des recommandations.' });
    }

    const systemPrompt = `Tu es un expert en recrutement au Maroc. Génère des recommandations d'offres d'emploi personnalisées.
Réponds UNIQUEMENT avec un JSON valide sans balises markdown.
Structure:
{
  "recommendations": [
    {
      "title": "Titre du poste",
      "company": "Entreprise réelle au Maroc",
      "location": "Ville",
      "matchScore": <0-100>,
      "reason": "Pourquoi ce poste correspond (1-2 phrases)",
      "sector": "Secteur",
      "requiredSkills": ["compétence requise 1", "compétence requise 2"],
      "missingSkills": ["ce qui manque"],
      "searchUrl": "https://www.rekrute.com/offres-emploi.html?s=<mots+clés+encodés>"
    }
  ],
  "profileSummary": "Résumé du profil du candidat en 1 phrase",
  "topSectors": ["Secteur 1", "Secteur 2", "Secteur 3"]
}
Génère 6 recommandations variées. Prends en compte la ville du candidat pour proposer des postes proches ou en remote.
Utilise des entreprises réelles connues au Maroc.`;

    const userMsg = `Profil candidat:
Ville: ${userCity}
Compétences: ${userSkills}
Expériences: ${userExperiences}
Objectif: ${userObjective}`;

    const result = await askGroq(systemPrompt, userMsg, 2000);
    let parsed;
    try {
      parsed = JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      parsed = { recommendations: [], profileSummary: '', topSectors: [] };
    }
    res.json(parsed);
  } catch (err) {
    console.error('Erreur recommend-jobs:', err.message);
    res.status(500).json({ message: 'Erreur IA.', error: err.message });
  }
});

// ─── Score CV ───────────────────────────────────────────────────────────────
router.post('/score-cv', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cv = user.cv || {};
    if (!cv.personalInfo?.name && !cv.skills?.length && !cv.experience?.length) {
      return res.status(400).json({ message: "CV vide. Remplissez d'abord vos informations." });
    }
    const cvSummary = {
      nom: cv.personalInfo?.name || user.name,
      objectif: cv.personalInfo?.objective,
      formations: (cv.education||[]).length,
      experiences: (cv.experience||[]).length,
      competences: (cv.skills||[]).join(', '),
      langues: (cv.languages||[]).map(l=>`${l.language} ${l.level}`).join(', ')
    };
    const systemPrompt = `Tu es un expert RH marocain. Réponds UNIQUEMENT avec un JSON valide sans balises markdown.
Structure: {"score":<0-100>,"readability":<0-100>,"impact":<0-100>,"completeness":<0-100>,"atsScore":<0-100>,"feedback":"...","tips":["...","...","..."]}`;
    const result = await askGroq(systemPrompt, `Évalue ce CV: ${JSON.stringify(cvSummary)}`);
    let parsed;
    try { parsed = JSON.parse(result.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim()); }
    catch { parsed = { score: 60, readability: 60, impact: 60, completeness: 60, atsScore: 60, feedback: result.substring(0,300), tips: ['Complétez votre objectif','Ajoutez des compétences','Détaillez vos expériences'] }; }
    await User.findByIdAndUpdate(req.user._id, { 'cv.score': parsed.score, 'cv.feedback': parsed.feedback });
    res.json(parsed);
  } catch (err) {
    console.error('Erreur score-cv:', err.message);
    res.status(500).json({ message: 'Erreur IA.', error: err.message });
  }
});

// ─── Optimiser section CV ───────────────────────────────────────────────────
router.post('/optimize-cv', authMiddleware, async (req, res) => {
  try {
    const { section, content, targetJob, tone } = req.body;
    if (!content || content.trim().length < 5) return res.status(400).json({ message: 'Contenu trop court' });
    const systemPrompt = `Tu es expert en CV marocains. Réponds directement avec le texte optimisé (3-4 phrases max), sans guillemets ni balises.`;
    const result = await askGroq(systemPrompt, `Optimise la section "${section}" pour le poste "${targetJob||'général'}". Ton: ${tone||'professionnel'}. Contenu: ${content}`, 500);
    res.json({ optimized: result.trim() });
  } catch (err) {
    res.status(500).json({ message: 'Erreur IA', error: err.message });
  }
});

// ─── Lettre de motivation ───────────────────────────────────────────────────
router.post('/cover-letter', authMiddleware, async (req, res) => {
  try {
    const { jobOffer, companyName, jobTitle } = req.body;
    if (!jobTitle || !companyName) return res.status(400).json({ message: 'Poste et entreprise requis' });
    const user = await User.findById(req.user._id);
    const cv = user.cv || {};
    const systemPrompt = `Tu es expert en lettres de motivation pour le marché marocain. Format: en-tête, objet, 3 paragraphes, formule de politesse. ~300 mots, français professionnel.`;
    const userMsg = `Candidat: ${cv.personalInfo?.name||user.name}, Ville: ${cv.personalInfo?.city||'Maroc'}, Poste: ${jobTitle}, Entreprise: ${companyName}, Compétences: ${(cv.skills||[]).slice(0,6).join(', ')||'variées'}${jobOffer?`, Offre: ${jobOffer.substring(0,400)}`:''}`;
    const result = await askGroq(systemPrompt, userMsg, 1500);
    res.json({ letter: result.trim() });
  } catch (err) {
    res.status(500).json({ message: 'Erreur IA', error: err.message });
  }
});

// ─── Chat Assistant ─────────────────────────────────────────────────────────
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ message: 'Message vide' });
    const systemPrompt = `Tu es Tawdhif (توظيف), assistant d'insertion professionnelle au Maroc. Tu aides les jeunes marocains pour l'emploi, CV, entretiens. Tu connais l'offshoring, tourisme, IT, commerce au Maroc. Tu es encourageant, concis (3-5 phrases), pratique.`;
    const historyMessages = (history||[]).slice(-8).map(m => ({ role: m.role==='ai'?'assistant':'user', content: m.text||m.content||'' }));
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: systemPrompt }, ...historyMessages, { role: 'user', content: message }],
      model: 'llama-3.3-70b-versatile', temperature: 0.8, max_tokens: 800
    });
    res.json({ response: completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu répondre." });
  } catch (err) {
    console.error('Erreur chat:', err.message);
    res.status(500).json({ message: 'Erreur IA.', error: err.message });
  }
});

module.exports = router;
