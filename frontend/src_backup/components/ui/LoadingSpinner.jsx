import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading urban intelligence data...', size = 28 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        width: '100%',
        color: '#94a3b8',
        gap: '12px',
      }}
    >
      <Loader2 className="spin" size={size} color="#06b6d4" />
      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
