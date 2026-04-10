import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, Eye, EyeOff, Briefcase } from 'lucide-react';

const SECTORS = ['', 'Offshoring / BPO', 'Informatique / IT', 'Tourisme / Hôtellerie', 'Commerce / Vente', 'Finance / Banque', 'BTP / Immobilier', 'Santé', 'Éducation', 'Industrie', 'Agriculture', 'Autre'];
const CITIES = ['', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Laâyoune', 'Autre'];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', city: '', sector: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Le mot de passe doit contenir au moins 6 caractères');
    setLoading(true);
    try {
      await register(form);
      toast.success('Compte créé avec succès ! Bienvenue 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: 'rgba(201,168,76,0.12)', borderRadius: 16, border: '1px solid rgba(201,168,76,0.3)', marginBottom: '1rem' }}>
            <Briefcase size={28} color="var(--accent-gold)" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CVBoost AI</h1>
          <p style={{ fontFamily: 'var(--font-arabic)', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>CVBoost</p>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' }}>Créer un compte</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>Rejoignez des milliers de chercheurs d'emploi au Maroc</p>

          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input type="text" className="form-input" placeholder="Votre nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-input" placeholder="+212 6XX XXX XXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" placeholder="vous@exemple.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} className="form-input" placeholder="Minimum 6 caractères" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Ville</label>
                <select className="form-select" value={form.city} onChange={e => setForm({...form, city: e.target.value})}>
                  {CITIES.map(c => <option key={c} value={c}>{c || 'Choisir...'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Secteur</label>
                <select className="form-select" value={form.sector} onChange={e => setForm({...form, sector: e.target.value})}>
                  {SECTORS.map(s => <option key={s} value={s}>{s || 'Choisir...'}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Création...</> : <><UserPlus size={18} /> Créer mon compte</>}
            </button>
          </form>

          <div className="divider"></div>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: 'var(--accent-gold-light)', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
