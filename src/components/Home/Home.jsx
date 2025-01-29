import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, currenciesRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/currencies')
        ]);
        setProducts(productsRes.data);
        setCurrencies(currenciesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertPrice = (price, currency) => {
    const selectedRate = currencies.find(c => c.code === currency)?.rate_to_usd || 1;
    const usdRate = currencies.find(c => c.code === 'USD')?.rate_to_usd || 1;
    return (price * selectedRate / usdRate).toFixed(2);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero-section">
        <h1>SudaStock Market Data</h1>
        <p>Real-time agricultural market prices and currency exchange rates</p>
      </div>

      <div className="currency-section">
        <h2>Currency Exchange Rates</h2>
        <div className="currency-grid">
          {currencies.map((currency) => (
            <div 
              key={currency.code}
              className={`currency-card ${currency.code === selectedCurrency ? 'selected' : ''}`}
              onClick={() => setSelectedCurrency(currency.code)}
            >
              <div className="currency-header">
                <img 
                  src={currency.flag_url} 
                  alt={`${currency.code} flag`}
                  className="currency-flag"
                />
                <span className="currency-code">{currency.code}</span>
              </div>
              <div className="currency-rate">
                <span className="rate-label">Rate to USD</span>
                <span className="rate-value">{currency.rate_to_usd.toFixed(4)}</span>
              </div>
              <div className="currency-updated">
                Last updated: {new Date(currency.last_updated).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2>Product Prices</h2>
          <div className="currency-selector">
            <label>Show prices in:</label>
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              
              <div className="price-grid">
                <div className="price-item">
                  <span className="location">Port Sudan</span>
                  <span className="price">
                    {selectedCurrency} {convertPrice(product.port_sudan_price, selectedCurrency)}
                  </span>
                </div>
                
                <div className="price-item">
                  <span className="location">DMT UAE</span>
                  <span className="price">
                    {selectedCurrency} {convertPrice(product.dmt_uae_price, selectedCurrency)}
                  </span>
                </div>

                <div className="price-item">
                  <span className="location">DMT China</span>
                  <span className="price">
                    {selectedCurrency} {convertPrice(product.dmt_china_price, selectedCurrency)}
                  </span>
                </div>

                <div className="price-item">
                  <span className="location">DMT Mersing</span>
                  <span className="price">
                    {selectedCurrency} {convertPrice(product.dmt_mersing_price, selectedCurrency)}
                  </span>
                </div>

                <div className="price-item">
                  <span className="location">DMT India</span>
                  <span className="price">
                    {selectedCurrency} {convertPrice(product.dmt_india_price, selectedCurrency)}
                  </span>
                </div>
              </div>

              <div className="product-footer">
                <div className="demand-level">
                  <span>Demand Level</span>
                  <div className="demand-bar">
                    <div 
                      className="demand-fill"
                      style={{ width: `${product.demand_level}%` }}
                    ></div>
                    <span className="demand-value">{product.demand_level}%</span>
                  </div>
                </div>

                <div className="status-trend">
                  <span className={`status ${product.status.toLowerCase()}`}>
                    {product.status}
                  </span>
                  <span className={`trend ${product.forecast_trend}`}>
                    {product.forecast_trend === 'up' ? '↑' : 
                     product.forecast_trend === 'down' ? '↓' : '→'}
                  </span>
                </div>

                <div className="last-updated">
                  Updated: {new Date(product.last_updated).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
