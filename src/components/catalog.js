import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  const q = new URLSearchParams(location.search);
  const catalogType = q.get("type")?.toLowerCase() || "";
  const productId = q.get("id") || q.get("productId") || "";

  // ✅ Fetch product + product list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch specific product if ID exists
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

        // Fetch all products for filtering and recommendations
        const snapshot = await getDocs(collection(db, "products"));
        const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

        const filtered =
          catalogType === "tshirt"
            ? all.filter((p) => p.type === "tshirt")
            : catalogType === "hoodie"
              ? all.filter((p) => p.type === "hoodie")
              : all;

        setProducts(filtered);

        // Recommendations (opposite or random)
        const oppositeType =
          catalogType === "tshirt"
            ? "hoodie"
            : catalogType === "hoodie"
              ? "tshirt"
              : "";
        const recs = oppositeType
          ? all.filter((p) => p.type === oppositeType && p.id !== productId).slice(0, 3)
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

  // ✅ Keep main image synced
  useEffect(() => {
    if (product && !mainImage && (product.image || product.image2)) {
      setMainImage(product.image || product.image2);
    }
  }, [product, mainImage]);

  // === Handlers ===
  const handleAddToCart = (p) => {
    if (!selectedSize) {
      alert("⚠️ Please select a size before adding to cart.");
      return;
    }

    const updated = [...cartItems];
    const idx = updated.findIndex(
      (it) => it.id === p.id && it.size === selectedSize
    );

    if (idx >= 0) updated[idx].quantity += quantity;
    else updated.push({ ...p, quantity, size: selectedSize, price: p.price });

    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    alert(`✅ Added ${p.name} (${selectedSize}) to cart.`);
  };

  // === Loading ===
  if (loading)
    return (
      <div className="catalog-container">
        <Spinner />
      </div>
    );

  // === Product Not Found ===
  if (productId && !product) {
    return (
      <div className="catalog-page warm-bg">
        <h2 className="section-title">Product not found</h2>
        <p>We couldn't find that product. Try another one.</p>
        <Footer />
      </div>
    );
  }

  const displayedProduct = product || products[0];
  if (!displayedProduct) {
    return (
      <div className="catalog-page warm-bg">
        <h2 className="section-title">No products available</h2>
        <Footer />
      </div>
    );
  }

  const images = [
    displayedProduct.image,
    displayedProduct.image2,
    displayedProduct.image3,
    displayedProduct.image4,
  ].filter(Boolean);

  return (
    <div className="catalog-product-page warm-bg">
      {/* Banner */}
      <div className="quality-banner">
        <p>Quality exclusive — free shipping on select orders</p>
      </div>

      <div className="catalog-product-wrapper">
        {/* Thumbnail Column */}
        <div className="thumbs-col">
          {images.map((src, idx) => (
            <button
              key={idx}
              className={`thumb-btn ${mainImage === src ? "active" : ""}`}
              onClick={() => setMainImage(src)}
            >
              <img src={src} alt={`thumb-${idx}`} />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="main-image-col">
          <div className="main-image-box">
            <img src={mainImage || images[0]} alt={displayedProduct.name} />
          </div>
        </div>

        {/* Product Details (Right Info Section or Below for Mobile) */}
        <div className="info-col">
          <div className="product-info-box">
            <h2 className="product-name">{displayedProduct.name}</h2>
            <p className="product-desc">{displayedProduct.description}</p>

            {/* Price */}
            <div className="price-row">
              <span className="current-price">₹{displayedProduct.price}</span>
              {displayedProduct.priceBeforeDiscount && (
                <span className="old-price">
                  ₹{displayedProduct.priceBeforeDiscount}
                </span>
              )}
            </div>

            {/* Offer Line */}
            {displayedProduct.offerLine && (
              <div className="offer-line">🔥 {displayedProduct.offerLine}</div>
            )}

            {/* Size Selector */}
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
            </div>

            {/* Quantity Selector */}
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

            {/* Add to Cart */}
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
      </div>

      {/* About Product */}
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
        <h3 className="recommend-title">You Might Also Like</h3>
        <div className="recommend-grid">
          {recommendations.map((r) => (
            <div key={r.id} className="recommend-card">
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
