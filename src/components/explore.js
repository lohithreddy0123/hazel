import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocation } from 'react-router-dom';
import Spinner from './spinner.js';
import '../styles/discover/explore.css';

const Explore = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get('search')?.toLowerCase() || '';

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    const updatedCart = [...cartItems];
    const existingIndex = updatedCart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += 1;
    } else {
      updatedCart.push({
        ...product,
        quantity: 1,
        price: product.price, // ✅ ensures cart has price field
      });
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  // Filter products by search term
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
    <div className="explore-container">
      {filteredProducts.length === 0 ? (
        <p className="no-results">No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const inCart = cartItems.find((item) => item.id === product.id);

            return (
              <div className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                />

                <p className="product-title-desc">
                  <span className="product-name">{product.name}</span> –{' '}
                  <span className="product-desc">{product.description}</span>
                </p>

                {product.offerLine && (
                  <p className="offer-line">{product.offerLine}</p>
                )}

                <p className="product-price">
                  {product.priceBeforeDiscount && (
                    <span className="price-before">₹{product.priceBeforeDiscount}</span>
                  )}{' '}
                  <span className="price-after">₹{product.price}</span>
                </p>

                <p className="product-stock">In stock: {product.stock ?? 0}</p>

                {inCart && (
                  <div className="added-label">
                    ✅ Added to cart ({inCart.quantity})
                  </div>
                )}

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Explore;
