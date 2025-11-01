import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaSearch, FaShoppingCart, FaBars } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    if (showSearch) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/");
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <header className="header-container">
        {/* LEFT SECTION */}
        <div className="header-left">
          {!user ? (
            <Link to="/login" className="header-btn">
              Login
            </Link>
          ) : (
            <>
              {isMobile ? (
                <FaBars
                  className="icon-btn"
                  onClick={() => navigate("/profile")} // Redirect directly
                />
              ) : (
                <>
                  <button
                    className="header-btn"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>

                </>
              )}
            </>
          )}

          {/* Search Icon -- removed ffor temporary  */}

        </div>

        {/* CENTER BRAND */}
        <div className="header-center">
          <Link to="/" className="brand-logo">
            <img src="/images/logohh.png" alt="Hazel" />
          </Link>
        </div>

        {/* RIGHT SECTION — CART ALWAYS VISIBLE */}
        <div className="header-right">
          <Link to="/cart" className="cart-link">
            <FaShoppingCart className="cart-icon" />
          </Link>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && user && isMobile && (
          <div className="dropdown-menu">
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
          </div>
        )}

      </header>

      {/* SEARCH BAR BELOW HEADER */}
      {showSearch && (
        <div className="search-bar" ref={searchRef}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            autoFocus
          />
          <button onClick={() => setShowSearch(false)}>✕</button>
        </div>
      )}
    </>
  );
};

export default Header;
