import React, { useState } from 'react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import BrandLogo3D from '../components/ui/BrandLogo3D';
import GoogleOAuthModal from '../components/ui/GoogleOAuthModal';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, authLoading, authError, setAuthError, setActiveTab } = useUrbanPulseContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both your email address and password.');
      return;
    }
    await login(email, password);
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
      {/* Top Left Navigation Link */}
      <button
        onClick={() => setActiveTab('home')}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '8px',
          padding: '8px 16px',
          color: '#38bdf8',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Background Radial Glow */}
      <div 
        style={{ 
          position: 'absolute', 
          width: '600px', 
          height: '600px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, rgba(7, 12, 24, 0) 70%)',
          pointerEvents: 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} 
      />

      <div 
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          background: 'linear-gradient(145deg, rgba(13, 22, 40, 0.92), rgba(7, 12, 24, 0.96))', 
          border: '1px solid rgba(56, 189, 248, 0.3)', 
          borderRadius: '20px', 
          padding: '36px 32px', 
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header Logo & Welcome Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '28px' }}>
          <BrandLogo3D size="lg" showSubtitle={false} showPulseLine={false} onClick={() => setActiveTab('home')} />
          
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '20px', marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            Sign in to explore your city.
          </p>
        </div>

        {/* Error Feedback Alert */}
        {authError && (
          <div 
            style={{ 
              background: 'rgba(244, 63, 94, 0.12)', 
              border: '1px solid rgba(244, 63, 94, 0.35)', 
              borderRadius: '10px', 
              padding: '12px 14px', 
              color: '#fb7185', 
              fontSize: '0.80rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} color="#fb7185" style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Email Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, letterSpacing: '0.02em' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="#38bdf8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setAuthError(null); }}
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
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, letterSpacing: '0.02em' }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setActiveTab('forgot-password')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#38bdf8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(null); }}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#ffffff',
                  fontSize: '0.90rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Pre-configured Demo Access Buttons */}
          <div style={{ background: 'rgba(11, 17, 30, 0.8)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.70rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>Quick Authorized Sign In:</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => { setEmail('operator@urbanpulse.ai'); setPassword('urbanpulse2026'); setAuthError(null); }}
                style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Operator Credentials
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@urbanpulse.ai'); setPassword('admin2026'); setAuthError(null); }}
                style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Admin Credentials
              </button>
            </div>
          </div>

          {/* Login Action Button */}
          <button
            type="submit"
            disabled={authLoading}
            style={{
              marginTop: '6px',
              padding: '14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: authLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{authLoading ? 'Signing in...' : 'LOGIN'}</span>
            {!authLoading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Authentic Google OAuth Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={authLoading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            color: '#f8fafc',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease'
          }}
          id="google-signin-btn"
        >
          {/* Google Icon SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link to Signup */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.82rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 800, cursor: 'pointer', padding: 0, marginLeft: '4px' }}
          >
            Create Account
          </button>
        </div>

      </div>

      {/* Realistic Google OAuth Modal */}
      <GoogleOAuthModal 
        isOpen={isGoogleModalOpen} 
        onClose={() => setIsGoogleModalOpen(false)} 
      />
    </div>
  );
};

export default LoginPage;
