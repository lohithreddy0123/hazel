import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

// Styles
import '../styles/index.css/plans.css';
import '../styles/index.css/h1.css';
import '../styles/index.css/customize-plan-section.css';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition, 10));
        }
        const handleScroll = () => {
            sessionStorage.setItem('scrollPosition', window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);

    const plans = [
        {
            name: 'Aaradhana Plan (Worship) ',
            grams: '150g / Day',
            price: '₹799',
            description: 'Daily delivery of 150g of fresh marigold and jasmine. Best for small homes and simple daily pooja.',
            checkoutLink: '/BasicPlansCart'
        },
        {
            name: 'Pushpaseva Plan (Floral Service)',
            grams: '300g / Day',
            price: '₹1399',
            description: 'Get a vibrant mix of roses, chrysanthemums, and marigolds delivered daily. Ideal for regular home or temple use.',
            checkoutLink: '/StandardPlansCart'
        },
        {
            name: 'Divyasri Plan (Divine Luxury) ',
            grams: '500g / Day',
            price: '₹2799',
            description: 'A premium selection of exotic flowers like orchids, lilies, and roses delivered daily. Designed for temples, gifting, or luxury rituals.',
            checkoutLink: '/PremiumPlansCart'
        }
    ];


    return (
        <div className="main">
            <div id="flower-plans">
                <h1 className="responsive-h1">Everyday Flowers. Delivered Fresh.</h1>

                <div className="plans-wrapper">
                    {plans.map((plan, index) => (
                        <div key={index} className="plan-card">
                            <img
                                src="images/allmix.png"
                                alt="All Mix Flowers"
                                className="plan-image"
                            />
                            <h3 className="plan-title">{plan.name}</h3>
                            <h4 className="plan-title">{plan.grams}</h4>
                            <p className="plan-price">{plan.price}</p>
                            <p className="plan-desc">{plan.description}</p>

                            {/* Checkout Button */}
                            <Link to={plan.checkoutLink} className="checkout-btn">
                                Checkout
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mobile-custom-plan">
                <h3 className="custom-plan-title">Customize Your Daily Plan</h3>
                <p className="custom-plan-text">
                    Personalize your subscription by choosing what you love. Add, remove or mix items — your plan, your way!
                </p>
                <Link to="/discover" className="custom-plan-btn">
                    Customize Now
                </Link>
            </div>

            <footer className="footer">
                <div className="footer-section footer-logo">
                    <img src="images/logo.png" alt="bharat-petals Logo" className="logo" />
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
                    <p>© 2025 Bharat-petals. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
