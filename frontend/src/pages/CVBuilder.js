import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Trash2, Save, Star, Zap, ChevronDown, ChevronUp, Download, Palette, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SKILL_SUGGESTIONS = ['Microsoft Excel', 'Microsoft Word', 'PowerPoint', 'Google Workspace', 'Gestion de projet', 'Service client', 'Communication', 'Travail en équipe', 'Leadership', 'Négociation', 'Marketing digital', 'Réseaux sociaux', 'Salesforce', 'SAP', 'AutoCAD', 'Photoshop', 'JavaScript', 'Python', 'PHP', 'SQL'];
const LANG_LEVELS = ['Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Langue maternelle'];

const THEMES = [
  { id: 'classic',   name: 'Classique',  sidebar: '#1a3a5c', accent: '#1a3a5c',  sidebarText: '#ffffff', light: '#e8f0f7' },
  { id: 'gold',      name: 'Prestige',   sidebar: '#1a1a2e', accent: '#8B6914',  sidebarText: '#c9a84c', light: '#fdf6e3' },
  { id: 'modern',    name: 'Moderne',    sidebar: '#16a085', accent: '#16a085',  sidebarText: '#ffffff', light: '#e8f8f5' },
  { id: 'executive', name: 'Exécutif',   sidebar: '#2c3e50', accent: '#2c3e50',  sidebarText: '#ecf0f1', light: '#ecf0f1' },
];

const defaultCV = {
  personalInfo: { name: '', email: '', phone: '', city: '', objective: '' },
  education: [{ degree: '', school: '', year: '', description: '' }],
  experience: [{ title: '', company: '', duration: '', description: '' }],
  skills: [],
  languages: [{ language: 'Français', level: 'Courant' }, { language: 'Arabe', level: 'Langue maternelle' }]
};

// ─── CV Preview HTML ─────────────────────────────────────────────────────────
function SideSection({ title, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
      <div style={{ width: 18, height: 2, background: color, opacity: 0.5, borderRadius: 1 }}></div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color, opacity: 0.85 }}>{title}</div>
    </div>
  );
}
function MainSection({ title, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: accent, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ flex: 1, height: 2, background: `${accent}22`, borderRadius: 1 }}></div>
    </div>
  );
}
function ContactItem({ icon, text, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 11 }}>{icon}</span>
      <span style={{ fontSize: 10.5, color, opacity: 0.85, wordBreak: 'break-all' }}>{text}</span>
    </div>
  );
}

function CVPreviewRender({ cv, theme }) {
  const t = THEMES.find(x => x.id === theme) || THEMES[0];
  const info = cv?.personalInfo || {};
  const name = info.name || 'Votre Nom';
  const skills = cv?.skills || [];
  const languages = cv?.languages || [];
  const education = cv?.education || [];
  const experience = cv?.experience || [];

  return (
    <div id="cv-preview-render" style={{
      width: 794, minHeight: 1123, fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: 13, color: '#222', background: '#fff',
      display: 'flex', boxSizing: 'border-box', overflow: 'hidden'
    }}>
      {/* Colonne gauche */}
      <div style={{ width: 240, background: t.sidebar, color: t.sidebarText, padding: '36px 22px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 86, height: 86, borderRadius: '50%', margin: '0 auto 14px',
            background: `${t.accent}33`, border: `3px solid ${t.sidebarText}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700, color: t.sidebarText
          }}>
            {name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: t.sidebarText }}>{name}</div>
          {info.objective && <div style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.4, marginTop: 8 }}>{info.objective.substring(0, 130)}{info.objective.length > 130 ? '...' : ''}</div>}
        </div>

        <div>
          <SideSection title="Contact" color={t.sidebarText} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
            {info.phone && <ContactItem icon="📞" text={info.phone} color={t.sidebarText} />}
            {info.email && <ContactItem icon="✉️" text={info.email} color={t.sidebarText} />}
            {info.city  && <ContactItem icon="📍" text={info.city}  color={t.sidebarText} />}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <SideSection title="Compétences" color={t.sidebarText} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {skills.map((skill, i) => (
                <div key={i}>
                  <div style={{ fontSize: 10.5, color: t.sidebarText, opacity: 0.9, marginBottom: 3 }}>{skill}</div>
                  <div style={{ height: 4, background: `${t.sidebarText}25`, borderRadius: 2 }}>
                    <div style={{ height: 4, width: `${70 + (i % 3) * 10}%`, background: t.sidebarText, borderRadius: 2, opacity: 0.65 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <SideSection title="Langues" color={t.sidebarText} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {languages.map((lang, i) => {
                const w = lang.level === 'Langue maternelle' ? '100%' : lang.level === 'Courant' ? '85%' : lang.level === 'Avancé' ? '70%' : lang.level === 'Intermédiaire' ? '50%' : '30%';
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 10.5, color: t.sidebarText, opacity: 0.9 }}>{lang.language}</span>
                      <span style={{ fontSize: 9, color: t.sidebarText, opacity: 0.6 }}>{lang.level}</span>
                    </div>
                    <div style={{ height: 4, background: `${t.sidebarText}25`, borderRadius: 2 }}>
                      <div style={{ height: 4, width: w, background: t.sidebarText, borderRadius: 2, opacity: 0.65 }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Colonne droite */}
      <div style={{ flex: 1, padding: '36px 30px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {experience.length > 0 && experience[0].title && (
          <div>
            <MainSection title="Expériences Professionnelles" accent={t.accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
              {experience.map((exp, i) => exp.title ? (
                <div key={i} style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1a1a1a' }}>{exp.title}</div>
                    {exp.duration && <div style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap', marginLeft: 8 }}>{exp.duration}</div>}
                  </div>
                  {exp.company && <div style={{ fontSize: 11, color: t.accent, fontWeight: 600, marginBottom: 4 }}>{exp.company}</div>}
                  {exp.description && <div style={{ fontSize: 10.5, color: '#555', lineHeight: 1.55 }}>{exp.description}</div>}
                </div>
              ) : null)}
            </div>
          </div>
        )}

        {education.length > 0 && education[0].degree && (
          <div>
            <MainSection title="Formation" accent={t.accent} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 12 }}>
              {education.map((edu, i) => edu.degree ? (
                <div key={i} style={{ borderLeft: `3px solid ${t.accent}55`, paddingLeft: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: 12.5, color: '#1a1a1a' }}>{edu.degree}</div>
                    {edu.year && <div style={{ fontSize: 10, color: '#888', whiteSpace: 'nowrap', marginLeft: 8 }}>{edu.year}</div>}
                  </div>
                  {edu.school && <div style={{ fontSize: 11, color: t.accent, fontWeight: 600, marginBottom: 3 }}>{edu.school}</div>}
                  {edu.description && <div style={{ fontSize: 10.5, color: '#666', lineHeight: 1.5 }}>{edu.description}</div>}
                </div>
              ) : null)}
            </div>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `1px solid ${t.light}`, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, color: '#bbb' }}>CV généré via Tawdhif | توظيف — Maroc 🇲🇦</span>
          <span style={{ fontSize: 9, color: '#bbb' }}>{new Date().toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}</span>
        </div>
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
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - ${cv?.personalInfo?.name || userName}</title><style>body{margin:0;padding:0;}@media print{body{margin:0;}}</style></head><body>${content.outerHTML}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>`);
    win.document.close();
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      // Charge html2canvas et jsPDF via CDN
      const scriptH = document.createElement('script');
      scriptH.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      document.head.appendChild(scriptH);
      await new Promise((res, rej) => { scriptH.onload = res; scriptH.onerror = rej; });

      const scriptJ = document.createElement('script');
      scriptJ.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      document.head.appendChild(scriptJ);
      await new Promise((res, rej) => { scriptJ.onload = res; scriptJ.onerror = rej; });

      const element = document.getElementById('cv-preview-render');
      const canvas = await window.html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [794, 1123] });
      pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123);
      const name = (cv?.personalInfo?.name || userName || 'CV').replace(/\s+/g, '_');
      pdf.save(`CV_${name}_Tawdhif.pdf`);
      toast.success('CV téléchargé ! 🎉');
    } catch (err) {
      console.error('Erreur PDF:', err);
      toast.info('Ouverture en mode impression...');
      printCV();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 20, width: '100%', maxWidth: 1000, maxHeight: '93vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '1.1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem' }}>📄 Télécharger mon CV</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: 2 }}>Choisissez un thème et exportez votre CV en PDF</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={22} /></button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Panneau gauche */}
          <div style={{ width: 210, borderRight: '1px solid var(--border)', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '1rem', flexShrink: 0 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Palette size={13} color="var(--accent-gold)" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Choisir un thème</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {THEMES.map(theme => (
                  <button key={theme.id} onClick={() => setSelectedTheme(theme.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.55rem 0.85rem', borderRadius: 9, border: 'none', cursor: 'pointer',
                    background: selectedTheme === theme.id ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                    outline: selectedTheme === theme.id ? '1.5px solid rgba(201,168,76,0.5)' : '1.5px solid transparent',
                    fontFamily: 'var(--font-main)', transition: 'all 0.18s', textAlign: 'left', width: '100%'
                  }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: theme.sidebar, flexShrink: 0, border: '2px solid rgba(255,255,255,0.1)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedTheme === theme.id ? 'var(--accent-gold-light)' : 'var(--text-secondary)' }}>{theme.name}</span>
                    {selectedTheme === theme.id && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <button onClick={downloadPDF} className="btn btn-primary btn-full" disabled={downloading} style={{ fontSize: '0.85rem' }}>
                {downloading ? <><span className="spinner" style={{ width: 15, height: 15 }}></span> Génération PDF...</> : <><Download size={15} /> Télécharger PDF</>}
              </button>
              <button onClick={printCV} className="btn btn-secondary btn-full" style={{ fontSize: '0.8rem' }}>
                🖨️ Imprimer
              </button>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(201,168,76,0.06)', borderRadius: 10, border: '1px solid rgba(201,168,76,0.15)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                💡 Le PDF est optimisé pour le format A4 — prêt à envoyer aux recruteurs.
              </p>
            </div>
          </div>

          {/* Prévisualisation */}
          <div style={{ flex: 1, overflow: 'auto', background: '#d1d1d1', padding: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ transform: 'scale(0.68)', transformOrigin: 'top center', marginBottom: -370, boxShadow: '0 12px 50px rgba(0,0,0,0.4)', borderRadius: 4, overflow: 'hidden' }}>
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
    try {
      await axios.post('/api/cv', cv);
      toast.success('CV sauvegardé ✅');
    } catch { toast.error('Erreur lors de la sauvegarde'); }
    finally { setSaving(false); }
  };

  const scoreCV = async () => {
    await saveCV();
    setScoring(true);
    try {
      const r = await axios.post('/api/ai/score-cv');
      setScore(r.data);
      toast.success(`Score obtenu : ${r.data.score}/100 🎯`);
    } catch { toast.error("Erreur lors de l'analyse IA"); }
    finally { setScoring(false); }
  };

  const optimizeSection = async (section, content) => {
    const target = cv.personalInfo.objective || 'poste général';
    setOptimizing(section);
    try {
      const r = await axios.post('/api/ai/optimize-cv', { section, content, targetJob: target, tone: 'professionnel et dynamique' });
      if (section === 'objective') setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, objective: r.data.optimized } }));
      toast.success('Section optimisée par l\'IA ✨');
    } catch { toast.error('Erreur IA'); }
    finally { setOptimizing(''); }
  };

  const addSkill = (skill) => {
    const s = skill || skillInput.trim();
    if (s && !cv.skills.includes(s)) { setCv(c => ({ ...c, skills: [...c.skills, s] })); setSkillInput(''); }
  };
  const removeSkill = (s) => setCv(c => ({ ...c, skills: c.skills.filter(x => x !== s) }));

  const addEdu = () => setCv(c => ({ ...c, education: [...c.education, { degree: '', school: '', year: '', description: '' }] }));
  const removeEdu = (i) => setCv(c => ({ ...c, education: c.education.filter((_, idx) => idx !== i) }));
  const updateEdu = (i, field, val) => setCv(c => ({ ...c, education: c.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  const addExp = () => setCv(c => ({ ...c, experience: [...c.experience, { title: '', company: '', duration: '', description: '' }] }));
  const removeExp = (i) => setCv(c => ({ ...c, experience: c.experience.filter((_, idx) => idx !== i) }));
  const updateExp = (i, field, val) => setCv(c => ({ ...c, experience: c.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e) }));

  const addLang = () => setCv(c => ({ ...c, languages: [...c.languages, { language: '', level: 'Intermédiaire' }] }));
  const removeLang = (i) => setCv(c => ({ ...c, languages: c.languages.filter((_, idx) => idx !== i) }));
  const updateLang = (i, field, val) => setCv(c => ({ ...c, languages: c.languages.map((l, idx) => idx === i ? { ...l, [field]: val } : l) }));

  const sections = [
    { id: 'personal',    label: '👤 Informations personnelles' },
    { id: 'education',   label: '🎓 Formation' },
    { id: 'experience',  label: '💼 Expériences' },
    { id: 'skills',      label: '⚡ Compétences' },
    { id: 'languages',   label: '🌍 Langues' },
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
          <button onClick={() => { saveCV(); setShowDownload(true); }} className="btn btn-secondary" style={{ borderColor: 'rgba(201,168,76,0.5)', color: 'var(--accent-gold-light)' }}>
            <Download size={15} /> Télécharger CV
          </button>
          <button onClick={scoreCV} className="btn btn-primary" disabled={scoring}>
            {scoring ? <><span className="spinner" style={{ width: 15, height: 15 }}></span> Analyse IA...</> : <><Star size={15} /> Analyser mon CV</>}
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
                  {sec.id === 'personal' && (
                    <div>
                      <div className="grid-2" style={{ gap: '1rem' }}>
                        <div className="form-group"><label className="form-label">Nom complet</label><input className="form-input" value={cv.personalInfo.name} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, name: e.target.value } }))} placeholder="Prénom Nom" /></div>
                        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={cv.personalInfo.email} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, email: e.target.value } }))} placeholder="email@exemple.com" /></div>
                        <div className="form-group"><label className="form-label">Téléphone</label><input className="form-input" value={cv.personalInfo.phone} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, phone: e.target.value } }))} placeholder="+212 6XX XXX XXX" /></div>
                        <div className="form-group"><label className="form-label">Ville</label><input className="form-input" value={cv.personalInfo.city} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, city: e.target.value } }))} placeholder="Casablanca, Agadir..." /></div>
                      </div>
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <label className="form-label" style={{ margin: 0 }}>Objectif professionnel</label>
                          <button className="btn btn-secondary btn-sm" onClick={() => optimizeSection('objective', cv.personalInfo.objective)} disabled={optimizing === 'objective'}>
                            {optimizing === 'objective' ? <span className="spinner" style={{ width: 12, height: 12 }}></span> : <Zap size={12} />} IA
                          </button>
                        </div>
                        <textarea className="form-textarea" value={cv.personalInfo.objective} onChange={e => setCv(c => ({ ...c, personalInfo: { ...c.personalInfo, objective: e.target.value } }))} placeholder="Ex: Chercheur d'emploi dynamique avec 3 ans d'expérience..." rows={4} />
                      </div>
                    </div>
                  )}

                  {sec.id === 'education' && (
                    <div>
                      {cv.education.map((edu, i) => (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => removeEdu(i)}><Trash2 size={14} /></button>
                          </div>
                          <div className="grid-2" style={{ gap: '0.75rem' }}>
                            <div className="form-group"><label className="form-label">Diplôme</label><input className="form-input" value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="Licence, Master, BTS..." /></div>
                            <div className="form-group"><label className="form-label">École / Université</label><input className="form-input" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} placeholder="ENCG, FSJES..." /></div>
                            <div className="form-group"><label className="form-label">Année</label><input className="form-input" value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)} placeholder="2020 - 2023" /></div>
                            <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={edu.description} onChange={e => updateEdu(i, 'description', e.target.value)} placeholder="Spécialité, mention..." /></div>
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-secondary" onClick={addEdu}><Plus size={16} /> Ajouter une formation</button>
                    </div>
                  )}

                  {sec.id === 'experience' && (
                    <div>
                      {cv.experience.map((exp, i) => (
                        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                            <button className="btn btn-danger btn-sm" onClick={() => removeExp(i)}><Trash2 size={14} /></button>
                          </div>
                          <div className="grid-2" style={{ gap: '0.75rem' }}>
                            <div className="form-group"><label className="form-label">Poste</label><input className="form-input" value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Chargé de clientèle..." /></div>
                            <div className="form-group"><label className="form-label">Entreprise</label><input className="form-input" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Nom de l'entreprise" /></div>
                            <div className="form-group"><label className="form-label">Durée</label><input className="form-input" value={exp.duration} onChange={e => updateExp(i, 'duration', e.target.value)} placeholder="Jan 2022 - Déc 2023" /></div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Description des tâches</label>
                            <textarea className="form-textarea" value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} placeholder="Décrivez vos responsabilités et réalisations..." rows={3} />
                          </div>
                        </div>
                      ))}
                      <button className="btn btn-secondary" onClick={addExp}><Plus size={16} /> Ajouter une expérience</button>
                    </div>
                  )}

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
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Suggestions populaires au Maroc :</p>
                        <div className="tags-container">
                          {SKILL_SUGGESTIONS.filter(s => !cv.skills.includes(s)).slice(0, 12).map(s => (
                            <div key={s} className="tag" style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }} onClick={() => addSkill(s)}>+ {s}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

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
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>{score.score}</div>
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
              <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{score.feedback}</p>
              </div>
              {score.tips?.length > 0 && (
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.6rem' }}>💡 Conseils :</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {score.tips.map((t, i) => <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1rem', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>→</span>{t}</li>)}
                  </ul>
                </div>
              )}
              {/* Bouton télécharger aussi dans le panneau score */}
              <button onClick={() => setShowDownload(true)} className="btn btn-secondary btn-full" style={{ marginTop: '1rem', borderColor: 'rgba(201,168,76,0.4)', color: 'var(--accent-gold-light)' }}>
                <Download size={15} /> Télécharger ce CV
              </button>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Star size={40} color="var(--accent-gold)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Analysez votre CV</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Obtenez un score et des recommandations personnalisées par l'IA</p>
              <button onClick={scoreCV} className="btn btn-primary btn-full" disabled={scoring}>
                {scoring ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Analyse...</> : <><Star size={16} /> Analyser maintenant</>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal téléchargement */}
      {showDownload && <DownloadModal cv={cv} userName={user?.name} onClose={() => setShowDownload(false)} />}
    </div>
  );
}