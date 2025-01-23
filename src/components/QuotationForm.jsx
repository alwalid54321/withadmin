import React, { useState } from 'react';

    function QuotationForm() {
      const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        email: '',
        company: '',
        country: '',
        product: '',
        productVariation: '',
        quantity: '',
        port: '',
        services: '',
        currency: '',
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Here you would typically send the form data to your backend
      };

      return (
        <div>
          <h2>Request for Quotation form</h2>
          <input type="text" placeholder="Tracking #" />
          <button>Track order</button>
          <form className="form-container" onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            <label>Contact Number</label>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <label>Company</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} />
            <label>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} />
            <select name="product" value={formData.product} onChange={handleChange}>
              <option>Choose Product</option>
            </select>
            <select name="productVariation" value={formData.productVariation} onChange={handleChange}>
              <option>Product Variation</option>
            </select>
            <input type="text" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
            <span>Tons</span>
            <select name="port" value={formData.port} onChange={handleChange}>
              <option>Choose the Port</option>
            </select>
            <select name="services" value={formData.services} onChange={handleChange}>
              <option>Add on Services</option>
            </select>
            <select name="currency" value={formData.currency} onChange={handleChange}>
              <option>Choose currency</option>
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }

    export default QuotationForm;
