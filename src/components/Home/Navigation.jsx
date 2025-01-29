import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-container">
        <Link to="/uae" className="nav-link">
          <span className="nav-text">UNITED ARAB EMIRATES</span>
          <div className="nav-indicator"></div>
        </Link>
        
        <div className="nav-divider"></div>
        
        <Link to="/us" className="nav-link">
          <span className="nav-text">UNITED STATES</span>
          <div className="nav-indicator"></div>
        </Link>
        
        <div className="nav-divider"></div>
        
        <Link to="/sudan" className="nav-link">
          <span className="nav-text">SUDAN</span>
          <div className="nav-indicator"></div>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
