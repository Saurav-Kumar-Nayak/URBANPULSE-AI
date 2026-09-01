import React, { useState } from 'react';

export const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          style={{
            position: 'absolute',
            bottom: '125%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 10px',
            backgroundColor: '#0D131C',
            border: '1px solid #202B38',
            borderRadius: '6px',
            color: '#f8fafc',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            zIndex: 100,
            boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
