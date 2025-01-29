import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Market Data</h1>
        <p>Your trusted source for agricultural market information</p>
        <Link to="/market-data" className="cta-button">View Market Data</Link>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Real-time Updates</h3>
          <p>Get the latest market prices and trends as they happen</p>
        </div>
        <div className="feature-card">
          <h3>Multiple Products</h3>
          <p>Track various agricultural products and commodities</p>
        </div>
        <div className="feature-card">
          <h3>Currency Exchange</h3>
          <p>Monitor exchange rates and market indicators</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
