import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

const slides = [
  { title: "Optimisez votre", highlight: "CV avec l'IA", desc: "Obtenez un score détaillé et des recommandations personnalisées pour le marché marocain." },
  { title: "Analysez chaque", highlight: "Offre d'emploi", desc: "Comparez votre profil avec les offres de Rekrute et MarocAnnonces en quelques secondes." },
  { title: "Générez votre", highlight: "Lettre de motivation", desc: "Une lettre professionnelle en français marocain, adaptée à chaque poste visé." },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Bienvenue ! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#eef2ff', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(37,99,235,0.15)', minHeight: 580 }}>

        {/* ── Panneau gauche bleu ── */}
        <div style={{ flex: 1, background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
          {/* Cercles décoratifs */}
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -60, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -40, left: -40, pointerEvents: 'none' }}></div>

          {/* Logo */}
          <div style={{ width: 76, height: 76, borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem', backdropFilter: 'blur(8px)' }}>
            <Zap size={34} color="#ffffff" />
          </div>

          {/* Slide */}
          <div style={{ textAlign: 'center', maxWidth: 320, marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, marginBottom: '1rem' }}>
              {slides[slide].title}{' '}
              <span style={{ color: '#93c5fd' }}>{slides[slide].highlight}</span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
              {slides[slide].desc}
            </p>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, background: i === slide ? '#ffffff' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
            ))}
          </div>
        </div>

        {/* ── Panneau droit blanc ── */}
        <div style={{ width: 460, background: '#ffffff', display: 'flex', flexDirection: 'column', padding: '2rem 3rem' }}>
          {/* Top */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
              Pas de compte ?{' '}
              <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>S'inscrire</Link>
            </span>
          </div>

          {/* Form */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '0.4rem' }}>Bienvenue ! 👋</h1>
            <p style={{ fontSize: '0.83rem', color: '#9ca3af', marginBottom: '2rem' }}>Entrez vos identifiants pour accéder à votre compte</p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="johndoe@mail.com" required
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#111827', transition: 'border 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#2563eb'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="minimum 6 caractères" required
                    style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#111827', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#2563eb'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '0.85rem', background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #3b82f6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}>
                {loading ? 'Connexion...' : <><span>Se connecter</span><ArrowRight size={18} /></>}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'underline', cursor: 'pointer' }}>Mot de passe oublié ?</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#d1d5db', marginTop: '1.5rem' }}>
            <span>© 2025 CVBoost AI</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ cursor: 'pointer' }}>Confidentialité</span>
              <span style={{ cursor: 'pointer' }}>Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
