import React from 'react';

export const PageContainer = ({ title, subtitle, badge, action, children }) => {
  return (
    <div className="page-container">
      {(title || subtitle || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>{title}</h1>
              {badge}
            </div>
            {subtitle && (
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
