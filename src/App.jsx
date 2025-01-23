import React from 'react';
    import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
    import Home from './components/Home';
    import Products from './components/Products';
    import Data from './components/Data';
    import AboutUs from './components/AboutUs';
    import ContactUs from './components/ContactUs';
    import SignInSignUp from './components/SignInSignUp';
    import QuotationForm from './components/QuotationForm';
    import SampleForm from './components/SampleForm';
    import AdminPanel from './components/AdminPanel';
    import TrackOrder from './components/TrackOrder';

    function App() {
      return (
        <Router>
          <div className="container">
            <nav>
              <h1>Logo</h1>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/data">Data</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/signin">Sign in/ sing up</Link></li>
                <li><Link to="/admin">Admin Panel</Link></li>
              </ul>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/data" element={<Data />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/signin" element={<SignInSignUp />} />
              <Route path="/quotation" element={<QuotationForm />} />
              <Route path="/sample" element={<SampleForm />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/track-order" element={<TrackOrder />} />
            </Routes>
          </div>
        </Router>
      );
    }

    export default App;
