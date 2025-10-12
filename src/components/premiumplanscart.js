import '../styles/planscart.css';
import React, { useState, useEffect, useRef } from 'react';
import Spinner from './spinner.js'; // Adjust the path if needed
import { handlePlanPayment } from '../utils/handlePlanPayment'; // import payment handler

const PremiumPlansCart = () => {
  const plan = {
    id: 'plan3',
    name: 'Premium Plan',
    description: 'Daily delivery of 300g of fresh flowers. Ideal for personal spaces or daily devotional use.',
    price: 1999,
    image: '/images/trayflowers.png',
  };

  const [deliverySlot, setDeliverySlot] = useState('8-10 AM');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [editAddress, setEditAddress] = useState(false);
  const autocompleteRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editAddress && window.google && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) setNewAddress(place.formatted_address);
      });
    }
  }, [editAddress]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const geocoder = new window.google.maps.Geocoder();
        const latlng = new window.google.maps.LatLng(latitude, longitude);

        geocoder.geocode({ location: latlng }, (results, status) => {
          setLoading(false);
          if (status === 'OK' && results[0]) {
            setNewAddress(results[0].formatted_address);
          } else {
            alert('Unable to get address');
          }
        });
      },
      () => {
        setLoading(false);
        alert('Failed to get location');
      }
    );
  };

  const saveAddress = () => {
    if (!newAddress.trim()) return alert('Enter a valid address');
    setAddress(newAddress);
    setEditAddress(false);
  };

  return (
    <div className="spc-container">
      <h2>Checkout</h2>

      <div className="spc-plan-row">
        <img src={plan.image} alt={plan.name} className="spc-plan-img" />
        <div className="spc-plan-info">
          <h3 className="spc-plan-name">{plan.name}</h3>
          <p className="spc-plan-desc">{plan.description}</p>
        </div>
        <div className="spc-plan-price">₹{plan.price}</div>
      </div>

      <div className="spc-section">
        <label>Delivery Time Slot</label>
        <select
          value={deliverySlot}
          onChange={e => setDeliverySlot(e.target.value)}
          className="spc-select"
        >
          <option value="8-10 AM">8 AM - 10 AM</option>
          <option value="5-10 PM">5 PM - 10 PM</option>
        </select>
      </div>

      <div className="spc-section">
        <label>Mobile Number</label>
        <input
          type="tel"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          className="spc-input"
        />
      </div>

      <div className="spc-section">
        <label>Delivery Address</label>
        {address && !editAddress ? (
          <>
            <p className="spc-address-display">{address}</p>
            <button onClick={() => setEditAddress(true)} className="spc-btn-edit">Edit</button>
          </>
        ) : (
          <>
            <input
              type="text"
              ref={autocompleteRef}
              value={newAddress}
              onChange={e => setNewAddress(e.target.value)}
              placeholder="Enter delivery address"
              className="spc-input"
            />
            <div className="spc-btn-group">
              <button
                onClick={handleUseCurrentLocation}
                className="spc-btn-loc"
                disabled={loading}
              >
                Use Current Location
              </button>
              <button onClick={saveAddress} className="spc-btn-save" disabled={loading}>
                Save Address
              </button>
            </div>
            {loading && (
              <div style={{ marginTop: '10px' }}>
                <Spinner />
              </div>
            )}
          </>
        )}
      </div>

      <div className="spc-billing-summary">
        <h3>Billing Summary</h3>
        <p>Plan Price: ₹{plan.price}</p>
        <p>Delivery Charges: ₹0</p>
        <hr />
        <h4>Total: ₹{plan.price + 0}</h4>
      </div>

      <button
        className="spc-btn-pay"
        onClick={() => handlePlanPayment(plan.price, {
          mobile,
          address,
          slot: deliverySlot,
        })}
      >
        Buy Now
      </button>
    </div>
  );
};

export default PremiumPlansCart;
