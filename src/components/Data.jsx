import React from 'react';

    function Data() {
      return (
        <div>
          <h2>Data</h2>
          <input type="text" placeholder="Tracking #" />
          <button>Track order</button>
          <div className="form-container">
            <select>
              <option>Choose Product</option>
            </select>
            <select>
              <option>Select Starting Date</option>
            </select>
            <select>
              <option>Select Ending Date</option>
            </select>
            <p>Data and graphs will be provided for everyone for the blast 10 days</p>
            <select>
              <option>Choose Report</option>
            </select>
            <p>For customized reports, Please write your specs OR arrange a call</p>
            <textarea placeholder="customized specs"></textarea>
            <select>
              <option>Select Call Date</option>
            </select>
            <select>
              <option>Select Call Time</option>
            </select>
          </div>
        </div>
      );
    }

    export default Data;
