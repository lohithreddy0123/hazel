// src/components/discover.js

import '../styles/discover/discover.css';
import '../styles/discover/footer.css';
import '../styles/discover/cta.css';
import FAQ from './side-sections/side-section.js';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Discover = () => {

    const location = useLocation();

    // Scroll restoration logic (if needed)
    useEffect(() => {
        const scrollPositiondiscover = sessionStorage.getItem('scrollPositiondiscover');
        if (scrollPositiondiscover) {
            window.scrollTo(0, parseInt(scrollPositiondiscover, 10));
        }
        const handleScroll = () => {
            sessionStorage.setItem('scrollPositiondiscover', window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    return (
        <div>

            <main>

                {/* Featured Collection / Promo Banner */}
                <section id="subscription-cta" className="subscription-cta">
                    <div className="subscription-cta-content">
                        <h2>Discover Hazel’s Exclusive Collection</h2>
                        <p>
                            Explore the latest fashion trends and must-have styles in our curated Hazel collection.
                            Fresh arrivals, premium fabrics, and designs that stand out — all in one place!
                        </p>
                        <p className="call-us">
                            <strong>Shop Now:</strong> <a href="/">Browse the Collection</a>
                        </p>
                    </div>
                    <div className="subscription-cta-image">
                        <img
                            src="images/cloths.png"
                            alt="Featured Hazel Collection"
                        />
                    </div>
                </section>

                <div id="why-choose-bharat-petals">
                    <h2>What Hazel Offers</h2>
                    <ul>
                        <li><strong>Curated Collections:</strong> Trendy, high-quality apparel including hoodies, jackets, and T-shirts for style and comfort.</li>
                        <li><strong>Exclusive Offers:</strong> Enjoy up to 60% off on seasonal collections and limited-time offers.</li>
                        <li><strong>New Arrivals Regularly:</strong> Keep your wardrobe fresh with our latest releases.</li>
                        <li><strong>Easy Returns & Exchanges:</strong> Hassle-free returns for a smooth shopping experience.</li>
                        <li><strong>Premium Quality Materials:</strong> Only the finest fabrics ensuring durability and comfort.</li>
                        <li><strong>Reliable Delivery:</strong> Fast and secure shipping so your products reach on time.</li>
                    </ul>
                </div>

                <FAQ />

                <footer className="footer">
                    <div className="footer-section footer-logo">
                        <img src="images/logoh.png" alt="Hazel Logo" className="logo" />
                    </div>
                    <div className="footer-container">
                        <div className="footer-section footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><HashLink smooth to="/#flower-plans">Home</HashLink></li>
                                <li><HashLink smooth to="/discover#why-choose-bharat-petals">About Us</HashLink></li>
                                <li><HashLink smooth to="/#flower-plans">Services</HashLink></li>
                                <li><HashLink smooth to="/discover#subscription-cta">Connect with us</HashLink></li>
                            </ul>
                        </div>

                        <div className="footer-section footer-legal">
                            <h4>Legal</h4>
                            <ul>
                                <li><Link to="/TermsAndConditions">Terms of Service</Link></li>
                                <li><Link to="/Discover#faq-section">FAQ</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section footer-social">
                            <h4>Follow Us</h4>
                            <div className="social-icons">
                                <a href="https://www.linkedin.com/company/vyrex-seo" target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/ios-filled/30/ffffff/linkedin.png" alt="LinkedIn" />
                                </a>
                                <a href="https://x.com/VyrexOfficial" target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/ios-filled/30/ffffff/twitter.png" alt="Twitter" />
                                </a>
                                <a href="https://www.facebook.com/share/u64nanas4ZY8icGJ/" target="_blank" rel="noopener noreferrer">
                                    <img src="https://img.icons8.com/ios-filled/30/ffffff/facebook-new.png" alt="Facebook" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <hr className="footer-divider" />
                    <div className="footer-bottom">
                        <p>© 2025 Hazel. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Discover;
