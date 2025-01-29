import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [marketData, setMarketData] = useState([
    {
      id: 1,
      productName: 'Sesame Seeds',
      exportGrade: 'Premium',
      spotPrice: '1,250.00',
      demand: 'High',
      grade1: '1,200.00',
      grade2: '1,150.00',
      grade3: '1,100.00',
      stock: '500 MT',
    },
    // ... other products
  ]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="data-section">
          <div className="section-header">
            <h2>Market Data</h2>
            <button className="add-btn">Add New Product</button>
          </div>

          <div className="market-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Export Grade</th>
                  <th>Spot Price</th>
                  <th>Demand</th>
                  <th>1st Grade</th>
                  <th>2nd Grade</th>
                  <th>3rd Grade</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.exportGrade}</td>
                    <td>${item.spotPrice}</td>
                    <td>{item.demand}</td>
                    <td>${item.grade1}</td>
                    <td>${item.grade2}</td>
                    <td>${item.grade3}</td>
                    <td>{item.stock}</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
