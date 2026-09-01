import React, { useState } from 'react';
import { useUrbanPulseContext } from '../context/UrbanPulseContext';
import BrandLogo3D from '../components/ui/BrandLogo3D';
import { User, Mail, Lock, ArrowRight, ArrowLeft, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

export const SignupPage = () => {
  const { signup, loginWithGoogle, verifyEmail, authLoading, authError, setAuthError, setActiveTab } = useUrbanPulseContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setAuthError('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify your password.');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const res = await signup(fullName, email, password);
    if (res.success) {
      if (res.requiresVerification) {
        setVerificationPending(true);
      } else {
        setActiveTab('dashboard');
      }
    }
  };

  const handleVerifyEmail = async () => {
    const res = await verifyEmail(email);
    if (res.success) {
      setVerificationSuccess(true);
      setTimeout(() => {
        setActiveTab('dashboard');
      }, 1500);
    }
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle({
      email: email.includes('@') ? email : 'citizen.user@urbanpulse.ai',
      name: fullName || 'Urban Citizen'
    });
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
          width: '650px', 
          height: '650px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.16) 0%, rgba(7, 12, 24, 0) 70%)',
          pointerEvents: 'none',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }} 
      />

      <div 
        style={{ 
          width: '100%', 
          maxWidth: '460px', 
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
        {/* Header Logo & Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
          <BrandLogo3D size="lg" showSubtitle={false} showPulseLine={false} onClick={() => setActiveTab('home')} />
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '18px', marginBottom: '6px' }}>
            Create Your UrbanPulse Account
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            Join your city's smart citizen intelligence network.
          </p>
        </div>

        {/* EMAIL VERIFICATION REQUIRED PROMPT STATE */}
        {verificationPending ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '12px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <ShieldCheck size={28} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Verify Your Email Address
            </h3>

            <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              We have sent a verification link to <strong style={{ color: '#38bdf8' }}>{email}</strong>. Please check your inbox to activate your citizen account.
            </p>

            {verificationSuccess ? (
              <div style={{ background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34d399', borderRadius: '8px', padding: '10px 16px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <CheckCircle size={18} />
                <span>Email Verified! Redirecting to Citizen Dashboard...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleVerifyEmail}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.90rem',
                  cursor: 'pointer'
                }}
              >
                Confirm Verification & Proceed to Dashboard
              </button>
            )}
          </div>
        ) : (
          <>
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
                  marginBottom: '18px'
                }}
              >
                <AlertCircle size={18} color="#fb7185" style={{ flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} color="#38bdf8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setAuthError(null); }}
                    placeholder="Alex Morgan"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
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
                      padding: '11px 14px 11px 42px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} color="#38bdf8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthError(null); }}
                    placeholder="At least 6 characters"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} color="#38bdf8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setAuthError(null); }}
                    placeholder="Re-enter password"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Signup Submit Button */}
              <button
                type="submit"
                disabled={authLoading}
                style={{
                  marginTop: '6px',
                  padding: '13px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: authLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(2, 132, 199, 0.4)'
                }}
              >
                <span>{authLoading ? 'Creating Account...' : 'Create Account'}</span>
                {!authLoading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#f8fafc',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Footer Link to Login */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: '#94a3b8' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: 800, cursor: 'pointer', padding: 0, marginLeft: '4px' }}
              >
                Login
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SignupPage;
