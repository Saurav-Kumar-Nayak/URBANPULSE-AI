import React, { useState } from 'react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import BrandLogo3D from '../components/ui/BrandLogo3D';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { forgotPassword, setActiveTab } = useUrbanPulseContext();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    const res = await forgotPassword(email);
    setSubmitted(true);
    setMessage(res.message || 'If an account exists for this email, a reset link has been sent.');
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        width: '100%', 
        background: '#070c18', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{ 
          position: 'absolute', 
          width: '550px', 
          height: '550px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, rgba(7, 12, 24, 0) 70%)',
          pointerEvents: 'none'
        }} 
      />

      <div 
        style={{ 
          width: '100%', 
          maxWidth: '430px', 
          background: 'linear-gradient(145deg, rgba(13, 22, 40, 0.92), rgba(7, 12, 24, 0.96))', 
          border: '1px solid rgba(56, 189, 248, 0.3)', 
          borderRadius: '20px', 
          padding: '36px 32px', 
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
          <BrandLogo3D size="lg" showSubtitle={false} showPulseLine={false} onClick={() => setActiveTab('home')} />
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '18px', marginBottom: '6px' }}>
            Forgot Password?
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '10px 0' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
              <CheckCircle2 size={26} />
            </div>

            <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
              {message}
            </p>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} color="#38bdf8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#ffffff',
                    fontSize: '0.90rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '6px',
                padding: '13px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Send Password Reset Link</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
