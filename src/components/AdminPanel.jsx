import React, { useState, useEffect } from 'react';

    function AdminPanel() {
      const [products, setProducts] = useState([]);
      const [currencies, setCurrencies] = useState([]);
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
      const [editingProduct, setEditingProduct] = useState(null);
      const [editingCurrency, setEditingCurrency] = useState(null);

      useEffect(() => {
        fetch('/api/products')
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => setProducts(data))
          .catch(error => {
            console.error('Error fetching products:', error);
          });

        fetch('/api/currencies')
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => setCurrencies(data))
          .catch(error => {
            console.error('Error fetching currencies:', error);
          });
      }, []);

      const handleProductChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
      };

      const handleCurrencyChange = (e) => {
        setNewCurrency({ ...newCurrency, [e.target.name]: e.target.value });
      };

      const addProduct = () => {
        fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
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
          })
          .catch(error => {
            console.error('Error adding product:', error);
          });
      };

      const addCurrency = () => {
        fetch('/api/currencies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCurrency),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setCurrencies([...currencies, data]);
            setNewCurrency({
              name: '',
              unit: '',
              flag: '',
              central_bank: 0,
              parallel_market: 0,
              indicator: 'up',
            });
          })
          .catch(error => {
            console.error('Error adding currency:', error);
          });
      };

      const startEditingProduct = (product) => {
        setEditingProduct(product);
      };

      const cancelEditingProduct = () => {
        setEditingProduct(null);
      };

      const updateProduct = () => {
        fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProduct),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(() => {
            setProducts(products.map(product => (product.id === editingProduct.id ? editingProduct : product)));
            setEditingProduct(null);
          })
          .catch(error => {
            console.error('Error updating product:', error);
          });
      };

      const deleteProduct = (id) => {
        fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            setProducts(products.filter(product => product.id !== id));
          })
          .catch(error => {
            console.error('Error deleting product:', error);
          });
      };

      const startEditingCurrency = (currency) => {
        setEditingCurrency(currency);
      };

      const cancelEditingCurrency = () => {
        setEditingCurrency(null);
      };

      const updateCurrency = () => {
        fetch(`/api/currencies/${editingCurrency.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCurrency),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(() => {
            setCurrencies(currencies.map(currency => (currency.id === editingCurrency.id ? editingCurrency : currency)));
            setEditingCurrency(null);
          })
          .catch(error => {
            console.error('Error updating currency:', error);
          });
      };

      const deleteCurrency = (id) => {
        fetch(`/api/currencies/${id}`, {
          method: 'DELETE',
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            setCurrencies(currencies.filter(currency => currency.id !== id));
          })
          .catch(error => {
            console.error('Error deleting currency:', error);
          });
      };

      return (
        <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Admin Panel</h2>

          {/* Add Product Form */}
          <div>
            <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>Add Product</h3>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleProductChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={newProduct.image}
              onChange={handleProductChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleProductChange}
            />
            <input
              type="text"
              name="specifications"
              placeholder="Specifications"
              value={newProduct.specifications}
              onChange={handleProductChange}
            />
            <input
              type="number"
              name="fob_sdpzu"
              placeholder="FOB SDPZU"
              value={newProduct.fob_sdpzu}
              onChange={handleProductChange}
            />
            <button onClick={addProduct}>Add Product</button>
          </div>

          {/* Add Currency Form */}
          <div>
            <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>Add Currency</h3>
            <input
              type="text"
              name="name"
              placeholder="Currency Name"
              value={newCurrency.name}
              onChange={handleCurrencyChange}
            />
            <input
              type="text"
              name="unit"
              placeholder="Currency Unit"
              value={newCurrency.unit}
              onChange={handleCurrencyChange}
            />
            <input
              type="text"
              name="flag"
              placeholder="Flag URL"
              value={newCurrency.flag}
              onChange={handleCurrencyChange}
            />
            <input
              type="number"
              name="central_bank"
              placeholder="Central Bank Rate"
              value={newCurrency.central_bank}
              onChange={handleCurrencyChange}
            />
            <button onClick={addCurrency}>Add Currency</button>
          </div>

          {/* Product List */}
          <div>
            <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>Products</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {products.map(product => (
                <li key={product.id} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {product.name}
                  <button onClick={() => startEditingProduct(product)}>Edit</button>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Currency List */}
          <div>
            <h3 style={{ color: '#4CAF50', marginBottom: '10px' }}>Currencies</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {currencies.map(currency => (
                <li key={currency.id} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                  {currency.name}
                  <button onClick={() => startEditingCurrency(currency)}>Edit</button>
                  <button onClick={() => deleteCurrency(currency.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Edit Product Form */}
          {editingProduct && (
            <div>
              <h3>Edit Product</h3>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value })}
              />
              <button onClick={updateProduct}>Update Product</button>
              <button onClick={cancelEditingProduct}>Cancel</button>
            </div>
          )}

          {/* Edit Currency Form */}
          {editingCurrency && (
            <div>
              <h3>Edit Currency</h3>
              <input
                type="text"
                name="name"
                placeholder="Currency Name"
                value={editingCurrency.name}
                onChange={(e) => setEditingCurrency({ ...editingCurrency, [e.target.name]: e.target.value })}
              />
              <button onClick={updateCurrency}>Update Currency</button>
              <button onClick={cancelEditingCurrency}>Cancel</button>
            </div>
          )}
        </div>
      );
    }

    export default AdminPanel;
