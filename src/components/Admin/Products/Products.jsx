import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    base_currency: 'USD',
    port_sudan_price: '',
    dmt_china_price: '',
    dmt_uae_price: '',
    dmt_mersing_price: '',
    dmt_india_price: '',
    demand_level: '',
    status: 'Medium',
    forecast_trend: 'stable'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, formData);
      } else {
        await axios.post('/api/admin/products', formData);
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      base_currency: product.base_currency,
      port_sudan_price: product.port_sudan_price,
      dmt_china_price: product.dmt_china_price,
      dmt_uae_price: product.dmt_uae_price,
      dmt_mersing_price: product.dmt_mersing_price,
      dmt_india_price: product.dmt_india_price,
      demand_level: product.demand_level,
      status: product.status,
      forecast_trend: product.forecast_trend
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      base_currency: 'USD',
      port_sudan_price: '',
      dmt_china_price: '',
      dmt_uae_price: '',
      dmt_mersing_price: '',
      dmt_india_price: '',
      demand_level: '',
      status: 'Medium',
      forecast_trend: 'stable'
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="products-loading">Loading products...</div>;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>{editingProduct ? 'Edit Product' : 'Products Management'}</h2>
        <button 
          className="add-product-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '← Back to List' : '+ Add Product'}
        </button>
      </div>

      {showForm ? (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="base_currency">Base Currency</label>
              <select
                id="base_currency"
                name="base_currency"
                value={formData.base_currency}
                onChange={handleInputChange}
              >
                <option value="USD">USD</option>
                <option value="AED">AED</option>
                <option value="SDG">SDG</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="port_sudan_price">Port Sudan Price</label>
              <input
                type="number"
                id="port_sudan_price"
                name="port_sudan_price"
                value={formData.port_sudan_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dmt_china_price">DMT China Price</label>
              <input
                type="number"
                id="dmt_china_price"
                name="dmt_china_price"
                value={formData.dmt_china_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dmt_uae_price">DMT UAE Price</label>
              <input
                type="number"
                id="dmt_uae_price"
                name="dmt_uae_price"
                value={formData.dmt_uae_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dmt_mersing_price">DMT Mersing Price</label>
              <input
                type="number"
                id="dmt_mersing_price"
                name="dmt_mersing_price"
                value={formData.dmt_mersing_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dmt_india_price">DMT India Price</label>
              <input
                type="number"
                id="dmt_india_price"
                name="dmt_india_price"
                value={formData.dmt_india_price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="demand_level">Demand Level (%)</label>
              <input
                type="number"
                id="demand_level"
                name="demand_level"
                min="0"
                max="100"
                value={formData.demand_level}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="forecast_trend">Forecast Trend</label>
              <select
                id="forecast_trend"
                name="forecast_trend"
                value={formData.forecast_trend}
                onChange={handleInputChange}
              >
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="stable">Stable</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Port Sudan</th>
                <th>DMT UAE</th>
                <th>Demand</th>
                <th>Status</th>
                <th>Trend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className="price-cell">
                    ${product.port_sudan_price.toFixed(2)}
                  </td>
                  <td className="price-cell">
                    ${product.dmt_uae_price.toFixed(2)}
                  </td>
                  <td>
                    <div className="demand-indicator" style={{ '--demand': `${product.demand_level}%` }}>
                      <div className="demand-bar"></div>
                      <span>{product.demand_level}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${product.status.toLowerCase()}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <span className={`trend-indicator ${product.forecast_trend}`}>
                      {product.forecast_trend === 'up' ? '↑' : 
                       product.forecast_trend === 'down' ? '↓' : '→'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;
