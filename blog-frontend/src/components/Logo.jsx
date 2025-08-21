import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Sparkles } from 'lucide-react';

const Logo = () => {
  return (
    <Link to="/" className="logo">
      <div className="logo-icon">
        <div className="logo-background">
          <div className="logo-gradient"></div>
          <div className="logo-shine"></div>
        </div>
        <div className="logo-symbol">
          <Feather size={28} />
          <div className="logo-sparkle">
            <Sparkles size={12} />
          </div>
        </div>
      </div>
      <div className="logo-text">
        <span className="logo-brand">Ark</span>
        <span className="logo-suffix">Blog</span>
      </div>
    </Link>
  );
};

export default Logo;
