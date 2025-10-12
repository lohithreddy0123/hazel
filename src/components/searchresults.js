import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocation } from 'react-router-dom';
import '../styles/discover/search.css'; // Your new CSS file

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allProducts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        const filteredInStock = allProducts.filter((p) => p.inStock !== false);
        setProducts(filteredInStock);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = query
    ? products.filter((product) => {
      const matchName = product.name?.toLowerCase().includes(query);
      const matchDesc = product.description?.toLowerCase().includes(query);
      const matchKeywords =
        Array.isArray(product.keywords) &&
        product.keywords.some((k) => k.toLowerCase().includes(query));
      return matchName || matchDesc || matchKeywords;
    })
    : products;

  const filteredIds = new Set(filteredProducts.map((p) => p.id));
  const moreProducts = products.filter((p) => !filteredIds.has(p.id)).slice(0, 8);

  return (
    <div className="searchresults-container">
      {filteredProducts.length === 0 ? (
        <>
          <h2 className="search-no-results">No results found for "{query}"</h2>
          <p className="search-no-results-subtext">
            But here are some products you might like instead:
          </p>
          <div className="search-product-grid">
            {moreProducts.length > 0 ? (
              moreProducts.map((product) => (
                <div className="search-product-card" key={product.id}>
                  <img src={product.image} alt={product.name} className="search-product-img" />
                  <p className="search-product-title-desc">
                    <span className="search-product-name">{product.name}</span> -{' '}
                    <span className="search-product-desc">{product.description}</span>
                  </p>
                  <p className="search-product-price">${product.price.toFixed(2)}</p>
                  <button className="search-add-to-cart-btn">Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No products to show right now.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="searchresults-heading">Showing results for "{query}"</h2>
          <p className="search-delivery-message">We deliver within 1 day!</p>

          <div className="search-product-grid">
            {filteredProducts.map((product) => (
              <div className="search-product-card" key={product.id}>
                <img src={product.image} alt={product.name} className="search-product-img" />
                <p className="search-product-title-desc">
                  <span className="search-product-name">{product.name}</span> -{' '}
                  <span className="search-product-desc">{product.description}</span>
                </p>
                <p className="search-product-price">${product.price.toFixed(2)}</p>
                <button className="search-add-to-cart-btn">Add to Cart</button>
              </div>
            ))}
          </div>

          {moreProducts.length > 0 && (
            <>
              <h3 className="search-more-products-heading">More similar products</h3>
              <div className="search-product-grid">
                {moreProducts.map((product) => (
                  <div className="search-product-card" key={product.id}>
                    <img src={product.image} alt={product.name} className="search-product-img" />
                    <p className="search-product-title-desc">
                      <span className="search-product-name">{product.name}</span> -{' '}
                      <span className="search-product-desc">{product.description}</span>
                    </p>
                    <p className="search-product-price">${product.price.toFixed(2)}</p>
                    <button className="search-add-to-cart-btn">Add to Cart</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
