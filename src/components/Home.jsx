import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [selectedCountry, setSelectedCountry] = useState('SUDAN');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({
    USD: 1,
    AED: 3.6725,
    SDG: 601.0000
  });
  const [currencies, setCurrencies] = useState([
    {
      id: 1,
      name: 'USD',
      flag: '/us.png',
      rate: '1.00',
      trend: { up: true, down: false }
    },
    {
      id: 2,
      name: 'AED',
      flag: '/uae.png',
      rate: '3.67',
      trend: { up: false, down: true }
    },
    {
      id: 3,
      name: 'SDG',
      flag: '/sd.png',
      rate: '601.00',
      trend: { up: true, down: false }
    }
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'GADAREF SESAME',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '1440',
      dmtMersing: '1650',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      id: 2,
      name: 'COMMERCIAL SESAME',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'down',
      lastUpdate: new Date()
    },
    {
      id: 3,
      name: 'RED SESAME',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      id: 4,
      name: 'ACACIA SENEGAL',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'down',
      lastUpdate: new Date()
    },
    {
      id: 5,
      name: 'ACACIA SEYAL',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      id: 6,
      name: 'PEANUTS',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'down',
      lastUpdate: new Date()
    },
    {
      id: 7,
      name: 'COTTON',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      id: 8,
      name: 'WATERMELON SEEDS',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'down',
      lastUpdate: new Date()
    },
    {
      id: 9,
      name: 'CHICKPEAS',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'up',
      lastUpdate: new Date()
    },
    {
      id: 10,
      name: 'PIGEON PEAS',
      value: '0.00',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00',
      trend: 'down',
      lastUpdate: new Date()
    }
  ]);

  const [marketData, setMarketData] = useState([
    {
      product: 'GADAREF SESAME',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '1440',
      dmtMersing: '1650',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'COMMERCIAL SESAME',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'RED SESAME',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'ACACIA SENEGAL',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'ACACIA SEYAL',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'PEANUTS',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'COTTON',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'WATERMELON SEEDS',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'CHICKPEAS',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    },
    {
      product: 'PIGEON PEAS',
      portSudan: '0.00',
      dmtChina: '0.00',
      dmtUAE: '0.00',
      dmtMersing: '0.00',
      dmtIndia: '0.00',
      demand: '0.00',
      status: '0.00',
      forecast: '0.00'
    }
  ]);

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

  // Function to convert price to selected currency
  const convertPrice = (priceUSD) => {
    const rate = exchangeRates[selectedCurrency];
    return (priceUSD * rate).toFixed(2);
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  // Fetch prices from backend
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('/api/prices');
        const prices = response.data;
        setProducts(prevProducts => 
          prevProducts.map(product => {
            const price = prices.find(p => p.name === product.name);
            if (price) {
              return {
                ...product,
                value: price.value.toFixed(2),
                trend: price.trend,
                lastUpdate: new Date(price.lastUpdate)
              };
            }
            return product;
          })
        );
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('/api/prices');
        const prices = response.data;
        
        setProducts(prevProducts => 
          prevProducts.map(product => {
            const price = prices.find(p => p.name === product.name);
            if (price) {
              return {
                ...product,
                value: price.value.toFixed(2),
                portSudan: price.portSudan,
                dmtChina: price.dmtChina,
                dmtUAE: price.dmtUAE,
                dmtMersing: price.dmtMersing,
                dmtIndia: price.dmtIndia,
                demand: price.demand,
                status: price.status,
                forecast: price.forecast,
                trend: price.trend,
                lastUpdate: new Date(price.lastUpdate)
              };
            }
            return product;
          })
        );
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="brand-name">SUDASTOCK</div>
          <h1>
            <div className="hero-title-line">TRANSFORMING</div>
            <div className="hero-title-line">DATA INTO</div>
            <div className="hero-title-line">OPPORTUNITIES</div>
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

        <div className="hero-overlay"></div>
        <video className="hero-video" autoPlay loop muted playsInline>
          <source src="/videos/bg_vid.mp4" type="video/mp4" />
        </video>
      </section>

      {/* Country Selector */}
      <div className="country-selector">
        <div 
          className={`country-option ${selectedCountry === 'SUDAN' ? 'selected' : ''}`}
          onClick={() => setSelectedCountry('SUDAN')}
        >
          <img src="/sd.png" alt="Sudan Flag" className="country-flag" />
          <span className="country-name">SUDAN</span>
        </div>
        <div 
          className={`country-option ${selectedCountry === 'UAE' ? 'selected' : ''}`}
          onClick={() => setSelectedCountry('UAE')}
        >
          <img src="/uae.png" alt="UAE Flag" className="country-flag" />
          <span className="country-name">UAE</span>
        </div>
        <div 
          className={`country-option ${selectedCountry === 'USA' ? 'selected' : ''}`}
          onClick={() => setSelectedCountry('USA')}
        >
          <img src="/us.png" alt="USA Flag" className="country-flag" />
          <span className="country-name">USA</span>
        </div>
      </div>

      {/* Market Data Section */}
      <div className="market-data-section">
        <div className="section-header">
          <h2>Market Data</h2>
          <div className="currency-selector">
            {Object.entries(exchangeRates).map(([code]) => (
              <div 
                key={code}
                className={`currency-option ${selectedCurrency === code ? 'selected' : ''}`}
                onClick={() => setSelectedCurrency(code)}
              >
                <img 
                  src={`/${code.toLowerCase()}.png`} 
                  alt={`${code} Flag`} 
                  className="currency-flag" 
                />
                <span>{code}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="market-table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>PRODUCT NAME</th>
                <th>PORT SUDAN</th>
                <th>DMT CHINA</th>
                <th>DMT UAE</th>
                <th>DMT MERSING</th>
                <th>DMT INDIA</th>
                <th>DEMAND</th>
                <th>STATUS</th>
                <th>FORECAST</th>
                <th className="action-column">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-name-cell">
                      <span className="product-name">{product.name}</span>
                      <span className="base-currency">USD</span>
                    </div>
                  </td>
                  <td className="price-cell">{formatCurrency(convertPrice(product.portSudan))}</td>
                  <td className="price-cell">{formatCurrency(convertPrice(product.dmtChina))}</td>
                  <td className="price-cell">{formatCurrency(convertPrice(product.dmtUAE))}</td>
                  <td className="price-cell">{formatCurrency(convertPrice(product.dmtMersing))}</td>
                  <td className="price-cell">{formatCurrency(convertPrice(product.dmtIndia))}</td>
                  <td>
                    <div className="demand-indicator" style={{ '--demand': `${product.demand}%` }}>
                      <div className="demand-bar"></div>
                      <span>{product.demand}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${product.status.toLowerCase()}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="forecast-cell">
                      <span className={`forecast-trend ${product.trend}`}>
                        {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}
                      </span>
                    </div>
                  </td>
                  <td className="action-column">
                    <button className="action-btn sample-btn">SAMPLE</button>
                    <button className="action-btn quote-btn">QUOTE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Image Section */}
      <div className="market-image-section">
        <img src="/pn2.png" alt="Market Overview" className="market-overview-image" />
      </div>

      {/* Currency Data Section */}
      <div className="currency-data-section">
        <h2>Currency Data</h2>
        <div className="currency-table-container">
          <table className="currency-table">
            <thead>
              <tr>
                <th>CURRENCY</th>
                <th>RATE</th>
                <th>TREND</th>
                <th>LAST UPDATE</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((currency) => (
                <tr key={currency.id}>
                  <td>
                    <div className="currency-name-cell">
                      <img 
                        src={currency.flag} 
                        alt={`${currency.name} flag`} 
                        className="currency-flag"
                      />
                      <span>{currency.name}</span>
                    </div>
                  </td>
                  <td>{currency.rate}</td>
                  <td>
                    <div className="trend-indicators">
                      {currency.trend.up && (
                        <span className="trend-arrow up pulse-green">↑</span>
                      )}
                      {currency.trend.down && (
                        <span className="trend-arrow down pulse-red">↓</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(new Date())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Ticker */}
      <div className="price-ticker-wrapper">
        <div className="price-ticker">
          <div className="ticker-track">
            {[...products, ...products].map((product, index) => (
              <div key={index} className="ticker-item">
                <span className="product-name">{product.name}</span>
                <span className="price">${product.value}</span>
                {product.trend === 'up' && (
                  <span className="trend-arrow up">↑</span>
                )}
                {product.trend === 'down' && (
                  <span className="trend-arrow down">↓</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register Steps */}
      <div className="register-steps">
        <div className="steps-info">
          <h2>How It Works</h2>
          <p>Sudastock provides you with timely, accurate, and precise data.</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Register with us</h3>
            <p>Create your account to access market data</p>
            <div className="step-line">
              <div className="pulse"></div>
            </div>
          </div>
          <div className="step">
            <div className="step-number">02</div>
            <h3>Navigate through our data</h3>
            <p>Access real-time market insights</p>
            <div className="step-line">
              <div className="pulse"></div>
            </div>
          </div>
          <div className="step">
            <div className="step-number">03</div>
            <h3>Opt for and Trade</h3>
            <p>Make informed decisions and trade efficiently</p>
          </div>
        </div>
      </div>

      {/* Sign Up Section */}
      <div className="signup-section">
        <div className="signup-content">
          <div className="signup-text">
            <h2>SIGN UP TODAY WITH SUDASTOCK</h2>
            <h3>AND EXPERIENCE THE DIFFERENCE</h3>
            <p>
              By taking just a few simple steps, you'll gain access to a comprehensive 
              data platform. With this information at your fingertips, you'll develop 
              a deeper understanding of the market. Our timely, accurate information 
              will equip you to identify and capitalize on market opportunities 
              previously beyond reach.
            </p>
            <Link to="/register" className="signup-btn">Get Started</Link>
          </div>
          <div className="signup-image">
            <img src="public\png3.png" alt="Register with SudaStock" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>COMPANY</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/team">Our Team</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>SERVICES</h3>
            <ul>
              <li><Link to="/market-data">Market Data</Link></li>
              <li><Link to="/live-prices">Live Prices</Link></li>
              <li><Link to="/trading">Trading</Link></li>
              <li><Link to="/reports">Reports</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>LEGAL</h3>
            <ul>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>CONNECT</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
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
