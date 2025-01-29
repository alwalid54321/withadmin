import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function PriceUpdate() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/prices');
      setPrices(response.data);
    } catch (error) {
      setError('Error fetching prices');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (id, value) => {
    try {
      setLoading(true);
      await axios.put(`/api/prices/${id}`, { value: parseFloat(value) });
      await fetchPrices(); // Refresh prices after update
    } catch (error) {
      setError('Error updating price');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="price-update">
      <h2>Update Market Prices</h2>
      <div className="price-grid">
        {prices.map((price) => (
          <div key={price._id} className="price-item">
            <div className="price-header">
              <h3>{price.name}</h3>
              <span className={`trend ${price.trend}`}>
                {price.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
            <div className="price-content">
              <input
                type="number"
                step="0.01"
                value={price.value}
                onChange={(e) => handlePriceUpdate(price._id, e.target.value)}
              />
              <div className="last-update">
                Last updated: {new Date(price.lastUpdate).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PriceUpdate;
