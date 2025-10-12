import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { FaSearch, FaInfoCircle, FaCompass, FaUser, FaHome } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';

import './Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });

    return () => unsubscribe();
  }, []);

  const hideHeaderPaths = [
    '/Paymentbase', '/login', '/signup', '/reset-password', '/Paynow', '/TermsAndConditions',
  ];

  if (hideHeaderPaths.includes(location.pathname)) return null;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <Link to="/">
          <img src="images/logo.png" alt="Logo" />
        </Link>
      </div>

      <div className="header-right">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            className="header-search"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />  
        </div>

        <div className="header-links">
          {/* Home Button */}
          <Link to="/" className="nav-link">
            <FaHome className="nav-icon" />
            Home
          </Link>

          <Link to="/explore" className="nav-link">
            <FaCompass className="nav-icon" />
            Explore
          </Link>
          {/* <Link to="/discover" className="nav-link">
            <FaInfoCircle className="nav-icon" />
            About
          </Link> */}
          <Link to="/cart" className="nav-link">
            <FaShoppingCart className="nav-icon" />
            Cart
          </Link>
          {user ? (
            <Link to="/Profile" className="nav-link">
              <FaUser className="nav-icon" />
              Profile
            </Link>
          ) : (
            <Link to="/login" className="nav-link">
              <FaUser className="nav-icon" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
