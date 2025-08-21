import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
  const spinnerSize = {
    small: { width: '20px', height: '20px' },
    medium: { width: '32px', height: '32px' },
    large: { width: '48px', height: '48px' }
  };

  const dotSize = {
    small: '4px',
    medium: '6px',
    large: '8px'
  };

  return (
    <div className="notion-spinner-container">
      <div className="notion-spinner" aria-label="Chargement...">
        <div 
          className="notion-spinner-dot" 
          style={{ 
            width: dotSize[size], 
            height: dotSize[size] 
          }}
        />
        <div 
          className="notion-spinner-dot" 
          style={{ 
            width: dotSize[size], 
            height: dotSize[size],
            animationDelay: '0.2s'
          }}
        />
        <div 
          className="notion-spinner-dot" 
          style={{ 
            width: dotSize[size], 
            height: dotSize[size],
            animationDelay: '0.4s'
          }}
        />
      </div>
      {text && <p className="notion-spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
