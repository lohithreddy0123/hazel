import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocation, Link } from "react-router-dom";
import Spinner from "./spinner";
import Footer from "./footer";

import "../styles/discover/explore2.css";
import "../styles/discover/explore.css";
import "../styles/discover/hero.css";

// ✅ HERO SLIDER
const HeroSlider = () => {
  const slides = ["/images/WhatsApp Image 2025-11-04 at 00.31.17_14719fed.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <img
          key={index}
          src={slide}
          alt={`slide-${index}`}
          className={`slide-img ${index === currentIndex ? "active" : ""}`}
        />
      ))}
    </div>
  );
};

// ✅ USP ROW (professional, monochrome SVG icons)


const USPRow = () => {
  const usps = [
    {
      key: "delivery",
      title: "Free Delivery",
      desc: "Tracked shipping on every order",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3h11v4h4l3 4v8h-2a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H3V3zm16 8h-3V5H5v10h14v-4zM7 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
        </svg>
      ),
    },
    {
      key: "quality",
      title: "Premium Quality",
      desc: "Handpicked materials and craftsmanship",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2.39 4.85L19 8.17l-3.5 3.41.83 4.83L12 15.77 7.67 16.4l.83-4.83L4.99 8.17l4.61-.32L12 2z" />
        </svg>
      ),
    },
    {
      key: "limited",
      title: "Limited Edition",
      desc: "Exclusive collections every season",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2s1.5 2.3 1.5 4.5c0 2.4-1.5 3.5-1.5 7.5 0-4-1.5-5.1-1.5-7.5C10.5 4.3 12 2 12 2zm0 20c-4.4 0-8-3.6-8-8 0-4.4 8-12 8-12s8 7.6 8 12c0 4.4-3.6 8-8 8z" />
        </svg>
      ),
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % usps.length);
    }, 2000); // fast: every 2 seconds
    return () => clearInterval(timer);
  }, [usps.length]);

  return (
    <div className="usp-row" role="list" aria-label="Key benefits">
      {usps.map((u, i) => (
        <div
          key={u.key}
          className={`usp-item ${i === activeIndex ? "active" : ""}`}
          role="listitem"
        >
          <span className="usp-icon">{u.icon}</span>
          <div className="usp-text">
            <strong>{u.title}</strong>
            <p>{u.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


const Explore = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "products"));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product.id];
    if (!selectedSize) {
      alert("⚠️ Please select a size before adding to cart.");
      return;
    }

    const updatedCart = [...cartItems];
    const existingIndex = updatedCart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        ...product,
        quantity: 1,
        price: product.price,
        size: selectedSize,
      });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    alert(`✅ Added ${product.name} (${selectedSize.toUpperCase()}) to cart.`);
  };

  const filteredProducts = search
    ? products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(search);
      const matchDesc = p.description?.toLowerCase().includes(search);
      return matchName || matchDesc;
    })
    : products;

  const tshirts = filteredProducts.filter((p) => p.type === "tshirt");
  const hoodies = filteredProducts.filter((p) => p.type === "hoodie");

  if (loading)
    return (
      <div className="explore-container">
        <Spinner />
      </div>
    );

  // ✅ Product Card Component
  const ProductCard = ({ product }) => {
    const inCart = cartItems.find((item) => item.id === product.id);
    const selectedSize = selectedSizes[product.id];

    return (
      <Link
        to={`/catalog?type=${product.type}&productId=${product.id}`}
        className="product-card-link"
      >
        <div
          className="product-card"
          onMouseEnter={(e) => {
            const imgEl = e.currentTarget.querySelector("img");
            if (imgEl && product.image2) imgEl.src = product.image2;
          }}
          onMouseLeave={(e) => {
            const imgEl = e.currentTarget.querySelector("img");
            if (imgEl) imgEl.src = product.image;
          }}
        >
          <div className="img-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-img"
              loading="lazy"
            />
          </div>

          <div className="info-container">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-desc">{product.description}</p>

            {product.offerLine && (
              <p className="offer-line">{product.offerLine}</p>
            )}

            <div className="price-block">
              <span className="current-price">₹{product.price}</span>
              {product.priceBeforeDiscount && (
                <span className="old-price">₹{product.priceBeforeDiscount}</span>
              )}
            </div>

            <div className="size-selector">
              <label htmlFor={`size-${product.id}`}>Size:</label>
              <select
                id={`size-${product.id}`}
                value={selectedSize || ""}
                onClick={(e) => e.stopPropagation()} // 👈 Prevent link trigger when selecting size
                onChange={(e) => handleSizeSelect(product.id, e.target.value)}
                className="size-dropdown"
              >
                <option value="">Choose...</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">XL</option>
              </select>
            </div>

            <div className="cart-wrapper">
              {inCart && (
                <div className="in-cart-label">✅ Added ({inCart.quantity})</div>
              )}
              <button
                className="btn-add"
                onClick={(e) => {
                  e.preventDefault(); // 👈 Stop navigation
                  e.stopPropagation(); // 👈 Stop link click
                  handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  };



  // ✅ Now each entire section is clickable to /catalog?type=...&productId=...
  return (
    <div className="explore-page warm-bg">
      <HeroSlider />

      {/* === TSHIRTS === */}
      <section className="explore-section">
        <div className="section-heading">
          <h2 className="section-title desktop-title">
            Limited Edition Boxy Fit T-Shirts — Crafted Once for the Few Who Know
          </h2>
          <h2 className="section-title mobile-title">
            Limited Boxy Fit — Designed Once. Never Again
          </h2>

          <p className="section-subtitle">
            Only a handful created. Never restocked. Premium craftsmanship for those who value rarity.
          </p>
        </div>


        <div className="product-grid">
          {tshirts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      <USPRow />

      <div className="video-placeholder">
        <img
          src="/images/WhatsApp Image 2025-11-04 at 00.31.16_55cbe182.jpg"
          alt="mid-banner"
        />
      </div>

      {/* === HOODIES === */}

      <section className="explore-section">
        <div className="section-heading">
          <h2 className="section-title desktop-title">
            Oversized Hoodies — Comfort That Speaks Style
          </h2>
          <h2 className="section-title mobile-title">
            Boxy Fit Hoodies — Born Rare.
          </h2>

          <p className="section-subtitle">
            Each hoodie is the result of hours of design, precision tailoring, and hand-finished detail.
            Created in limited numbers to preserve its rarity — once gone, it’s gone forever.
          </p>
        </div>

        <div className="product-grid">
          {hoodies.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      <div className="video-row">
        <img
          src="/images/WhatsApp Image 2025-11-04 at 00.31.17_e4ff98cd.jpg"
          alt="promo1"
        />
        <img
          src="/images/WhatsApp Image 2025-11-04 at 00.31.18_8c034c03.jpg"
          alt="promo2"
        />
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
