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


                <section id="subscription-cta" className="subscription-cta">
                    <div className="subscription-cta-content">
                        <h2>Daily Flowers Delivered — Subscribe Now!</h2>
                        <p>
                            Subscribe now and enjoy daily hand-delivered blooms at your preferred time slot!
                            Have questions or want to customize your plan? We’re here to help.
                        </p>
                        <p className="call-us">
                            <strong>Call us anytime:</strong> <a href="tel:9063143344">906-314-3344</a>
                        </p>
                    </div>
                    <div className="subscription-cta-image">
                        <img
                            src="images/trayflowers.png"
                            alt="Tray of fresh flowers"
                        />
                    </div>
                </section>

                <div id="why-choose-bharat-petals">
                    <h2>What Bharat Petals Offers</h2>
                    <ul>
                        <li><strong>Daily Fresh Flowers:</strong> Fresh flowers sourced directly from farms delivered to your doorstep every day.</li>
                        <li><strong>Flexible Delivery Slots:</strong> Choose your preferred delivery time — morning or evening — for your convenience.</li>
                        <li><strong>Customized Subscription Plans:</strong> Tailor your flower subscription to fit your pooja and special occasion needs.</li>
                        <li><strong>Special Offers & Discounts:</strong> Enjoy exclusive deals and seasonal offers as a loyal subscriber.</li>
                        <li><strong>Separate Orders Available:</strong> Apart from subscriptions, you can place one-time or special occasion orders anytime.</li>
                        <li><strong>Perfect for Pooja & Rituals:</strong> Reliable daily flower deliveries to keep your pooja fresh and vibrant every day.</li>
                    </ul>
                </div>




                <FAQ />

                <footer className="footer">
                    <div className="footer-section footer-logo">
                        <img src="images/logo.png" alt="bharat-petals Logo" className="logo" />
                    </div>
                    <div className="footer-container">
                        <div className="footer-section footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                {/* Use full path + hash for current page anchors */}
                                <li><HashLink smooth to="/#flower-plans">Home</HashLink></li>

                                {/* Link to another page with hash */}
                                <li><HashLink smooth to="/discover#why-choose-bharat-petals">About Us</HashLink></li>

                                {/* Same page full path + hash */}
                                <li><HashLink smooth to="/#flower-plans">Services</HashLink></li>

                                {/* Another page with hash */}
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
                        <p>© 2025 Bharat-petals. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Discover;
