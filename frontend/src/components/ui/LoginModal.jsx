import React, { useState } from 'react';
import Modal from './Modal';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { setActiveTab } = useUrbanPulseContext();
  const [email, setEmail] = useState('admin@urbanpulse.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      setActiveTab('command-center');
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="UrbanPulse AI Portal Access" maxWidth="440px">
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' }}>
          Enter your operator credentials to access the Smart City Intelligence Command Center.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600 }}>Email Address</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Mail size={16} color="#06b6d4" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <Lock size={16} color="#06b6d4" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#38bdf8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34d399' }}>
            <ShieldCheck size={14} /> 2FA Secured
          </span>
          <span style={{ cursor: 'pointer' }}>Forgot Password?</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '8px',
            padding: '12px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            border: 'none',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          {!isLoading && <ArrowRight size={16} />}
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;
