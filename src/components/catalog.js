import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Spinner from "./spinner";
import Footer from "./footer";
import "../styles/discover/catalog.css";

const Catalog = () => {
  const { id } = useParams(); // product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [inCart, setInCart] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct(data);
          setCurrentImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setInCart(storedCart.some((item) => item.id === id));
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("⚠️ Please select a size before adding to cart.");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = storedCart.findIndex(
      (item) => item.id === id && item.size === selectedSize
    );

    if (existingIndex >= 0) {
      storedCart[existingIndex].quantity += 1;
    } else {
      storedCart.push({
        id,
        ...product,
        size: selectedSize,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));
    setInCart(true);
    alert(`✅ Added ${product.name} (${selectedSize.toUpperCase()}) to cart.`);
  };

  if (loading || !product) return <Spinner />;

  const images = [product.image, product.image2, product.image3, product.image4].filter(Boolean);

  return (
    <div className="catalog-page warm-bg">
      <div className="catalog-container">
        <div
          className="catalog-image"
          onMouseEnter={() => {
            if (images.length > 1) setCurrentImage(images[1]);
          }}
          onMouseLeave={() => setCurrentImage(images[0])}
        >
          <img src={currentImage} alt={product.name} />
        </div>

        <div className="catalog-info">
          <h1 className="catalog-name">{product.name}</h1>
          <p className="catalog-desc">{product.description}</p>

          {product.offerLine && <p className="catalog-offer">{product.offerLine}</p>}

          <div className="catalog-prices">
            <span className="catalog-price">₹{product.price}</span>
            {product.priceBeforeDiscount && (
              <span className="catalog-old">₹{product.priceBeforeDiscount}</span>
            )}
          </div>

          <div className="catalog-sizes">
            <label htmlFor="size">Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>

          <button className="catalog-add" onClick={handleAddToCart}>
            {inCart ? "✅ Added to Cart" : "Add to Cart"}
          </button>

          <div className="catalog-gallery">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name}-${i}`}
                onMouseEnter={() => setCurrentImage(img)}
                className={currentImage === img ? "active" : ""}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
