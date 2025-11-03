import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocation, Link } from "react-router-dom";
import Spinner from "./spinner";
import Footer from "./footer";

import "../styles/discover/explore2.css";
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

// ✅ USP ROW
const USPRow = () => {
  const usps = [
    { icon: "🚚", text: "Free Delivery" },
    { icon: "⭐", text: "Premium Quality" },
    { icon: "🔥", text: "Limited Edition" },
  ];
  return (
    <div className="usp-row">
      {usps.map((u, i) => (
        <div key={i} className="usp-item">
          <span className="usp-icon">{u.icon}</span>
          <span className="usp-text">{u.text}</span>
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
      <div
        className="product-card"
        key={product.id}
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
            <button className="btn-add" onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Now each entire section is clickable to /catalog?type=...&productId=...
  return (
    <div className="explore-page warm-bg">
      <HeroSlider />

      {/* === TSHIRTS === */}
      <Link
        to={`/catalog?type=tshirt&productId=${tshirts[0]?.id || ""}`}
        className="catalog-container-link"
      >
        <section className="explore-section">
          <h2 className="section-title">— T-Shirts —</h2>
          <div className="product-grid">
            {tshirts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </Link>

      <USPRow />

      <div className="video-placeholder">
        <img
          src="/images/WhatsApp Image 2025-11-04 at 00.31.16_55cbe182.jpg"
          alt="mid-banner"
        />
      </div>

      {/* === HOODIES === */}
      <Link
        to={`/catalog?type=hoodie&productId=${hoodies[0]?.id || ""}`}
        className="catalog-container-link"
      >
        <section className="explore-section">
          <h2 className="section-title">— Hoodies —</h2>
          <div className="product-grid">
            {hoodies.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </Link>

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
