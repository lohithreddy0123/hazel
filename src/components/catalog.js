import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

import { db } from "../firebaseConfig";

import Spinner from "./spinner";
import Footer from "./footer";
import "../styles/discover/catalog.css";


const Catalog = () => {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const navigate = useNavigate();



  const location = useLocation();
  const q = new URLSearchParams(location.search);
  const catalogType = q.get("type")?.toLowerCase() || "";
  const productId = q.get("id") || q.get("productId") || "";

  // Touch handling refs (for swipe)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // === Fetch product and product list ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (productId) {
          const ref = doc(db, "products", productId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            setProduct(data);
            setMainImage(data.image || data.image2 || "");
          } else {
            setProduct(null);
          }
        }

        const snapshot = await getDocs(collection(db, "products"));
        const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        const filtered =
          catalogType === "tshirt"
            ? all.filter((p) => p.type === "tshirt")
            : catalogType === "hoodie"
              ? all.filter((p) => p.type === "hoodie")
              : all;

        setProducts(filtered);

        const oppositeType =
          catalogType === "tshirt"
            ? "hoodie"
            : catalogType === "hoodie"
              ? "tshirt"
              : "";

        const recs = oppositeType
          ? all
            .filter((p) => p.type === oppositeType && p.id !== productId)
            .slice(0, 3)
          : all.filter((p) => p.id !== productId).slice(0, 3);

        setRecommendations(recs);
      } catch (err) {
        console.error("Error fetching catalog/product:", err);
      } finally {
        setLoading(false);
      }
    };

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    fetchData();
  }, [catalogType, productId]);

  // === Setup images for display ===
  const displayedProduct = product || products[0];
  const images = displayedProduct
    ? [
      displayedProduct.image,
      displayedProduct.image2,
      displayedProduct.image3,
      displayedProduct.image4,
    ].filter(Boolean)
    : [];

  // === Update main image when index changes ===
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[currentIndex]);
    }
  }, [currentIndex, images]);

  // === Ensure main image is initialized correctly ===
  useEffect(() => {
    if (product && !mainImage && (product.image || product.image2)) {
      setMainImage(product.image || product.image2);
    }
  }, [product, mainImage]);

  // === Swipe handling ===
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // === Add to cart handler ===
  // === Add to cart handler ===
  const handleAddToCart = (p) => {
    const updated = [...cartItems];
    const idx = updated.findIndex(
      (it) => it.id === p.id && it.size === selectedSize
    );

    if (idx >= 0) updated[idx].quantity += quantity;
    else updated.push({ ...p, quantity, size: selectedSize, price: p.price });

    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);

    // Redirect to cart page immediately
    navigate("/cart");
  };



  // === Conditional rendering ===
  if (loading)
    return (
      <div className="catalog-container">
        <Spinner />
      </div>
    );

  if (productId && !product) {
    return (
      <div className="catalog-page warm-bg">
        <h2 className="section-title">Product not found</h2>
        <p>We couldn't find that product. Try another one.</p>
        <Footer />
      </div>
    );
  }

  if (!displayedProduct) {
    return (
      <div className="catalog-page warm-bg">
        <h2 className="section-title">No products available</h2>
        <Footer />
      </div>
    );
  }

  // === Main render ===
  return (
    <div className="catalog-product-page warm-bg">
      <div className="ticker-container">
        <div className="ticker-track">
          <span>• Quality</span>
          <span>• Exclusive</span>
          <span>• Free Delivery</span>
          <span>• Winter Sale</span>
          <span>• Premium Cloth</span>
          <span>• Fast Shipping</span>
          <span>• Limited Edition</span>

          <span>• Quality</span>
          <span>• Exclusive</span>
          <span>• Free Delivery</span>
          <span>• Winter Sale</span>
          <span>• Premium Cloth</span>
          <span>• Fast Shipping</span>
          <span>• Limited Edition</span>
        </div>
      </div>


      <div className="catalog-product-wrapper">
        {/* Thumbnails */}
        <div className="thumbs-col">
          {images.map((src, idx) => (
            <button
              key={idx}
              className={`thumb-btn ${currentIndex === idx ? "active" : ""}`}
              onClick={() => setCurrentIndex(idx)} // updated
            >
              <img src={src} alt={`thumb-${idx}`} />
            </button>
          ))}
        </div>


        {/* Main image (swipeable) */}
        <div className="main-image-col">
          <div
            className="main-image-box"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={mainImage || images[0]} alt={displayedProduct.name} />
            {images.length > 1 && (
              <div className="image-dots">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`dot ${idx === currentIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="info-col">
          <div className="product-info-box">
            <h2 className="product-name">{displayedProduct.name}</h2>
            <p className="product-desc">{displayedProduct.description}</p>

            <div className="price-row">
              <span className="current-price">₹{displayedProduct.price}</span>
              {displayedProduct.priceBeforeDiscount && (
                <span className="old-price">
                  ₹{displayedProduct.priceBeforeDiscount}
                </span>
              )}
            </div>

            {displayedProduct.offerLine && (
              <div className="offer-line">🔥 {displayedProduct.offerLine}</div>
            )}

            {/* Size selection */}
            <div className="size-row">
              <label>Size:</label>
              <div className="size-options">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Size Chart link */}
              <span
                className="size-chart-text"
                onClick={() => setShowSizeChart(true)}
              >
                Size Chart
              </span>
            </div>

            {/* Quantity selection */}
            <div className="qty-row">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  −
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="add-cart-row">
              <button
                className="btn-add"
                onClick={() => handleAddToCart(displayedProduct)}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Size Chart Modal */}
        {showSizeChart && (
          <div
            className="size-chart-overlay"
            onClick={() => setShowSizeChart(false)}
          >
            <div
              className="size-chart-modal"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <button
                className="size-chart-close"
                onClick={() => setShowSizeChart(false)}
              >

              </button>
              <img src="/images/chartsize.png" alt="Size Chart" />
            </div>
          </div>
        )}
      </div>

      {/* About product */}
      <div className="about-block">
        <div className="about-title">About Product</div>
        <div
          className="about-content product-details"
          dangerouslySetInnerHTML={{
            __html:
              displayedProduct.about ||
              displayedProduct.description ||
              "<p>No details available.</p>",
          }}
        />
      </div>

      {/* Recommendations */}
      <div className="recommend-section">
        <h3 className="recommend-title">Limited Pieces You Might Miss</h3>
        <div className="recommend-grid">
          {recommendations.map((r) => (
            <div
              key={r.id}
              className="recommend-card"
              onClick={() => navigate(`/catalog?type=${r.type}&productId=${r.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="rec-img">
                <img src={r.image} alt={r.name} />
              </div>
              <div className="rec-body">
                <h4>{r.name}</h4>
                <p className="rec-price">₹{r.price}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
