import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, Eye, EyeOff, Zap } from 'lucide-react';

const SECTORS = ['', 'Offshoring / BPO', 'Informatique / IT', 'Tourisme / Hôtellerie', 'Commerce / Vente', 'Finance / Banque', 'BTP / Immobilier', 'Santé', 'Éducation', 'Industrie', 'Agriculture', 'Autre'];
const CITIES  = ['', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Laâyoune', 'Autre'];

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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f4f6fb' }}>
      {/* Left */}
      <div style={{ flex: 1, background: 'var(--gradient-blue)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#fff' }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={24} color="#fff" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800 }}>CVBoost AI</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>Rejoignez des milliers de candidats 🇲🇦</h2>
          <p style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Créez votre compte gratuitement et commencez à optimiser votre recherche d'emploi au Maroc dès aujourd'hui.
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ width: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fff', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>Créer un compte</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Rejoignez CVBoost AI gratuitement</p>

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input type="text" className="form-input" placeholder="Votre nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-input" placeholder="+212 6XX XXX XXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" placeholder="vous@exemple.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} className="form-input" placeholder="Minimum 6 caractères" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Ville</label>
                <select className="form-select" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
                  {CITIES.map(c => <option key={c} value={c}>{c || 'Choisir...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Secteur</label>
                <select className="form-select" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                  {SECTORS.map(s => <option key={s} value={s}>{s || 'Choisir...'}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 17, height: 17 }}></span> Création...</> : <><UserPlus size={17} /> Créer mon compte</>}
            </button>
          </form>

          <div className="divider"></div>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
