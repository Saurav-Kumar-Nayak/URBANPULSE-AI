import React, { useState } from 'react';
import Modal from './Modal';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login, isLoginModalOpen, setIsLoginModalOpen, authError, setAuthError } = useUrbanPulseContext();
  const [username, setUsername] = useState('operator@urbanpulse.ai');
  const [password, setPassword] = useState('urbanpulse2026');
  const [isLoading, setIsLoading] = useState(false);

  const effectiveOpen = isOpen !== undefined ? isOpen : isLoginModalOpen;
  const effectiveClose = onClose || (() => setIsLoginModalOpen(false));

  const handleLogin = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    if (result.success) {
      effectiveClose();
    }
  };

  const setDemoCredentials = (roleType) => {
    if (roleType === 'operator') {
      setUsername('operator@urbanpulse.ai');
      setPassword('urbanpulse2026');
    } else {
      setUsername('admin@urbanpulse.ai');
      setPassword('admin2026');
    }
    setAuthError(null);
  };

  return (
    <Modal isOpen={effectiveOpen} onClose={effectiveClose} title="Municipal Operator Sign In" maxWidth="460px">
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: '1.4' }}>
          Authorized municipal operator access required to view protected Command Center telemetry and AI decision controls.
        </div>

        {authError && (
          <div style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '10px 12px', color: '#fb7185', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#fb7185" style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Operator ID / Email</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={16} color="#38bdf8" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="operator@urbanpulse.ai"
              required
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                background: '#0d131c',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Password</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={16} color="#38bdf8" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                background: '#0d131c',
                border: '1px solid #1e293b',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Pre-configured Demo Access Buttons */}
        <div style={{ background: '#0b111e', borderRadius: '8px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.70rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Quick Authorized Sign In:</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('operator')}
              style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Operator Credentials
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              style={{ flex: 1, padding: '4px 8px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Admin Credentials
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#38bdf8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
            <ShieldCheck size={14} /> HMAC Signed Auth
          </span>
          <span style={{ color: '#94a3b8' }}>Bhubaneswar Municipal Grid</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '4px',
            padding: '12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{isLoading ? 'Authenticating...' : 'Sign In to Operator Portal'}</span>
          {!isLoading && <ArrowRight size={16} />}
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;
