import React from 'react';
import './Skeleton.css';

const Skeleton: React.FC = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-subtitle"></div>
        <div className="skeleton-line skeleton-price"></div>
      </div>
    </div>
  );
};

export default Skeleton;

