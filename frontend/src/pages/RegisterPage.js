import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';

const SECTORS = ['', 'Offshoring / BPO', 'Informatique / IT', 'Tourisme / Hôtellerie', 'Commerce / Vente', 'Finance / Banque', 'BTP / Immobilier', 'Santé', 'Éducation', 'Industrie', 'Autre'];
const CITIES  = ['', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Laâyoune', 'Autre'];

const inp = { width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.86rem', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#111827', transition: 'border 0.2s', background: '#fff' };
const lbl = { display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' };
const focus = e => e.target.style.borderColor = '#2563eb';
const blur  = e => e.target.style.borderColor = '#e5e7eb';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '', sector: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Mot de passe : minimum 6 caractères');
    setLoading(true);
    try {
      await register(form);
      toast.success('Compte créé ! Bienvenue 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#eef2ff', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 1000, display: 'flex', borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(37,99,235,0.15)', minHeight: 620 }}>

        {/* ── Panneau gauche bleu ── */}
        <div style={{ flex: 1, background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: -60, pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: -40, left: -40, pointerEvents: 'none' }}></div>

          <div style={{ width: 76, height: 76, borderRadius: 20, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', backdropFilter: 'blur(8px)' }}>
            <Zap size={34} color="#ffffff" />
          </div>

          <div style={{ textAlign: 'center', maxWidth: 300 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35, marginBottom: '1rem' }}>
              Rejoignez{' '}
              <span style={{ color: '#93c5fd' }}>CVBoost AI</span>
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Des milliers de jeunes marocains utilisent CVBoost AI pour décrocher leur emploi idéal.
            </p>
            {['✅ CV optimisé ATS', "✅ Analyse d'offres en temps réel", '✅ Lettre de motivation IA', '✅ Assistant emploi 24/7'].map((f, i) => (
              <div key={i} style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.7)', textAlign: 'left', marginBottom: '0.5rem' }}>{f}</div>
            ))}
          </div>
        </div>

        {/* ── Panneau droit blanc ── */}
        <div style={{ width: 480, background: '#ffffff', display: 'flex', flexDirection: 'column', padding: '2rem 2.5rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
              Déjà inscrit ?{' '}
              <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 700 }}>Se connecter</Link>
            </span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.3rem' }}>Créer un compte</h1>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '1.5rem' }}>Rejoignez CVBoost AI gratuitement</p>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={lbl}>Nom complet *</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Prénom Nom" required style={inp} onFocus={focus} onBlur={blur} />
                </div>
                <div>
                  <label style={lbl}>Téléphone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+212 6XX XXX XXX" style={inp} onFocus={focus} onBlur={blur} />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="vous@exemple.com" required style={inp} onFocus={focus} onBlur={blur} />
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={lbl}>Mot de passe *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="minimum 6 caractères" required style={{ ...inp, paddingRight: '3rem' }} onFocus={focus} onBlur={blur} />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={lbl}>Ville</label>
                  <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ ...inp, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                    {CITIES.map(c => <option key={c} value={c}>{c || 'Choisir...'}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Secteur</label>
                  <select value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} style={{ ...inp, cursor: 'pointer' }} onFocus={focus} onBlur={blur}>
                    {SECTORS.map(s => <option key={s} value={s}>{s || 'Choisir...'}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '0.85rem', background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #3b82f6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 16px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}>
                {loading ? 'Création...' : <><span>Créer mon compte</span><ArrowRight size={18} /></>}
              </button>
            </form>
          </div>

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