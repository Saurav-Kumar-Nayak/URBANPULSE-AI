import React from 'react';

export const Card = ({ children, className = '', hover = false, glass = false, style = {} }) => {
  const baseClass = glass ? 'card-panel-glass' : 'card-panel';
  const hoverClass = hover ? 'card-panel-hover' : '';
  return (
    <div className={`${baseClass} ${hoverClass} ${className}`} style={style}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', style = {} }) => (
  <div 
    className={`card-header ${className}`} 
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', ...style }}
  >
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', style = {} }) => (
  <h3 className={className} style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', ...style }}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', style = {} }) => (
  <p className={className} style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px', ...style }}>
    {children}
  </p>
);

export default Card;
