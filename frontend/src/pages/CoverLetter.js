import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Mail, Sparkles, Copy, Check } from 'lucide-react';

export default function CoverLetter() {
  const [form, setForm] = useState({ jobTitle: '', companyName: '', jobOffer: '' });
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!form.jobTitle || !form.companyName) return toast.error('Remplissez le poste et l\'entreprise');
    setLoading(true);
    try {
      const r = await axios.post('/api/ai/cover-letter', form);
      setLetter(r.data.letter);
      toast.success('Lettre générée avec succès ✉️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    toast.success('Lettre copiée !');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="section-header">
        <h1>Lettre de motivation</h1>
        <p>Générez une lettre professionnelle adaptée au marché marocain</p>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Informations du poste</div>
            <div className="card-subtitle">Renseignez les détails pour personnaliser votre lettre</div>
          </div>

          <div className="form-group">
            <label className="form-label">Poste visé *</label>
            <input className="form-input" value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} placeholder="Ex: Chargé(e) de clientèle, Développeur Web..." />
          </div>

          <div className="form-group">
            <label className="form-label">Nom de l'entreprise *</label>
            <input className="form-input" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Ex: Attijariwafa Bank, Capgemini Maroc..." />
          </div>

          <div className="form-group">
            <label className="form-label">Description du poste (optionnel)</label>
            <textarea className="form-textarea" value={form.jobOffer} onChange={e => setForm({ ...form, jobOffer: e.target.value })} placeholder="Collez ici le texte de l'offre pour une lettre encore plus personnalisée..." rows={5} />
          </div>

          <button onClick={generate} className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Génération en cours...</> : <><Sparkles size={18} /> Générer ma lettre</>}
          </button>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(201,168,76,0.06)', borderRadius: 10, border: '1px solid rgba(201,168,76,0.2)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              🇲🇦 <strong style={{ color: 'var(--accent-gold-light)' }}>Format marocain :</strong> La lettre sera générée en français professionnel avec les conventions marocaines (en-tête, formule de politesse adaptée).
            </p>
          </div>
        </div>

        <div>
          {!letter && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Votre lettre apparaîtra ici</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Remplissez le formulaire et générez votre lettre personnalisée</p>
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto 1rem' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>L'IA rédige votre lettre...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Adaptation au format marocain en cours</p>
            </div>
          )}

          {letter && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <div className="card-title">Lettre de motivation générée</div>
                  <div className="card-subtitle">Format professionnel marocain</div>
                </div>
                <button onClick={copy} className="btn btn-secondary btn-sm">
                  {copied ? <><Check size={14} /> Copié !</> : <><Copy size={14} /> Copier</>}
                </button>
              </div>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '1.5rem', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxHeight: 500, overflowY: 'auto' }}>
                {letter}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button onClick={generate} className="btn btn-secondary btn-sm">
                  <Sparkles size={14} /> Régénérer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
