import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="top-nav">
      <div className="nav-brand">
        <Link to="/">
          <img src="/logo.png" alt="SudaStock" className="nav-logo" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="active">HOME</Link>
        <Link to="/about">ABOUT US</Link>
        <Link to="/products">PRODUCTS</Link>
        <Link to="/data">DATA</Link>
        <Link to="/contact">CONTACT US</Link>
      </div>
      <div className="nav-auth">
        <Link to="/login" className="login-btn">LOGIN</Link>
        <button className="lang-btn">عربي</button>
      </div>
    </nav>
  );
}

export default Navbar;
