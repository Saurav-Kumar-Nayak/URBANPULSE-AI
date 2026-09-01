import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  style = {},
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'subtle':
        return 'btn-subtle';
      case 'danger':
        return 'btn-danger';
      case 'primary':
      default:
        return 'btn-primary';
    }
  };

  return (
    <button
      className={`${getVariantClass()} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...props}
    >
      {loading ? (
        <Loader2 className="spin" size={16} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
