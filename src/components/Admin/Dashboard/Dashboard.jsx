import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    recentUpdates: [],
    currencies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon products">📦</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.productCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon currencies">💱</div>
          <div className="stat-content">
            <h3>Active Currencies</h3>
            <p className="stat-value">{stats.currencies.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon updates">🔄</div>
          <div className="stat-content">
            <h3>Recent Updates</h3>
            <p className="stat-value">{stats.recentUpdates.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon performance">📈</div>
          <div className="stat-content">
            <h3>System Status</h3>
            <p className="stat-value status-active">Active</p>
          </div>
        </div>
      </div>

      {/* Recent Updates Table */}
      <div className="dashboard-section">
        <h2>Recent Updates</h2>
        <div className="table-container">
          <table className="updates-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Port Sudan</th>
                <th>DMT UAE</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUpdates.map((update) => (
                <tr key={update.id}>
                  <td>{update.name}</td>
                  <td>
                    <span className="price-value">
                      ${update.port_sudan_price.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="price-value">
                      ${update.dmt_uae_price.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${update.status.toLowerCase()}`}>
                      {update.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-value">
                      {new Date(update.last_updated).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Currency Rates */}
      <div className="dashboard-section">
        <h2>Currency Exchange Rates</h2>
        <div className="currency-grid">
          {stats.currencies.map((currency) => (
            <div key={currency.code} className="currency-card">
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
                <span className="rate-value">
                  {currency.rate_to_usd.toFixed(4)}
                </span>
              </div>
              <div className="currency-updated">
                Last updated: {new Date(currency.last_updated).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn add-product">
            <span className="action-icon">➕</span>
            Add New Product
          </button>
          <button className="action-btn update-rates">
            <span className="action-icon">💱</span>
            Update Rates
          </button>
          <button className="action-btn generate-report">
            <span className="action-icon">📊</span>
            Generate Report
          </button>
          <button className="action-btn system-backup">
            <span className="action-icon">💾</span>
            System Backup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
