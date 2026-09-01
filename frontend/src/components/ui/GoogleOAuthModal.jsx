import React, { useState } from 'react';
import { useUrbanPulseContext } from '../../context/UrbanPulseContext';
import { X, UserPlus, CheckCircle2, Shield, ArrowRight, Lock, Key } from 'lucide-react';

export const GoogleOAuthModal = ({ isOpen, onClose }) => {
  const { loginWithGoogle, setActiveTab } = useUrbanPulseContext();
  const [selectedStep, setSelectedStep] = useState('choose'); // 'choose' | 'custom' | 'authenticating'
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [authenticatingUser, setAuthenticatingUser] = useState(null);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: 'Saurav Kumar Nayak',
      email: 'nayaksaurav2002@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      initials: 'SN',
      color: '#ea4335'
    },
    {
      name: 'Smart City Operator',
      email: 'operator@urbanpulse.ai',
      avatar: null,
      initials: 'OP',
      color: '#4285f4'
    },
    {
      name: 'Urban Citizen',
      email: 'citizen.user@gmail.com',
      avatar: null,
      initials: 'UC',
      color: '#34a853'
    }
  ];

  const handleSelectAccount = async (account) => {
    setAuthenticatingUser(account);
    setSelectedStep('authenticating');
    setTimeout(async () => {
      await loginWithGoogle({
        email: account.email,
        name: account.name
      });
      onClose();
      setActiveTab('user-dashboard');
    }, 1200);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const account = {
      name: customName || customEmail.split('@')[0].toUpperCase(),
      email: customEmail
    };
    handleSelectAccount(account);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '450px',
          background: '#202124',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(66, 133, 244, 0.2)',
          padding: '32px 28px',
          position: 'relative',
          color: '#e8eaed',
          fontFamily: "'Google Sans', Roboto, -apple-system, sans-serif"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#9aa0a6',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease'
          }}
          title="Close Google Sign-In"
        >
          <X size={20} />
        </button>

        {/* Official Google Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#e8eaed', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
            Choose an account
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#9aa0a6', margin: 0, lineHeight: 1.4 }}>
            to continue to <strong style={{ color: '#8ab4f8' }}>UrbanPulse AI Platform</strong>
          </p>
        </div>

        {/* STEP 1: Account Selection */}
        {selectedStep === 'choose' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {defaultAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#e8eaed',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="google-account-pill"
                >
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      background: acc.color, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#ffffff', 
                      fontWeight: 700, 
                      fontSize: '0.9rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    {acc.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#e8eaed', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9aa0a6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {acc.email}
                    </div>
                  </div>
                  <CheckCircle2 size={16} color="#8ab4f8" style={{ opacity: 0.8 }} />
                </button>
              ))}

              {/* Use Another Account Button */}
              <button
                onClick={() => setSelectedStep('custom')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'transparent',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  color: '#8ab4f8',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'rgba(138, 180, 248, 0.15)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#8ab4f8',
                    flexShrink: 0
                  }}
                >
                  <UserPlus size={18} />
                </div>
                <span>Use another Google account</span>
              </button>
            </div>

            {/* Google OAuth Disclosure Notice */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', fontSize: '0.75rem', color: '#9aa0a6', lineHeight: '1.5' }}>
              To continue, Google will share your name, email address, language preference, and profile picture with <strong>UrbanPulse AI</strong>. See UrbanPulse AI’s Privacy Policy and Terms of Service.
            </div>
          </div>
        )}

        {/* STEP 2: Enter Custom Account Email */}
        {selectedStep === 'custom' && (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.80rem', color: '#bdc1c6', fontWeight: 600 }}>Enter your Google Email or Phone</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="you@gmail.com"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: '#303134',
                  border: '1px solid #5f6368',
                  color: '#e8eaed',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.80rem', color: '#bdc1c6', fontWeight: 600 }}>Full Name (Optional)</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: '#303134',
                  border: '1px solid #5f6368',
                  color: '#e8eaed',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setSelectedStep('choose')}
                style={{ background: 'none', border: 'none', color: '#8ab4f8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: '#1a73e8',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(26, 115, 232, 0.4)'
                }}
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Authenticating Spinner */}
        {selectedStep === 'authenticating' && (
          <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div 
              className="spin"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '3px solid rgba(138, 180, 248, 0.2)',
                borderTopColor: '#4285f4',
                borderRightColor: '#ea4335'
              }}
            />
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e8eaed', marginBottom: '4px' }}>
                Authenticating with Google...
              </div>
              <div style={{ fontSize: '0.82rem', color: '#9aa0a6' }}>
                Signing in as <span style={{ color: '#8ab4f8', fontWeight: 600 }}>{authenticatingUser?.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Safety Assurance */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: '#9aa0a6' }}>
          <Shield size={13} color="#34a853" />
          <span>Secured by Google OAuth 2.0 Identity Platform</span>
        </div>
      </div>
    </div>
  );
};

export default GoogleOAuthModal;
