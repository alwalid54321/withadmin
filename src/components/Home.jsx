import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'GADAREF SESAME', 
      values: Array(8).fill('0.00'),
      trend: { up: true, down: false },
      lastUpdate: new Date()
    },
    { 
      id: 2, 
      name: 'COMMERCIAL SESAME', 
      values: Array(8).fill('0.00'),
      trend: { up: false, down: true },
      lastUpdate: new Date()
    },
    { 
      id: 3, 
      name: 'RED SESAME', 
      values: Array(8).fill('0.00'),
      trend: { up: true, down: false },
      lastUpdate: new Date()
    },
    { 
      id: 4, 
      name: 'ACACIA SENEGAL', 
      values: Array(8).fill('0.00'),
      trend: { up: false, down: true },
      lastUpdate: new Date()
    },
    { 
      id: 5, 
      name: 'ACACIA SEYAL', 
      values: Array(8).fill('0.00'),
      trend: { up: true, down: false },
      lastUpdate: new Date()
    },
    { 
      id: 6, 
      name: 'PEANUTS', 
      values: Array(8).fill('0.00'),
      trend: { up: false, down: true },
      lastUpdate: new Date()
    },
    { 
      id: 7, 
      name: 'GANA 80/90', 
      values: Array(8).fill('0.00'),
      trend: { up: true, down: false },
      lastUpdate: new Date()
    },
    { 
      id: 8, 
      name: 'COTTON', 
      values: Array(8).fill('0.00'),
      trend: { up: false, down: true },
      lastUpdate: new Date()
    }
  ]);

  const [currencies, setCurrencies] = useState([
    { id: 1, name: 'USD/SDG', rate: '0.00', trend: { up: true, down: false } },
    { id: 2, name: 'EUR/SDG', rate: '0.00', trend: { up: false, down: true } }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const [selectedCountry, setSelectedCountry] = useState('SUDAN');

  const headers = [
    { id: 1, name: 'PRODUCTS NAME', width: '200px' },
    { id: 2, name: 'FOB PORT SUDAN', width: '120px' },
    { id: 3, name: 'CNF CHINA', width: '120px' },
    { id: 4, name: 'CNF J/ALI', width: '120px' },
    { id: 5, name: 'CNF MERSING', width: '120px' },
    { id: 6, name: 'CNF INDIA', width: '120px' },
    { id: 7, name: 'CHANGING', width: '100px' },
    { id: 8, name: 'STATUS', width: '100px' },
    { id: 9, name: 'FORCAST', width: '100px' }
  ];

  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/bg_vid.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            <span className="hero-title-line">SUDASTOCK</span>
            <span className="hero-title-line">TRANSFORMING</span>
            <span className="hero-title-line">DATA INTO</span>
            <span className="hero-title-line">OPPORTUNITIES</span>
          </h1>
          <p className="hero-text">
            Together with SudaStock we will build the bridges connecting
            agriculture to economic growth.
          </p>
          <Link to="/register" className="register-btn">
            REGISTER NOW
          </Link>
        </div>
        <div className="hero-product-info">
          <p>
            Our products are meticulously sourced from Sudan, where they
            are cultivated, harvested, processed, and shipped from Port
            Sudan to global destinations. We provide you with precise,
            transparent pricing, free from any markup, enabling you to make
            informed, independent decisions.
          </p>
          <button className="explore-btn">
            EXPLORE PRODUCTS
          </button>
        </div>
      </div>

      {/* Country Selection */}
      <div className="country-selection">
        <div className="parallel-market">
          <span className="red-dot"></span>
          PARALLEL MARKET
        </div>
        <div className="countries">
          <button className={`country-btn ${selectedCountry === 'UAE' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('UAE')}>
            <img src="/uae-flag.png" alt="UAE Flag" />
            UNITED ARAB EMIRATES
          </button>
          <button className={`country-btn ${selectedCountry === 'SUDAN' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('SUDAN')}>
            SUDAN
          </button>
          <button className={`country-btn ${selectedCountry === 'US' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('US')}>
            UNITED STATES
          </button>
          <button className={`country-btn ${selectedCountry === 'SUDAN2' ? 'active' : ''}`}
                  onClick={() => setSelectedCountry('SUDAN2')}>
            SUDAN
          </button>
        </div>
      </div>

      {/* Background Image */}
      <div className="background-image">
      </div>

      {/* Market Data Section */}
      <div className="market-data">
        <h2>Market Data</h2>
        <div className="market-table">
          <table>
            <thead>
              <tr>
                <th>PRODUCT NAME</th>
                <th>EXPORT GRADE</th>
                <th>SPOT PRICE</th>
                <th>DEMAND</th>
                <th>1ST GRADE</th>
                <th>2ND GRADE</th>
                <th>3RD GRADE</th>
                <th>STOCK</th>
                <th>SAMPLE</th>
                <th>QUOTE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="fade-in">
                  <td className="product-name">{product.name}</td>
                  {product.values.map((value, index) => (
                    <td key={index} className="value-cell">
                      {formatNumber(value)}
                    </td>
                  ))}
                  <td className="actions-cell">
                    <button className="sample-btn" title="Request Sample">
                      <i className="fas fa-vial"></i> SAMPLE
                    </button>
                    <button className="quote-btn" title="Get Quote">
                      <i className="fas fa-file-invoice-dollar"></i> QUOTE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Currency Data Section */}
      <div className="currency-data">
        <div className="section-header">
          <h2>C u r r e n c y  D a t a</h2>
          <div className="currency-info">Live Exchange Rates</div>
        </div>
        <div className="currency-table">
          <table>
            <thead>
              <tr>
                <th>CURRENCY</th>
                <th>RATE</th>
                <th>TREND</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency) => (
                <tr key={currency.id} className="fade-in">
                  <td>{currency.name}</td>
                  <td className="rate">{formatNumber(currency.rate)}</td>
                  <td className="trend-cell">
                    {currency.trend.up && <span className="trend-arrow up">↑</span>}
                    {currency.trend.down && <span className="trend-arrow down">↓</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Steps */}
      <div className="register-steps">
        <div className="steps-info">
          Sudastock provides you with timely, accurate, and precise data.
        </div>
        <div className="steps-container">
          <div className="step">
            <span className="step-text">Register with us</span>
            <div className="step-line">
              <div className="pulse"></div>
            </div>
          </div>
          <div className="step">
            <span className="step-text">Navigate through our data</span>
            <div className="step-line">
              <div className="pulse"></div>
            </div>
          </div>
          <div className="step">
            <span className="step-text">Opt for and Trade</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="progress-section">
        <div className="progress-container">
          <div className="progress-step">
            <span className="progress-label">T1</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T2</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T3</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T4</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T5</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T6</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T7</span>
            <div className="progress-value">0.00</div>
          </div>
          <div className="progress-step">
            <span className="progress-label">T8</span>
            <div className="progress-value">0.00</div>
          </div>
        </div>
      </div>

      {/* Price Ticker */}
      <div className="price-ticker">
        <div className="ticker-container">
          {products.map((product) => (
            <div key={product.id} className="ticker-item">
              <div className="ticker-product">
                <div className="product-name">{product.name}</div>
                <div className="price">{formatNumber(product.values[0])}</div>
              </div>
              <div className="trend-indicators">
                {product.trend.up && <span className="trend-arrow up pulse-green">↑</span>}
                {product.trend.down && <span className="trend-arrow down pulse-red">↓</span>}
              </div>
              <div className="update-time">{formatDate(product.lastUpdate)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Announcements */}
      <div className="market-announcements">
        <h2>M a r k e t  A n n o u n c e m e n t s</h2>
        <div className="announcements-container">
          <div className="announcement">
            <div className="announcement-date">{formatDate(new Date())}</div>
            <div className="announcement-content">
              Stay tuned for the latest market updates and announcements.
            </div>
          </div>
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="signup-section">
        <div className="signup-content">
          <div className="signup-text">
            <h2>SIGN UP TODAY WITH SUDASTOCK AND EXPERIENCE THE DIFFERENCE</h2>
            <p>
              By taking just a few simple steps, you'll gain access to a comprehensive data platform. With this information at your fingertips, making and informed a deeper understanding of the market. With timely, accurate information at your fingertips, you'll be equipped to identify and capitalize on market opportunities previously beyond reach.
            </p>
          </div>
          <div className="signup-image">
            <img src="/signup-device.png" alt="Register with SudaStock" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>COMPANY NAME</h3>
            <ul>
              <li>About Us</li>
              <li>Our Team</li>
              <li>Products</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>SERVICES</h3>
            <ul>
              <li>Market Data</li>
              <li>Live Prices</li>
              <li>Trading</li>
              <li>Reports</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>LINKS</h3>
            <ul>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Disclaimer</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>SOCIAL MEDIA</h3>
            <ul>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>Instagram</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SudaStock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
