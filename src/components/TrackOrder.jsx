import React from 'react';
    import { useLocation } from 'react-router-dom';

    function TrackOrder() {
      const location = useLocation();
      const searchParams = new URLSearchParams(location.search);
      const trackingNumber = searchParams.get('trackingNumber');

      return (
        <div>
          <h2>Track Order</h2>
          {trackingNumber ? (
            <p>Tracking number: {trackingNumber}</p>
          ) : (
            <p>No tracking number provided.</p>
          )}
        </div>
      );
    }

    export default TrackOrder;
