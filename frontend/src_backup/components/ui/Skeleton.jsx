import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

export const CardSkeleton = () => (
  <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <Skeleton width="40%" height="16px" />
    <Skeleton width="70%" height="32px" />
    <Skeleton width="90%" height="14px" />
  </div>
);

export default Skeleton;
