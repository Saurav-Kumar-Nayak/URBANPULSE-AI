import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';
import { aiService } from '../../services/aiService';

export const AICopilotDrawer = () => {
  const { isCopilotOpen, setIsCopilotOpen, copilotInitialQuery } = useUrbanPulseContext();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Greetings Commander. UrbanPulse AI Copilot active. I have analyzed 5,200 urban telemetry records across 8 metropolitan zones. How can I assist your city operations team today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metrics: null,
      confidence: '99.1%',
      recommendation: null
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Why is my area at risk?",
    "What is predicted next?",
    "Why did traffic increase?",
    "Show today's anomalies",
    "What should operators monitor?"
  ];

  useEffect(() => {
    if (copilotInitialQuery && isCopilotOpen) {
      handleSend(copilotInitialQuery);
    }
  }, [copilotInitialQuery, isCopilotOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isCopilotOpen) return null;

  const handleSend = async (textToSend) => {
    const userPrompt = textToSend || query;
    if (!userPrompt.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setLoading(true);

    try {
      const response = await aiService.queryCopilot(userPrompt);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.answer,
        metrics: response.metrics,
        confidence: response.confidence,
        recommendation: response.recommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Unable to sync telemetry query with backend. Please retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="copilot-drawer-backdrop" onClick={() => setIsCopilotOpen(false)} />
      
      <div className="copilot-drawer">
        {/* Header */}
        <div className="copilot-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 10px rgba(6,182,212,0.4)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
                UrbanPulse AI Copilot
              </h3>
              <p style={{ fontSize: '0.70rem', color: '#06b6d4', fontWeight: 600 }}>
                Urban Intelligence Assistant — Live Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCopilotOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Suggested Quick Prompts */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(13, 19, 28, 0.7)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#38bdf8',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                borderRadius: '9999px',
                padding: '5px 12px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)'}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="copilot-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.70rem', color: 'var(--text-dim)' }}>
                {msg.sender === 'bot' ? <Bot size={12} color="#06b6d4" /> : <User size={12} color="#8b5cf6" />}
                <span>{msg.sender === 'bot' ? 'AI Copilot' : 'Operator'}</span>
                <span>• {msg.timestamp}</span>
                {msg.confidence && (
                  <span style={{ color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                    Confidence {msg.confidence}
                  </span>
                )}
              </div>

              <div
                style={{
                  maxWidth: '90%',
                  padding: '12px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #06b6d4, #2563eb)' 
                    : 'rgba(17, 25, 35, 0.95)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  lineHeight: '1.45',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
              >
                <div>{msg.text}</div>

                {/* Metrics Breakdown if available */}
                {msg.metrics && msg.metrics.length > 0 && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {msg.metrics.map((m, mIdx) => (
                      <div key={mIdx} style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '6px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{m.label}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommended Action Box */}
                {msg.recommendation && (
                  <div style={{ marginTop: '10px', padding: '8px 10px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '3px solid #10b981', borderRadius: '4px', fontSize: '0.75rem', color: '#a7f3d0' }}>
                    <strong>Recommended Action:</strong> {msg.recommendation}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06b6d4', fontSize: '0.8rem', padding: '8px' }}>
              <RefreshCw size={14} className="spin" />
              <span>Analyzing live SQLite telemetry & ML engines...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="copilot-input-area">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI Copilot about traffic, AQI, or risks..."
              className="input-field"
              style={{ flex: 1 }}
              id="copilot-text-input"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-primary"
              style={{ padding: '9px 14px' }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AICopilotDrawer;
