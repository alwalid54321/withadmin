import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/about" className="nav-link">ABOUT</Link>
          <Link to="/products" className="nav-link">PRODUCTS</Link>
          <Link to="/contact" className="nav-link">CONTACT</Link>
          <Link to="/login" className="nav-link login-btn">LOGIN</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
