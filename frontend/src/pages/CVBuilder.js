import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Trash2, Save, Star, Zap, ChevronDown, ChevronUp, Download, Palette, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SKILL_SUGGESTIONS = ['Microsoft Excel', 'Microsoft Word', 'PowerPoint', 'Google Workspace', 'Gestion de projet', 'Service client', 'Communication', 'Travail en équipe', 'Leadership', 'Négociation', 'Marketing digital', 'Réseaux sociaux', 'Salesforce', 'SAP', 'AutoCAD', 'Photoshop', 'JavaScript', 'Python', 'PHP', 'SQL'];
const LANG_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Langue maternelle'];

const THEMES = [
  { id: 'classic',   name: 'Classique',  sidebar: '#1a3a5c', accent: '#1a3a5c',  sidebarText: '#ffffff', light: '#e8f0f7' },
  { id: 'modern',    name: 'Moderne',    sidebar: '#16a085', accent: '#16a085',  sidebarText: '#ffffff', light: '#e8f8f5' },
  { id: 'gold',      name: 'Prestige',   sidebar: '#1a1a2e', accent: '#8B6914',  sidebarText: '#c9a84c', light: '#fdf6e3' },
  { id: 'executive', name: 'Exécutif',   sidebar: '#2c3e50', accent: '#2c3e50',  sidebarText: '#ecf0f1', light: '#ecf0f1' },
];

const defaultCV = {
  personalInfo: { name: '', email: '', phone: '', city: '', objective: '' },
  education:    [{ degree: '', school: '', year: '', description: '' }],
  experience:   [{ title: '', company: '', duration: '', description: '' }],
  skills: [],
  languages:    [{ language: 'Français', level: 'Courant' }, { language: 'Arabe', level: 'Langue maternelle' }]
};

// ─── CV Preview ───────────────────────────────────────────────────────────────
function CVPreviewRender({ cv, theme }) {
  const t = THEMES.find(x => x.id === theme) || THEMES[0];
  const info = cv?.personalInfo || {};
  const name = info.name || 'Votre Nom';
  const skills = cv?.skills || [];
  const languages = cv?.languages || [];
  const education = cv?.education || [];
  const experience = cv?.experience || [];

  const langWidth = (level) => {
    const map = { 'Langue maternelle': '100%', 'Courant': '85%', 'Avancé': '70%', 'Intermédiaire': '50%', 'Débutant': '30%' };
    return map[level] || '50%';
  };

  return (
    <div id="cv-preview-render" style={{
      width: 794,
      minHeight: 1123,
      fontFamily: 'Arial, sans-serif',
      fontSize: 13,
      color: '#222',
      background: '#fff',
      display: 'flex',
      flexDirection: 'row',
      boxSizing: 'border-box',
      overflow: 'hidden',
      lineHeight: 1.4
    }}>
      {/* ── Colonne gauche ── */}
      <div style={{
        width: 230,
        minWidth: 230,
        maxWidth: 230,
        background: t.sidebar,
        padding: '32px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: `rgba(255,255,255,0.15)`,
            border: `3px solid rgba(255,255,255,0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: t.sidebarText,
            margin: '0 auto 12px'
          }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.sidebarText, wordBreak: 'break-word', marginBottom: 6 }}>{name}</div>
          {info.objective && (
            <div style={{ fontSize: 10, color: t.sidebarText, opacity: 0.75, lineHeight: 1.5, wordBreak: 'break-word' }}>
              {info.objective.substring(0, 120)}{info.objective.length > 120 ? '...' : ''}
            </div>
          )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 16, height: 2, background: t.sidebarText, opacity: 0.5 }}></div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: t.sidebarText, opacity: 0.85 }}>CONTACT</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {info.phone && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 10, flexShrink: 0 }}>📞</span>
                <span style={{ fontSize: 10, color: t.sidebarText, opacity: 0.85, wordBreak: 'break-all' }}>{info.phone}</span>
              </div>
            )}
            {info.email && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 10, flexShrink: 0 }}>✉️</span>
                <span style={{ fontSize: 10, color: t.sidebarText, opacity: 0.85, wordBreak: 'break-all' }}>{info.email}</span>
              </div>
            )}
            {info.city && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 10, flexShrink: 0 }}>📍</span>
                <span style={{ fontSize: 10, color: t.sidebarText, opacity: 0.85, wordBreak: 'break-all' }}>{info.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Compétences */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 2, background: t.sidebarText, opacity: 0.5 }}></div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: t.sidebarText, opacity: 0.85 }}>COMPÉTENCES</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {skills.map((skill, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: t.sidebarText, opacity: 0.9, marginBottom: 3, wordBreak: 'break-word' }}>{skill}</div>
                  <div style={{ height: 3, background: `rgba(255,255,255,0.2)`, borderRadius: 2 }}>
                    <div style={{ height: 3, width: `${65 + (i % 4) * 8}%`, background: t.sidebarText, opacity: 0.6, borderRadius: 2 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 16, height: 2, background: t.sidebarText, opacity: 0.5 }}></div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: t.sidebarText, opacity: 0.85 }}>LANGUES</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {languages.map((lang, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: t.sidebarText, opacity: 0.9 }}>{lang.language}</span>
                    <span style={{ fontSize: 8.5, color: t.sidebarText, opacity: 0.65 }}>{lang.level}</span>
                  </div>
                  <div style={{ height: 3, background: `rgba(255,255,255,0.2)`, borderRadius: 2 }}>
                    <div style={{ height: 3, width: langWidth(lang.level), background: t.sidebarText, opacity: 0.6, borderRadius: 2 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <div style={{ fontSize: 8, color: t.sidebarText, opacity: 0.4, textAlign: 'center' }}>
            CVBoost AI 🇲🇦 — {new Date().toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Colonne droite ── */}
      <div style={{
        flex: 1,
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        boxSizing: 'border-box',
        overflow: 'hidden',
        minWidth: 0
      }}>

        {/* En-tête nom + titre */}
        <div style={{ borderBottom: `3px solid ${t.accent}`, paddingBottom: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>{name}</div>
          {experience[0]?.title && (
            <div style={{ fontSize: 13, color: t.accent, fontWeight: 600 }}>{experience[0].title}</div>
          )}
        </div>

        {/* Objectif / Profil */}
        {info.objective && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.accent }}>Profil</div>
              <div style={{ flex: 1, height: 2, background: `${t.accent}22` }}></div>
            </div>
            <div style={{ fontSize: 11, color: '#555', lineHeight: 1.65, wordBreak: 'break-word' }}>{info.objective}</div>
          </div>
        )}

        {/* Expériences */}
        {experience.length > 0 && experience[0].title && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.accent }}>Expériences Professionnelles</div>
              <div style={{ flex: 1, height: 2, background: `${t.accent}22` }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {experience.map((exp, i) => exp.title ? (
                <div key={i} style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2, gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: '#1a1a1a', flex: 1, wordBreak: 'break-word' }}>{exp.title}</div>
                    {exp.duration && (
                      <div style={{ fontSize: 9.5, color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>{exp.duration}</div>
                    )}
                  </div>
                  {exp.company && (
                    <div style={{ fontSize: 11, color: t.accent, fontWeight: 600, marginBottom: 4, wordBreak: 'break-word' }}>{exp.company}</div>
                  )}
                  {exp.description && (
                    <div style={{ fontSize: 10.5, color: '#555', lineHeight: 1.6, wordBreak: 'break-word' }}>
                      {exp.description.split('\n').map((line, j) => (
                        <div key={j} style={{ marginBottom: 2 }}>• {line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null)}
            </div>
          </div>
        )}

        {/* Formation */}
        {education.length > 0 && education[0].degree && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.accent }}>Formation</div>
              <div style={{ flex: 1, height: 2, background: `${t.accent}22` }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {education.map((edu, i) => edu.degree ? (
                <div key={i} style={{ borderLeft: `3px solid ${t.accent}55`, paddingLeft: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2, gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: '#1a1a1a', flex: 1, wordBreak: 'break-word' }}>{edu.degree}</div>
                    {edu.year && (
                      <div style={{ fontSize: 9.5, color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.year}</div>
                    )}
                  </div>
                  {edu.school && (
                    <div style={{ fontSize: 11, color: t.accent, fontWeight: 600, marginBottom: 3, wordBreak: 'break-word' }}>{edu.school}</div>
                  )}
                  {edu.description && (
                    <div style={{ fontSize: 10.5, color: '#666', lineHeight: 1.5, wordBreak: 'break-word' }}>{edu.description}</div>
                  )}
                </div>
              ) : null)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal Téléchargement ─────────────────────────────────────────────────────
function DownloadModal({ cv, userName, onClose }) {
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [downloading, setDownloading] = useState(false);

  const printCV = () => {
    const content = document.getElementById('cv-preview-render');
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV</title><style>body{margin:0;padding:0;}@page{margin:0;size:A4;}</style></head><body>${content.outerHTML}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>`);
    win.document.close();
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      if (!window.html2canvas) {
        const s1 = document.createElement('script');
        s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(s1);
        await new Promise((res, rej) => { s1.onload = res; s1.onerror = rej; });
      }
      if (!window.jspdf) {
        const s2 = document.createElement('script');
        s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(s2);
        await new Promise((res, rej) => { s2.onload = res; s2.onerror = rej; });
      }
      const element = document.getElementById('cv-preview-render');
      const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff', windowWidth: 794 });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [794, 1123] });
      pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
      const nom = (cv?.personalInfo?.name || userName || 'CV').replace(/\s+/g, '_');
      pdf.save(`CV_${nom}_CVBoostAI.pdf`);
      toast.success('CV téléchargé ! 🎉');
    } catch (err) {
      console.error(err);
      toast.info('Ouverture impression...');
      printCV();
    } finally { setDownloading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 1050, maxHeight: '94vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>📄 Télécharger mon CV</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>Choisissez un thème et exportez en PDF</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={22} /></button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Panneau gauche */}
          <div style={{ width: 200, borderRight: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                <Palette size={13} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Thème</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {THEMES.map(theme => (
                  <button key={theme.id} onClick={() => setSelectedTheme(theme.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem',
                    borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-main)',
                    transition: 'all 0.15s', textAlign: 'left', width: '100%',
                    background: selectedTheme === theme.id ? 'var(--sidebar-active)' : 'transparent',
                    outline: selectedTheme === theme.id ? '1.5px solid var(--accent-blue)' : '1.5px solid transparent',
                  }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, background: theme.sidebar, flexShrink: 0 }}></div>
                    <span style={{ fontSize: '0.83rem', fontWeight: 600, color: selectedTheme === theme.id ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>{theme.name}</span>
                    {selectedTheme === theme.id && <span style={{ marginLeft: 'auto', color: 'var(--accent-blue)', fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={downloadPDF} className="btn btn-primary btn-full" disabled={downloading} style={{ fontSize: '0.83rem' }}>
                {downloading ? <><span className="spinner" style={{ width: 14, height: 14 }}></span> PDF...</> : <><Download size={14} /> Télécharger PDF</>}
              </button>
              <button onClick={printCV} className="btn btn-secondary btn-full" style={{ fontSize: '0.8rem' }}>🖨️ Imprimer</button>
            </div>
          </div>

          {/* Preview */}
          <div style={{ flex: 1, overflow: 'auto', background: '#d1d1d1', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ transform: 'scale(0.68)', transformOrigin: 'top center', marginBottom: -370, boxShadow: '0 12px 40px rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden' }}>
              <CVPreviewRender cv={cv} theme={selectedTheme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CVBuilder Principal ──────────────────────────────────────────────────────
export default function CVBuilder() {
  const { user } = useAuth();
  const [cv, setCv] = useState(defaultCV);
  const [saving, setSaving] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState(null);
  const [skillInput, setSkillInput] = useState('');
  const [activeSection, setActiveSection] = useState('personal');
  const [optimizing, setOptimizing] = useState('');
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    axios.get('/api/cv').then(r => {
      if (r.data && r.data.personalInfo) setCv({ ...defaultCV, ...r.data });
      if (r.data?.score) setScore({ score: r.data.score, feedback: r.data.feedback });
    }).catch(() => {});
  }, []);

  const saveCV = async () => {
    setSaving(true);
    try { await axios.post('/api/cv', cv); toast.success('CV sauvegardé ✅'); }
    catch { toast.error('Erreur sauvegarde'); }
    finally { setSaving(false); }
  };

  const scoreCV = async () => {
    await saveCV();
    setScoring(true);
    try { const r = await axios.post('/api/ai/score-cv'); setScore(r.data); toast.success(`Score : ${r.data.score}/100 🎯`); }
    catch { toast.error("Erreur analyse IA"); }
    finally { setScoring(false); }
  };

  const optimizeSection = async (section, content) => {
    setOptimizing(section);
    try {
      const r = await axios.post('/api/ai/optimize-cv', { section, content, targetJob: cv.personalInfo.objective || 'poste général', tone: 'professionnel' });
      if (section === 'objective') setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, objective: r.data.optimized } }));
      toast.success('Optimisé par IA ✨');
    } catch { toast.error('Erreur IA'); }
    finally { setOptimizing(''); }
  };

  const addSkill = (skill) => {
    const s = skill || skillInput.trim();
    if (s && !cv.skills.includes(s)) { setCv(c => ({ ...c, skills: [...c.skills, s] })); setSkillInput(''); }
  };
  const removeSkill = (s) => setCv(c => ({ ...c, skills: c.skills.filter(x => x !== s) }));

  const addEdu    = () => setCv(c => ({ ...c, education:  [...c.education,  { degree: '', school: '', year: '', description: '' }] }));
  const removeEdu = (i) => setCv(c => ({ ...c, education:  c.education.filter((_, idx) => idx !== i) }));
  const updateEdu = (i, f, v) => setCv(c => ({ ...c, education: c.education.map((e, idx) => idx === i ? { ...e, [f]: v } : e) }));

  const addExp    = () => setCv(c => ({ ...c, experience: [...c.experience, { title: '', company: '', duration: '', description: '' }] }));
  const removeExp = (i) => setCv(c => ({ ...c, experience: c.experience.filter((_, idx) => idx !== i) }));
  const updateExp = (i, f, v) => setCv(c => ({ ...c, experience: c.experience.map((e, idx) => idx === i ? { ...e, [f]: v } : e) }));

  const addLang    = () => setCv(c => ({ ...c, languages: [...c.languages, { language: '', level: 'Intermédiaire' }] }));
  const removeLang = (i) => setCv(c => ({ ...c, languages: c.languages.filter((_, idx) => idx !== i) }));
  const updateLang = (i, f, v) => setCv(c => ({ ...c, languages: c.languages.map((l, idx) => idx === i ? { ...l, [f]: v } : l) }));

  const sections = [
    { id: 'personal',   label: '👤 Informations personnelles' },
    { id: 'education',  label: '🎓 Formation' },
    { id: 'experience', label: '💼 Expériences' },
    { id: 'skills',     label: '⚡ Compétences' },
    { id: 'languages',  label: '🌍 Langues' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h1>Mon CV</h1>
          <p>Construisez un CV optimisé pour le marché marocain</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={saveCV} className="btn btn-secondary" disabled={saving}>
            {saving ? <><span className="spinner" style={{ width: 15, height: 15 }}></span> Sauvegarde...</> : <><Save size={15} /> Sauvegarder</>}
          </button>
          <button onClick={() => { saveCV(); setShowDownload(true); }} className="btn btn-secondary" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}>
            <Download size={15} /> Télécharger CV
          </button>
          <button onClick={scoreCV} className="btn btn-primary" disabled={scoring}>
            {scoring ? <><span className="spinner" style={{ width: 15, height: 15 }}></span> Analyse...</> : <><Star size={15} /> Analyser</>}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Formulaire */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sections.map(sec => (
            <div key={sec.id} className="card" style={{ padding: '1.25rem' }}>
              <button onClick={() => setActiveSection(activeSection === sec.id ? '' : sec.id)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontFamily: 'var(--font-main)', fontWeight: 700, fontSize: '0.95rem', padding: 0 }}>
                {sec.label}
                {activeSection === sec.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {activeSection === sec.id && (
                <div style={{ marginTop: '1.25rem' }}>

                  {/* Personal */}
                  {sec.id === 'personal' && (
                    <div>
                      <div className="grid-2" style={{ gap: '1rem' }}>
                        <div className="form-group"><label className="form-label">Nom complet</label><input className="form-input" value={cv.personalInfo.name} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, name: e.target.value } }))} placeholder="Prénom Nom" /></div>
                        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={cv.personalInfo.email} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, email: e.target.value } }))} placeholder="email@exemple.com" /></div>
                        <div className="form-group"><label className="form-label">Téléphone</label><input className="form-input" value={cv.personalInfo.phone} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, phone: e.target.value } }))} placeholder="+212 6XX XXX XXX" /></div>
                        <div className="form-group"><label className="form-label">Ville</label><input className="form-input" value={cv.personalInfo.city} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, city: e.target.value } }))} placeholder="Agadir, Casablanca..." /></div>
                      </div>
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>Objectif professionnel</label>
                          <button className="btn btn-secondary btn-sm" onClick={() => optimizeSection('objective', cv.personalInfo.objective)} disabled={optimizing === 'objective'}>
                            {optimizing === 'objective' ? <span className="spinner" style={{ width: 12, height: 12 }}></span> : <Zap size={12} />} IA
                          </button>
                        </div>
                        <textarea className="form-textarea" value={cv.personalInfo.objective} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, objective: e.target.value } }))} placeholder="Décrivez votre profil en 2-3 phrases..." rows={4} />
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {sec.id === 'education' && (
                    <div>
                      {cv.education.map((edu, i) => (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => removeEdu(i)}><Trash2 size={14} /></button>
                          </div>
                          <div className="grid-2" style={{ gap: '0.75rem' }}>
                            <div className="form-group"><label className="form-label">Diplôme</label><input className="form-input" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="Licence, Master, DUT..." /></div>
                            <div className="form-group"><label className="form-label">École</label><input className="form-input" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} placeholder="EST Agadir, ENCG..." /></div>
                            <div className="form-group"><label className="form-label">Année</label><input className="form-input" value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} placeholder="2022 - 2025" /></div>
                            <div className="form-group"><label className="form-label">Spécialité</label><input className="form-input" value={edu.description} onChange={e => updateEdu(i, 'description', e.target.value)} placeholder="Génie Informatique..." /></div>
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-secondary" onClick={addEdu}><Plus size={16} /> Ajouter une formation</button>
                    </div>
                  )}

                  {/* Experience */}
                  {sec.id === 'experience' && (
                    <div>
                      {cv.experience.map((exp, i) => (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => removeExp(i)}><Trash2 size={14} /></button>
                          </div>
                          <div className="grid-2" style={{ gap: '0.75rem' }}>
                            <div className="form-group"><label className="form-label">Poste</label><input className="form-input" value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Développeur Web, Stagiaire..." /></div>
                            <div className="form-group"><label className="form-label">Entreprise</label><input className="form-input" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Nom de l'entreprise" /></div>
                            <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Durée</label><input className="form-input" value={exp.duration} onChange={e => updateExp(i, 'duration', e.target.value)} placeholder="Jan 2024 - Juin 2024" /></div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Description (une tâche par ligne)</label>
                            <textarea className="form-textarea" value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} placeholder="Développement de fonctionnalités, Correction de bugs, Collaboration en équipe..." rows={4} />
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-secondary" onClick={addExp}><Plus size={16} /> Ajouter une expérience</button>
                    </div>
                  )}

                  {/* Skills */}
                  {sec.id === 'skills' && (
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input className="form-input" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addSkill()} placeholder="Ajouter une compétence..." />
                        <button className="btn btn-primary" onClick={() => addSkill()}><Plus size={16} /></button>
                      </div>
                      <div className="tags-container" style={{ marginBottom: '1rem' }}>
                        {cv.skills.map(s => <div key={s} className="tag">{s} <span className="tag-remove" onClick={() => removeSkill(s)}>×</span></div>)}
                      </div>
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Suggestions :</p>
                        <div className="tags-container">
                          {SKILL_SUGGESTIONS.filter(s => !cv.skills.includes(s)).slice(0, 12).map(s => (
                            <div key={s} className="tag" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => addSkill(s)}>+ {s}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {sec.id === 'languages' && (
                    <div>
                      {cv.languages.map((lang, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                          <input className="form-input" value={lang.language} onChange={e => updateLang(i, 'language', e.target.value)} placeholder="Langue" style={{ flex: 1 }} />
                          <select className="form-select" value={lang.level} onChange={e => updateLang(i, 'level', e.target.value)} style={{ flex: 1 }}>
                            {LANG_LEVELS.map(l => <option key={l}>{l}</option>)}
                          </select>
                          <button className="btn btn-danger btn-sm" onClick={() => removeLang(i)}><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button className="btn btn-secondary" onClick={addLang}><Plus size={16} /> Ajouter une langue</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Score Panel */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          {score ? (
            <div className="card">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1 }}>{score.score}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Score global / 100</div>
              </div>
              {score.readability !== undefined && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[['Lisibilité', score.readability], ['Impact', score.impact], ['Complétude', score.completeness], ['Score ATS', score.atsScore]].map(([label, val]) => (
                    <div key={label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        <span style={{ fontWeight: 600 }}>{val}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${val}%` }}></div></div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{score.feedback}</p>
              </div>
              {score.tips?.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.6rem' }}>💡 Conseils :</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {score.tips.map((t, i) => <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1rem', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>→</span>{t}</li>)}
                  </ul>
                </div>
              )}
              <button onClick={() => setShowDownload(true)} className="btn btn-primary btn-full">
                <Download size={15} /> Télécharger ce CV
              </button>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Star size={40} color="var(--accent-blue)" style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Analysez votre CV</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Obtenez un score et des recommandations IA</p>
              <button onClick={scoreCV} className="btn btn-primary btn-full" disabled={scoring}>
                {scoring ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Analyse...</> : <><Star size={16} /> Analyser maintenant</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {showDownload && <DownloadModal cv={cv} userName={user?.name} onClose={() => setShowDownload(false)} />}
    </div>
  );
}
