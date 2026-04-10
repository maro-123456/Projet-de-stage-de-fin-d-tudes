import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FileText, Search, Mail, Bot, TrendingUp, Star, ArrowRight, Zap } from 'lucide-react';

const quickActions = [
  { to: '/cv', icon: FileText, label: 'Créer / Modifier mon CV', desc: 'Construisez un CV optimisé ATS', color: '#c9a84c' },
  { to: '/job-analyzer', icon: Search, label: 'Analyser une offre', desc: 'Comparez votre profil avec une offre', color: '#3498db' },
  { to: '/cover-letter', icon: Mail, label: 'Lettre de motivation', desc: 'Générez une lettre personnalisée', color: '#27ae60' },
  { to: '/assistant', icon: Bot, label: 'Assistant IA', desc: 'Conseils emploi personnalisés', color: '#9b59b6' },
];

const tips = [
  "Ajoutez des mots-clés spécifiques au secteur dans votre CV pour passer les filtres ATS.",
  "Mentionnez votre niveau de français et d'anglais clairement — très valorisé dans l'offshoring.",
  "Adaptez votre lettre de motivation à chaque entreprise marocaine.",
  "Listez vos compétences Excel, Word et outils métiers — très demandés au Maroc.",
  "Précisez votre ville de résidence dans votre CV pour les employeurs locaux.",
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
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>
          {greeting}, <span style={{ background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>Votre tableau de bord d'insertion professionnelle au Maroc</p>
      </div>

      {/* CV Score Banner */}
      {cv && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05))', borderColor: 'rgba(201,168,76,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '3px solid var(--accent-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-gold-light)', lineHeight: 1 }}>{cv.score || 0}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Score de votre CV</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {cv.score >= 80 ? '🌟 Excellent CV !' : cv.score >= 60 ? '✅ Bon CV, améliorable' : cv.score > 0 ? '⚡ Besoin d\'améliorations' : 'Complétez votre CV pour obtenir un score'}
              </div>
            </div>
          </div>
          <Link to="/cv" className="btn btn-primary">
            <TrendingUp size={16} /> Améliorer mon CV <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>Actions rapides</h2>
        <div className="grid-2">
          {quickActions.map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{desc}</div>
                </div>
                <ArrowRight size={16} color="var(--text-muted)" style={{ marginTop: 4, flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Tip of the day */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(39,174,96,0.08), rgba(39,174,96,0.03))', borderColor: 'rgba(39,174,96,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Zap size={16} color="#27ae60" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2ecc71' }}>Conseil du jour</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{tip}</p>
        </div>

        {/* Moroccan market insight */}
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(41,128,185,0.08), rgba(41,128,185,0.03))', borderColor: 'rgba(41,128,185,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Star size={16} color="#3498db" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#3498db' }}>Marché marocain 🇲🇦</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[['Offshoring / BPO', '↑ Fort recrutement'], ['IT & Digital', '↑ Très dynamique'], ['Tourisme', '↑ En reprise'], ['Commerce', '→ Stable']].map(([sector, status]) => (
              <div key={sector} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{sector}</span>
                <span style={{ fontSize: '0.75rem', color: status.includes('↑') ? '#2ecc71' : '#f39c12', fontWeight: 600 }}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile completion */}
      {!cv?.personalInfo?.objective && (
        <div className="alert alert-info" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span>💡 Complétez votre CV pour obtenir votre score et des recommandations personnalisées !</span>
          <Link to="/cv" className="btn btn-secondary btn-sm">Compléter mon CV</Link>
        </div>
      )}
    </div>
  );
}
