import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    image: '',
    description: '',
    specifications: '',
    fob_sdpzu: 0,
    cnf_aejea: 0,
    cnf_inach1: 0,
    cnf_cnahk: 0,
    cnf_trmer: 0,
    last_update: '',
    forecast: 'up',
  });

  const [newCurrency, setNewCurrency] = useState({
    name: '',
    unit: '',
    flag: '',
    central_bank: 0,
    parallel_market: 0,
    indicator: 'up',
  });

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('adminToken');
        navigate('/login');
        return;
      }

      setIsAuthenticated(true);
      fetchData();
    } catch (error) {
      console.error('Token validation error:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch data with authentication
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [productsRes, currenciesRes] = await Promise.all([
        fetch('/api/products', { headers }),
        fetch('/api/currencies', { headers })
      ]);

      if (!productsRes.ok || !currenciesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [productsData, currenciesData] = await Promise.all([
        productsRes.json(),
        currenciesRes.json()
      ]);

      setProducts(productsData);
      setCurrencies(currenciesData);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Input validation
  const validateProduct = (product) => {
    if (!product.name || product.name.length < 2) return false;
    if (!product.description) return false;
    if (isNaN(product.fob_sdpzu) || product.fob_sdpzu < 0) return false;
    return true;
  };

  const validateCurrency = (currency) => {
    if (!currency.name || currency.name.length < 2) return false;
    if (!currency.unit) return false;
    if (isNaN(currency.central_bank) || currency.central_bank < 0) return false;
    return true;
  };

  // Secure API calls with error handling
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProduct(newProduct)) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({
        name: '',
        image: '',
        description: '',
        specifications: '',
        fob_sdpzu: 0,
        cnf_aejea: 0,
        cnf_inach1: 0,
        cnf_cnahk: 0,
        cnf_trmer: 0,
        last_update: '',
        forecast: 'up',
      });
      toast.success('Product added successfully');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencySubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrency(newCurrency)) {
      toast.error('Please fill all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/currencies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCurrency),
      });

      if (!response.ok) {
        throw new Error('Failed to add currency');
      }

      const data = await response.json();
      setCurrencies([...currencies, data]);
      setNewCurrency({
        name: '',
        unit: '',
        flag: '',
        central_bank: 0,
        parallel_market: 0,
        indicator: 'up',
      });
      toast.success('Currency added successfully');
    } catch (error) {
      setError(error.message);
      toast.error('Failed to add currency');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/${type}s/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      if (type === 'product') {
        setProducts(products.filter(item => item.id !== id));
      } else {
        setCurrencies(currencies.filter(item => item.id !== id));
      }
      
      toast.success(`${type} deleted successfully`);
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to delete ${type}`);
    }
  };

  // New function to handle file import
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.json') && !file.name.endsWith('.csv')) {
      toast.error('Please upload a JSON or CSV file');
      return;
    }

    setImportFile(file);
  };

  // New function to process imported data
  const processImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import data');
      }

      const result = await response.json();
      toast.success(`Successfully imported ${result.imported} items`);
      
      // Refresh the data
      fetchData();
      setImportFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast.error('Failed to import data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to export data
  const handleExport = async (type) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${type} data exported successfully`);
    } catch (error) {
      toast.error('Failed to export data: ' + error.message);
    }
  };

  // Add filter and search functions
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && product.forecast === filter;
  });

  const filteredCurrencies = currencies.filter(currency => {
    const matchesSearch = currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         currency.unit.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && currency.indicator === filter;
  });

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="admin-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="up">Trending Up</option>
            <option value="down">Trending Down</option>
            <option value="stable">Stable</option>
          </select>
        </div>
        
        <button
          onClick={() => {
            setSearchTerm('');
            setFilter('all');
          }}
          className="clear-filters"
        >
          Clear Filters
        </button>
      </div>

      <section className="import-export-section">
        <h2>Data Import/Export</h2>
        <div className="import-controls">
          <input
            type="file"
            id="fileInput"
            accept=".json,.csv"
            onChange={handleFileImport}
            className="file-input"
          />
          <button 
            onClick={processImport}
            disabled={!importFile || loading}
            className="import-btn"
          >
            {loading ? 'Importing...' : 'Import Data'}
          </button>
        </div>
        
        <div className="export-controls">
          <button
            onClick={() => handleExport('products')}
            disabled={loading}
            className="export-btn"
          >
            Export Products
          </button>
          <button
            onClick={() => handleExport('currencies')}
            disabled={loading}
            className="export-btn"
          >
            Export Currencies
          </button>
        </div>
      </section>

      <section className="products-section">
        <h2>Products Management</h2>
        <form onSubmit={handleProductSubmit} className="add-form">
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="Product Name"
            required
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="fob_sdpzu"
            value={newProduct.fob_sdpzu}
            onChange={(e) => setNewProduct({ ...newProduct, fob_sdpzu: parseFloat(e.target.value) })}
            placeholder="FOB SDPZU Price"
            required
          />
          <button type="submit" disabled={loading}>
            Add Product
          </button>
        </form>

        <div className="items-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="item-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <button
                onClick={() => handleDelete('product', product.id)}
                className="delete-btn"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="currencies-section">
        <h2>Currencies Management</h2>
        <form onSubmit={handleCurrencySubmit} className="add-form">
          <input
            type="text"
            name="name"
            value={newCurrency.name}
            onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
            placeholder="Currency Name"
            required
          />
          <input
            type="text"
            name="unit"
            value={newCurrency.unit}
            onChange={(e) => setNewCurrency({ ...newCurrency, unit: e.target.value })}
            placeholder="Currency Unit"
            required
          />
          <input
            type="number"
            name="central_bank"
            value={newCurrency.central_bank}
            onChange={(e) => setNewCurrency({ ...newCurrency, central_bank: parseFloat(e.target.value) })}
            placeholder="Central Bank Rate"
            required
          />
          <button type="submit" disabled={loading}>
            Add Currency
          </button>
        </form>

        <div className="items-list">
          {filteredCurrencies.map((currency) => (
            <div key={currency.id} className="item-card">
              <h3>{currency.name}</h3>
              <p>{currency.unit}</p>
              <button
                onClick={() => handleDelete('currency', currency.id)}
                className="delete-btn"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;
