import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FileText, Search, Mail, Bot, TrendingUp, ArrowRight, Zap, Upload, BookOpen } from 'lucide-react';
const quickActions = [
  { to: '/cv',           icon: FileText, label: 'Générer mon CV',       desc: 'CV optimisé pour le marché marocain', color: '#2563eb', bg: '#eff6ff' },
  { to: '/cover-letter', icon: Mail,     label: 'Lettre de motivation', desc: 'Personnalisée pour chaque offre',     color: '#7c3aed', bg: '#f5f3ff' },
  { to: '/job-analyzer', icon: Search,   label: "Offres d'emploi",      desc: 'Offres réelles du Maroc',            color: '#ea580c', bg: '#fff7ed' },
  { to: '/assistant',    icon: Bot,      label: 'Simulation entretien', desc: "Entraînez-vous avec l'IA",           color: '#0891b2', bg: '#ecfeff' },
];

const tips = [
  "Ajoutez des résultats chiffrés dans vos expériences pour améliorer l'impact de votre CV.",
  "Mentionnez votre niveau de français et d'anglais — très valorisé dans l'offshoring.",
  "Adaptez votre lettre de motivation à chaque entreprise marocaine.",
  "Listez vos compétences Excel, Word et outils métiers — très demandés au Maroc.",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [cv, setCv] = useState(null);
  const [tip] = useState(tips[Math.floor(Math.random() * tips.length)]);

  useEffect(() => {
    axios.get('/api/cv').then(r => setCv(r.data)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderRadius: 20,
        padding: '2rem',
        marginBottom: '1.5rem',
        border: '1px solid #bfdbfe',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>
            {greeting} {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: '#374151', marginTop: '0.3rem', fontWeight: 500 }}>
            Prêt à booster votre carrière aujourd'hui ?
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            CVBoost AI vous accompagne à chaque étape de votre recherche d'emploi.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/cv" className="btn btn-primary">
              <FileText size={16} /> Créer / Améliorer mon CV
            </Link>
            <Link to="/job-analyzer" className="btn btn-secondary">
              <Search size={16} /> Voir les offres
            </Link>
          </div>
        </div>
        <div style={{ fontSize: '4rem', opacity: 0.7 }}>🚀</div>
      </div>

      {/* Quick actions */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {quickActions.map(({ to, icon: Icon, label, desc, color, bg }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{desc}</div>
              </div>
              <ArrowRight size={16} color="#9ca3af" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Score CV */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 700 }}>Score CV</span>
            <Link to="/cv" style={{ fontSize: '0.78rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              Améliorer →
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32" fill="none" stroke="#2563eb" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 32 * (cv?.score || 0) / 100} ${2 * Math.PI * 32}`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2563eb' }}>{cv?.score || 0}</span>
                <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: '#111827' }}>
                {cv?.score >= 80 ? '🌟 Excellent !' : cv?.score >= 60 ? '✅ Bon CV' : cv?.score > 0 ? '⚡ À améliorer' : 'Complétez votre CV'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.5 }}>
                {cv?.feedback ? cv.feedback.substring(0, 80) + '...' : 'Analysez votre CV pour obtenir un score'}
              </div>
              <Link to="/cv" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                <TrendingUp size={13} /> Analyser
              </Link>
            </div>
          </div>
        </div>

        {/* Conseil du jour */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 32, height: 32, background: '#fef3c7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="#d97706" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Conseil du jour</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{tip}</p>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
            <p style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 500 }}>
              🇲🇦 Marché marocain — Secteurs qui recrutent : Offshoring, IT, Tourisme
            </p>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>Actions rapides</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { to: '/cv',           icon: Upload,   label: 'Importer un CV',     desc: 'Upload PDF ou Word',        color: '#2563eb', bg: '#eff6ff' },
            { to: '/job-analyzer', icon: Search,   label: 'Analyser une offre', desc: "Collez l'offre d'emploi",  color: '#7c3aed', bg: '#f5f3ff' },
            { to: '/job-analyzer', icon: BookOpen, label: 'Voir les offres',    desc: 'Offres du Maroc',           color: '#ea580c', bg: '#fff7ed' },
            { to: '/assistant',    icon: Bot,      label: 'Entretien IA',       desc: 'Démarrer une session',      color: '#0891b2', bg: '#ecfeff' },
          ].map((a, i) => (
            <Link key={i} to={a.to} style={{ textDecoration: 'none', flex: '1 1 140px' }}>
              <div
                style={{ background: a.bg, borderRadius: 12, padding: '1rem', border: `1px solid ${a.bg}`, textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <a.icon size={24} color={a.color} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111827', marginBottom: '0.2rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{a.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
