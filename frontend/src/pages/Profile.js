import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Save, Shield, MapPin, Briefcase } from 'lucide-react';

const SECTORS = ['', 'Offshoring / BPO', 'Informatique / IT', 'Tourisme / Hôtellerie', 'Commerce / Vente', 'Finance / Banque', 'BTP / Immobilier', 'Santé', 'Éducation', 'Industrie', 'Agriculture', 'Autre'];
const CITIES = ['', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Laâyoune', 'Autre'];

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', city: user?.city || '', sector: user?.sector || '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put('/api/auth/profile', form);
      toast.success('Profil mis à jour ✅');
    } catch { toast.error('Erreur lors de la mise à jour'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div className="section-header">
        <h1>Mon profil</h1>
        <p>Gérez vos informations personnelles</p>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: '#0d0d1a', flexShrink: 0 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{user?.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</div>
              {user?.city && <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}><MapPin size={12} />{user.city}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+212 6XX XXX XXX" />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <select className="form-select" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
                {CITIES.map(c => <option key={c} value={c}>{c || 'Choisir...'}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Secteur d'activité</label>
              <select className="form-select" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })}>
                {SECTORS.map(s => <option key={s} value={s}>{s || 'Choisir...'}</option>)}
              </select>
            </div>
          </div>

          <button onClick={save} className="btn btn-primary btn-full" disabled={saving}>
            {saving ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Sauvegarde...</> : <><Save size={16} /> Enregistrer les modifications</>}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Stats */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <User size={18} color="var(--accent-gold)" />
              <span style={{ fontWeight: 700 }}>Informations du compte</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                ['Email', user?.email],
                ['Ville', user?.city || 'Non renseignée'],
                ['Secteur', user?.sector || 'Non renseigné'],
                ['Membre depuis', new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })]
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'rgba(41,128,185,0.06)', borderColor: 'rgba(41,128,185,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={16} color="#3498db" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#3498db' }}>Sécurité</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Vos données sont sécurisées et ne sont pas partagées avec des tiers. Vos informations sont utilisées uniquement pour personnaliser votre expérience CVBoost AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
