import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Zap, CheckCircle, XCircle, Tag, TrendingUp, AlertTriangle, Briefcase, MapPin, ExternalLink, Star, Sparkles } from 'lucide-react';

export default function JobAnalyzer() {
  const [jobOffer, setJobOffer] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingReco, setLoadingReco] = useState(false);
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' | 'recommend'

  const analyze = async () => {
    if (!jobOffer.trim()) return toast.error("Veuillez coller une offre d'emploi");
    setLoading(true);
    setResult(null);
    try {
      const r = await axios.post('/api/ai/analyze-job', { jobOffer });
      setResult(r.data);
      toast.success('Analyse terminée !');
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    setLoadingReco(true);
    setRecommendations(null);
    try {
      const r = await axios.post('/api/ai/recommend-jobs');
      setRecommendations(r.data);
      toast.success('Recommandations générées !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors des recommandations');
    } finally {
      setLoadingReco(false);
    }
  };

  const getScoreColor = (s) => s >= 75 ? '#27ae60' : s >= 50 ? '#f39c12' : '#e74c3c';
  const getScoreLabel = (s) => s >= 75 ? 'Excellent match !' : s >= 50 ? 'Match moyen' : 'Match faible';

  return (
    <div>
      <div className="section-header">
        <h1>Analyser une offre d'emploi</h1>
        <p>Analysez votre compatibilité ou découvrez des offres adaptées à votre profil</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.4rem', borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content' }}>
        {[
          { id: 'analyze', label: '🔍 Analyser une offre', icon: Search },
          { id: 'recommend', label: '✨ Offres recommandées', icon: Sparkles }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '0.6rem 1.2rem', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-main)', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s', background: activeTab === tab.id ? 'var(--gradient-gold)' : 'transparent', color: activeTab === tab.id ? '#0d0d1a' : 'var(--text-secondary)' }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: Analyse d'offre ── */}
      {activeTab === 'analyze' && (
        <div className="grid-2" style={{ alignItems: 'start', gap: '1.5rem' }}>
          <div>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Offre d'emploi</div>
                <div className="card-subtitle">Copiez-collez le texte complet de l'offre (Rekrute, MarocAnnonces, LinkedIn...)</div>
              </div>
              <div className="form-group">
                <textarea className="form-textarea" value={jobOffer} onChange={e => setJobOffer(e.target.value)}
                  placeholder={`Copiez ici le texte de l'offre d'emploi...\n\nExemple :\nTitre : Chargé(e) de clientèle\nSecteur : Offshoring\nProfil recherché :\n- Bac+2 minimum\n- Maîtrise du français\n- Expérience en relation client\n- Maîtrise Excel, CRM...`}
                  rows={13} style={{ minHeight: 280 }} />
              </div>
              <button onClick={analyze} className="btn btn-primary btn-full btn-lg" disabled={loading || !jobOffer.trim()}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18 }}></span> Analyse en cours...</> : <><Search size={18} /> Analyser ma compatibilité</>}
              </button>
            </div>
            <div className="card" style={{ marginTop: '1rem', background: 'rgba(41,128,185,0.06)', borderColor: 'rgba(41,128,185,0.2)' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: '#3498db' }}>💡 Conseil :</strong> Complétez d'abord votre CV (compétences, ville, expériences) pour une analyse précise et des recommandations d'offres personnalisées.
              </p>
            </div>
          </div>

          {/* Results */}
          <div>
            {!result && !loading && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <Search size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.4 }} />
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Résultats de l'analyse</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Collez une offre et cliquez sur Analyser</p>
              </div>
            )}
            {loading && (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>L'IA analyse votre profil...</p>
              </div>
            )}
            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Score */}
                <div className="card" style={{ textAlign: 'center', background: `linear-gradient(135deg, ${getScoreColor(result.score)}15, ${getScoreColor(result.score)}08)`, borderColor: `${getScoreColor(result.score)}40` }}>
                  <div style={{ fontSize: '4rem', fontWeight: 800, color: getScoreColor(result.score), lineHeight: 1 }}>{result.score}%</div>
                  <div style={{ fontWeight: 700, marginTop: '0.4rem' }}>{getScoreLabel(result.score)}</div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <div className="progress-bar" style={{ height: 10 }}>
                      <div className="progress-fill" style={{ width: `${result.score}%`, background: getScoreColor(result.score) }}></div>
                    </div>
                  </div>
                </div>

                {result.matchedSkills?.length > 0 && (
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <CheckCircle size={16} color="#27ae60" />
                      <span style={{ fontWeight: 700, color: '#2ecc71', fontSize: '0.9rem' }}>Compétences correspondantes ({result.matchedSkills.length})</span>
                    </div>
                    <div className="tags-container">{result.matchedSkills.map(s => <div key={s} className="badge badge-green">{s}</div>)}</div>
                  </div>
                )}

                {result.missingSkills?.length > 0 && (
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <XCircle size={16} color="#e74c3c" />
                      <span style={{ fontWeight: 700, color: '#e74c3c', fontSize: '0.9rem' }}>Compétences manquantes ({result.missingSkills.length})</span>
                    </div>
                    <div className="tags-container">{result.missingSkills.map(s => <div key={s} className="badge badge-red">{s}</div>)}</div>
                  </div>
                )}

                {result.atsKeywords?.length > 0 && (
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <Tag size={16} color="var(--accent-gold)" />
                      <span style={{ fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '0.9rem' }}>Mots-clés ATS à ajouter</span>
                    </div>
                    <div className="tags-container">{result.atsKeywords.map(k => <div key={k} className="badge badge-gold">{k}</div>)}</div>
                  </div>
                )}

                {result.strengths?.length > 0 && (
                  <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <TrendingUp size={16} color="#27ae60" />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Vos points forts</span>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {result.strengths.map((s, i) => <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#2ecc71' }}>✓</span>{s}</li>)}
                    </ul>
                  </div>
                )}

                {result.recommendation && (
                  <div className="card" style={{ background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <AlertTriangle size={16} color="var(--accent-gold)" />
                      <span style={{ fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '0.9rem' }}>Recommandation IA</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.recommendation}</p>
                  </div>
                )}

                {/* Offres similaires recommandées */}
                {result.jobRecommendations?.length > 0 && (
                  <div className="card" style={{ background: 'rgba(155,89,182,0.06)', borderColor: 'rgba(155,89,182,0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Sparkles size={16} color="#9b59b6" />
                      <span style={{ fontWeight: 700, color: '#bb8fce', fontSize: '0.9rem' }}>Offres similaires pour votre profil</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {result.jobRecommendations.map((job, i) => (
                        <JobCard key={i} job={job} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Offres recommandées ── */}
      {activeTab === 'recommend' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Offres adaptées à votre profil</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>L'IA analyse vos compétences et votre ville pour vous suggérer les meilleures opportunités</p>
            </div>
            <button onClick={getRecommendations} className="btn btn-primary" disabled={loadingReco}>
              {loadingReco ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Recherche...</> : <><Sparkles size={16} /> Trouver mes offres</>}
            </button>
          </div>

          {!recommendations && !loadingReco && (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Briefcase size={56} color="var(--text-muted)" style={{ marginBottom: '1.25rem', opacity: 0.35 }} />
              <h3 style={{ fontWeight: 700, marginBottom: '0.6rem' }}>Découvrez vos opportunités</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
                Cliquez sur "Trouver mes offres" pour que l'IA analyse votre CV et vous propose des postes compatibles avec vos compétences et votre ville.
              </p>
              <button onClick={getRecommendations} className="btn btn-primary btn-lg">
                <Sparkles size={18} /> Trouver mes offres
              </button>
            </div>
          )}

          {loadingReco && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div className="spinner" style={{ width: 44, height: 44, borderWidth: 3, margin: '0 auto 1.25rem' }}></div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>L'IA analyse votre profil...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Recherche des offres compatibles avec vos compétences et votre ville</p>
            </div>
          )}

          {recommendations && (
            <div>
              {recommendations.profileSummary && (
                <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(201,168,76,0.07)', borderColor: 'rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Star size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--accent-gold-light)', fontSize: '0.85rem' }}>Votre profil : </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{recommendations.profileSummary}</span>
                    {recommendations.topSectors?.length > 0 && (
                      <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {recommendations.topSectors.map(s => <div key={s} className="badge badge-gold" style={{ fontSize: '0.72rem' }}>{s}</div>)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid-2" style={{ gap: '1rem' }}>
                {(recommendations.recommendations || []).map((job, i) => (
                  <div key={i} className="card" style={{ transition: 'all 0.25s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{job.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600 }}>{job.company}</div>
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: getScoreColor(job.matchScore), flexShrink: 0, marginLeft: '0.75rem' }}>{job.matchScore}%</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <MapPin size={12} />{job.location}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <Briefcase size={12} />{job.sector}
                      </div>
                    </div>

                    <div className="progress-bar" style={{ marginBottom: '0.75rem' }}>
                      <div className="progress-fill" style={{ width: `${job.matchScore}%`, background: getScoreColor(job.matchScore) }}></div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{job.reason}</p>

                    {job.requiredSkills?.length > 0 && (
                      <div style={{ marginBottom: '0.6rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Compétences requises</div>
                        <div className="tags-container">
                          {job.requiredSkills.slice(0, 4).map(s => <div key={s} className="badge badge-green" style={{ fontSize: '0.72rem' }}>{s}</div>)}
                        </div>
                      </div>
                    )}

                    {job.missingSkills?.length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>À acquérir</div>
                        <div className="tags-container">
                          {job.missingSkills.slice(0, 3).map(s => <div key={s} className="badge badge-red" style={{ fontSize: '0.72rem' }}>{s}</div>)}
                        </div>
                      </div>
                    )}

                    {job.searchUrl && (
                      <a href={job.searchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm btn-full" style={{ textDecoration: 'none', marginTop: '0.25rem' }}>
                        <ExternalLink size={13} /> Chercher sur Rekrute
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={getRecommendations} className="btn btn-secondary" disabled={loadingReco}>
                  <Sparkles size={15} /> Actualiser les recommandations
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }) {
  const getScoreColor = (s) => s >= 75 ? '#27ae60' : s >= 50 ? '#f39c12' : '#e74c3c';
  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '0.9rem', border: '1px solid rgba(155,89,182,0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{job.title}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{job.company}</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: getScoreColor(job.matchScore), flexShrink: 0 }}>{job.matchScore}%</div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={11} />{job.location}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Briefcase size={11} />{job.sector}</span>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>{job.reason}</p>
      {job.searchUrl && (
        <a href={job.searchUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#bb8fce', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ExternalLink size={12} /> Voir les offres similaires
        </a>
      )}
    </div>
  );
}
