import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Spinner from "./spinner.js";
import { handleProductPayment } from "../utils/handleProductPayment.js";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [extraCharges, setExtraCharges] = useState(0);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  // 🛒 Load cart & address
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedItems);

    const savedAddress = localStorage.getItem("deliveryAddress");
    if (savedAddress) setAddress(savedAddress);
  }, []);

  // 🌍 Google Autocomplete
  useEffect(() => {
    if (editAddress && window.google && autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "in" },
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setNewAddress(place.formatted_address);
        }
      });
    }
  }, [editAddress]);

  // 💳 Buy Now Handler
  const handleBuyNow = async () => {
    if (!address || !mobile) {
      alert("Please provide both address and mobile number.");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      alert("Cart is empty.");
      return;
    }

    for (const it of cartItems) {
      if (!it.size) {
        alert("Please select size for all products in cart.");
        return;
      }
    }

    const totalAmount = grandTotal * 100; // ₹ → paise
    const userDetails = {
      mobile,
      address,
      name: "User Name",
      email: "user@example.com",
    };

    try {
      await handleProductPayment(totalAmount, userDetails, cartItems);

      // ✅ Clear cart after successful payment
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err) {
      console.error("Error during payment:", err);
      alert("❌ " + (err.message || "Something went wrong"));
    }
  };

  // 📍 Use current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!window.google || !window.google.maps) {
          setLoading(false);
          return;
        }
        const geocoder = new window.google.maps.Geocoder();
        const latlng = new window.google.maps.LatLng(latitude, longitude);
        geocoder.geocode({ location: latlng }, (results, status) => {
          setLoading(false);
          if (status === "OK" && results?.length > 0) {
            setNewAddress(results[0].formatted_address);
          }
        });
      },
      () => setLoading(false)
    );
  };

  // 🔄 Quantity handler
  const handleQuantityChange = (productId, increment) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        const newQty = (item.quantity || 1) + increment;
        return { ...item, quantity: Math.max(newQty, 1) };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ❌ Remove item
  const handleRemoveItem = (productId, size) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === productId && item.size === size)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // 👕 Change size
  const handleSizeChange = (productId, oldSize, newSize) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId && item.size === oldSize) {
        return { ...item, size: newSize };
      }
      return item;
    });

    const merged = [];
    for (const it of updatedCart) {
      const found = merged.find((m) => m.id === it.id && m.size === it.size);
      if (found) {
        found.quantity = (found.quantity || 1) + (it.quantity || 1);
      } else {
        merged.push({ ...it });
      }
    }

    setCartItems(merged);
    localStorage.setItem("cart", JSON.stringify(merged));
  };

  // 💰 Totals
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const grandTotal = totalPrice + deliveryCharges + extraCharges;

  // 💾 Save Address
  const handleAddressSave = async () => {
    if (!newAddress.trim()) {
      alert("Please enter a valid address.");
      return;
    }
    try {
      localStorage.setItem("deliveryAddress", newAddress);
      setAddress(newAddress);
      setEditAddress(false);
      await setDoc(doc(db, "addresses", "userAddress"), {
        address: newAddress,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  const handleExploreClick = () => navigate("/");

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <>
          <p className="empty-cart">Your cart is empty.</p>
          <button className="explore-btn" onClick={handleExploreClick}>
            Explore Products
          </button>
        </>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={`${item.id}-${item.size || "nosize"}`}>
                <div className="cart-img-wrapper">
                  <img src={item.image} alt={item.name} className="cart-img" />

                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={(item.quantity || 1) <= 1}
                    >
                      –
                    </button>
                    <span className="qty-value">{item.quantity || 1}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, +1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-text-btn"
                    onClick={() => handleRemoveItem(item.id, item.size)}
                  >
                    remove
                  </button>
                </div>

                <div className="cart-details">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-desc">{item.description}</p>
                  <p className="cart-price">₹{item.price.toFixed(2)}</p>

                  {/* 👕 Size Selector */}
                  <div className="cart-size-selector">
                    <label htmlFor={`size-${item.id}-${item.size}`}>Size:</label>
                    <select
                      id={`size-${item.id}-${item.size}`}
                      value={item.size || ""}
                      onChange={(e) =>
                        handleSizeChange(item.id, item.size || "", e.target.value)
                      }
                      className="size-dropdown"
                    >
                      <option value="">Choose...</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xl">XL</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mobile-input">
            <input
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <div className="address-section">
            {address && !editAddress ? (
              <>
                <p>
                  Product will be delivered to: <strong>{address}</strong>
                </p>
                <button onClick={() => setEditAddress(true)} className="edit-btn">
                  Edit Address
                </button>
              </>
            ) : (
              <div className="address-input">
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  ref={autocompleteRef}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <div className="button-group">
                  <button
                    onClick={handleUseCurrentLocation}
                    className="location-btn"
                    disabled={loading}
                  >
                    Use Current Location
                  </button>
                  <button onClick={handleAddressSave} className="save-btn" disabled={loading}>
                    Save Address
                  </button>
                </div>
                {loading && (
                  <div className="spinner-wrapper" style={{ marginTop: "10px" }}>
                    <Spinner />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="delivery-info">
            👕 <strong>🎉 Get ready to enjoy your new clothes!</strong>
          </div>

          <div className="price-summary">
            <p>Products Total: ₹{totalPrice.toFixed(2)}</p>
            <p>Delivery Charges: ₹{deliveryCharges.toFixed(2)}</p>
            <p>Other Charges: ₹{extraCharges.toFixed(2)}</p>
            <hr />
            <h3>Total: ₹{grandTotal.toFixed(2)}</h3>
          </div>

          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
