import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocation } from "react-router-dom";
import Spinner from "./spinner.js";
import "../styles/discover/explore.css";
import "../styles/discover/hero.css";
import Footer from "./footer";

// HeroSlider Component
const HeroSlider = () => {
  const slides = ["/images/diwali_banner.png", "/images/winter_banner.png"];
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

// Explore Page Component
const Explore = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({}); // Track selected size per product

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search")?.toLowerCase() || "";

  // Fetch products
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

  // Handle size selection
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // Add to Cart
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
        size: selectedSize, // 👈 carry forward selected size
      });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    alert(`✅ Added ${product.name} (${selectedSize.toUpperCase()}) to cart.`);
  };


  const filteredProducts = search
    ? products.filter((product) => {
      const matchName = product.name?.toLowerCase().includes(search);
      const matchDesc = product.description?.toLowerCase().includes(search);
      return matchName || matchDesc;
    })
    : products;

  if (loading) {
    return (
      <div className="explore-container">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="explore-page">
      <HeroSlider />

      <div className="explore-container">
        {filteredProducts.length === 0 ? (
          <p className="no-results">No products found.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product, index) => {
              const inCart = cartItems.find((item) => item.id === product.id);
              const selectedSize = selectedSizes[product.id];

              return (
                <React.Fragment key={product.id}>
                  <div className="product-card">
                    {/* Product Image */}
                    <div className="img-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-img"
                        loading="lazy"
                      />
                    </div>

                    {/* Info Container */}
                    <div className="info-container">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-desc">{product.description}</p>

                      {product.offerLine && (
                        <p className="offer-line">{product.offerLine}</p>
                      )}

                      <div className="price-block">
                        <span className="current-price">₹{product.price}</span>
                        {product.priceBeforeDiscount && (
                          <span className="old-price">
                            ₹{product.priceBeforeDiscount}
                          </span>
                        )}
                      </div>

                      {/* 👕 Size Dropdown Selector */}
                      <div className="size-selector">
                        <label
                          htmlFor={`size-${product.id}`}
                          className="size-label"
                        >
                          Select Size:
                        </label>
                        <select
                          id={`size-${product.id}`}
                          value={selectedSize || ""}
                          onChange={(e) =>
                            handleSizeSelect(product.id, e.target.value)
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

                      {/* Cart Button Only */}
                      <div className="cart-wrapper">
                        {inCart && (
                          <div className="in-cart-label">
                            ✅ Added ({inCart.quantity})
                          </div>
                        )}

                        <button
                          className="btn-add"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Insert heading image after the first 4 products */}
                  {index === 3 && (
                    <div className="heading-image-container">
                      <img
                        src="/images/new-arrival.png"
                        alt="New Arrivals"
                        className="heading-image"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
