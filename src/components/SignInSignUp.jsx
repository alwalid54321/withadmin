import React, { useState } from 'react';

    function SignInSignUp() {
      const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        email: '',
        company: '',
        country: '',
        businessType: '',
        preferredCurrency: '',
        password: '',
        confirmPassword: '',
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
          <h2>Sign In/Sign Up</h2>
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
            <label>Business Type</label>
            <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} />
            <label>Preferred Currency</label>
            <input type="text" name="preferredCurrency" value={formData.preferredCurrency} onChange={handleChange} />
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }

    export default SignInSignUp;
