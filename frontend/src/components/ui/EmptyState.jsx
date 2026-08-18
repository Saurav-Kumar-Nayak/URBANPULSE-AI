import React from 'react';
import { Database, RefreshCw } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  title = 'No Data Available',
  message = 'Unable to locate telemetry records matching your current filter criteria.',
  onRetry,
  icon: Icon = Database,
}) => {
  return (
    <div
      className="card-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#06b6d4',
          marginBottom: '4px',
        }}
      >
        <Icon size={26} />
      </div>
      <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>{title}</h4>
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '380px' }}>{message}</p>
      {onRetry && (
        <Button variant="subtle" icon={RefreshCw} onClick={onRetry} style={{ marginTop: '8px' }}>
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
