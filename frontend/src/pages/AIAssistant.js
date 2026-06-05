import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const QUICK_QUESTIONS = [
  'Comment optimiser mon CV pour l\'offshoring ?',
  'Quels secteurs recrutent le plus au Maroc ?',
  'Comment me préparer pour un entretien en français ?',
  'Quels mots-clés mettre dans mon CV pour passer les ATS ?',
  'Comment négocier mon salaire au Maroc ?',
  'Quelles compétences sont les plus demandées à Casablanca ?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'مرحبا ! Bonjour ! Je suis **CVBoost AI**, votre assistant IA spécialisé dans l\'emploi au Maroc 🇲🇦\n\nJe peux vous aider à :\n- Optimiser votre CV pour le marché marocain\n- Préparer vos entretiens\n- Identifier les opportunités dans votre secteur\n- Comprendre les codes du recrutement local\n\nQue puis-je faire pour vous aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }));
      const r = await axios.post('/api/ai/chat', { message: msg, history });
      setMessages(prev => [...prev, { role: 'ai', text: r.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Désolé, une erreur est survenue. Veuillez réessayer.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <span key={i} dangerouslySetInnerHTML={{ __html: bold + (i < text.split('\n').length - 1 ? '<br/>' : '') }} />;
    });
  };

  return (
    <div>
      <div className="section-header">
        <h1>Assistant IA</h1>
        <p>Conseils personnalisés pour votre recherche d'emploi au Maroc</p>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'start' }}>
        {/* Chat */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 560, padding: '1.25rem' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: msg.role === 'ai' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.08)', border: `1px solid ${msg.role === 'ai' ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  {msg.role === 'ai' ? <Bot size={16} color="var(--accent-gold)" /> : <User size={16} color="var(--text-secondary)" />}
                </div>
                <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`} style={{ fontSize: '0.87rem', lineHeight: 1.65 }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
                  <Bot size={16} color="var(--accent-gold)" />
                </div>
                <div className="chat-bubble ai" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)', opacity: 0.6, animation: `bounce 1.2s ${i * 0.2}s infinite` }}></div>)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <input
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !loading && send()}
              placeholder="Posez votre question..."
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button onClick={() => send()} className="btn btn-primary" disabled={loading || !input.trim()} style={{ padding: '0.7rem 1rem', flexShrink: 0 }}>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Quick questions */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={16} color="var(--accent-gold)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Questions fréquentes</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => send(q)} className="btn btn-secondary" disabled={loading} style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.82rem', padding: '0.7rem 1rem', lineHeight: 1.4 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginTop: '1rem', background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.2)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              🤖 Propulsé par <strong style={{ color: 'var(--accent-gold-light)' }}>Groq LLaMA 3</strong> — Réponses rapides et contextualisées pour le marché marocain.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
