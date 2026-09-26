import React from 'react';

export const Card = ({ children, className = '', hover = true, glass = true, style = {}, onClick = null, id = null }) => {
  const baseClass = glass ? 'urban-3d-card-shell' : 'card-panel';
  const hoverClass = hover ? 'card-panel-hover' : '';
  return (
    <div 
      id={id}
      className={`${baseClass} ${hoverClass} ${className}`} 
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
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
  <h3 className={className} style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.01em', ...style }}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', style = {} }) => (
  <p className={className} style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px', fontWeight: 500, ...style }}>
    {children}
  </p>
);

export default Card;
