import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import aiService from '../services/aiService';
import { Bot, Send, Sparkles, User, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export const AICopilotPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: 'Hello! I am **UrbanPulse AI Copilot**, your real-time urban analytics and predictive intelligence assistant. Ask me anything about traffic congestion, particulate air quality, or risk anomalies.',
      metrics: [
        { label: 'Dataset Sync', value: '5,200 records' },
        { label: 'ML Status', value: 'Operational' },
        { label: 'Monitored Zones', value: '8 Locations' }
      ],
      confidence: '99.0%',
      recommendation: 'Select a suggested query below or enter a custom prompt.'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQueries = [
    'Which zone has the highest predicted congestion?',
    'What is the current highest-risk zone?',
    'How is air quality changing?',
    'What should city operators monitor today?'
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await aiService.queryCopilot(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: response.answer,
          metrics: response.metrics,
          confidence: response.confidence,
          recommendation: response.recommendation
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: 'Unable to process query against live backend. Please ensure the backend server is online at `http://localhost:8000`.',
          confidence: 'N/A'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="URBANPULSE AI COPILOT"
      subtitle="Ask questions about your city's data, traffic patterns, air quality, and risk anomalies"
      badge={<Badge variant="violet">AI Assistant Online</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', height: 'calc(100vh - 180px)' }}>
        {/* Main Chat Feed */}
        <Card style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
          {/* Messages Window */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: msg.sender === 'user' ? '75%' : '90%',
                }}
              >
                {msg.sender === 'copilot' && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={20} />
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.15)' : '#0D131C',
                    border: `1px solid ${msg.sender === 'user' ? 'rgba(6, 182, 212, 0.35)' : '#202B38'}`,
                    padding: '16px 20px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                  }}
                >
                  <p style={{ marginBottom: msg.metrics ? '12px' : 0 }}>{msg.text}</p>

                  {/* Metrics Badges */}
                  {msg.metrics && msg.metrics.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {msg.metrics.map((m, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(17, 25, 35, 0.9)',
                            border: '1px solid #202B38',
                            fontSize: '0.75rem',
                          }}
                        >
                          <span style={{ color: '#64748b' }}>{m.label}: </span>
                          <strong style={{ color: '#38bdf8' }}>{m.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommendation Card */}
                  {msg.recommendation && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        fontSize: '0.78rem',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <CheckCircle size={15} />
                      <span><strong>Recommended Action:</strong> {msg.recommendation}</span>
                    </div>
                  )}

                  {msg.confidence && (
                    <div style={{ marginTop: '8px', fontSize: '0.68rem', color: '#64748b', textAlign: 'right' }}>
                      Confidence Indicator: <span style={{ color: '#c084fc' }}>{msg.confidence}</span>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#202B38',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#06b6d4',
                      flexShrink: 0,
                    }}
                  >
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #202B38', backgroundColor: '#0D131C' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: '12px' }}
            >
              <input
                type="text"
                className="input-field"
                placeholder="Ask UrbanPulse AI about traffic, air quality, or risk anomalies..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
              />
              <Button variant="primary" loading={loading} icon={Send} type="submit">
                Ask AI
              </Button>
            </form>
          </div>
        </Card>

        {/* Suggested Queries Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#06b6d4" />
              Suggested Operator Queries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(32, 43, 56, 0.4)',
                    border: '1px solid #202B38',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.12)';
                    e.currentTarget.style.borderColor = '#06b6d4';
                    e.currentTarget.style.color = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(32, 43, 56, 0.4)';
                    e.currentTarget.style.borderColor = '#202B38';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <span>{q}</span>
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </Card>

          <Card style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} color="#f59e0b" />
              AI Reasoning Engine
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.5 }}>
              UrbanPulse AI Copilot cross-references live telemetry records from the FastAPI backend with Scikit-learn model feature weights to deliver evidence-backed recommendations for city operators.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default AICopilotPage;
