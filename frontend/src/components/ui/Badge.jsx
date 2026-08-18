import React from 'react';

export const Badge = ({ children, variant = 'healthy', className = '', style = {} }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'warning':
        return 'badge-warning';
      case 'critical':
      case 'danger':
        return 'badge-critical';
      case 'cyan':
        return 'badge-cyan';
      case 'violet':
        return 'badge-violet';
      case 'subtle':
        return 'badge-subtle';
      case 'healthy':
      case 'success':
      default:
        return 'badge-healthy';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${className}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
