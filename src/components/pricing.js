import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import '../styles/pricing/cta.css';
import '../styles/pricing/footer.css';
import '../styles/pricing/pricing.css';

function Pricing() {
  const location = useLocation();

  // Pricing data (removing currency)
  const pricingPlans = {
    lite: 0,
    base: 250,
    standard: 450,
    premium: 999,
  };

  // Scroll restoration logic
  useEffect(() => {
    const scrollPositionpricing = sessionStorage.getItem('scrollPositionpricing');
    if (scrollPositionpricing) {
      window.scrollTo(0, parseInt(scrollPositionpricing, 10));
    }
    const handleScroll = () => {
      sessionStorage.setItem('scrollPositionpricing', window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  return (
    <div>
      {/* Updated Heading Section */}
      <section className="pricing-intro">
        <h1>Our SEO Services Pricing</h1> {/* New H1 */}
      </section>

      {/* Pricing Section */}
      <section id="pricing">
        <div className="plan lite">
          <h2>Lite Plan (Free)</h2>
          <p style={{ padding: '0px 0' }}>For small businesses looking to get started with basic SEO.</p>
          <Link to="/FreeSection">Try it free!</Link>
          <ul>
            <li>✔️ Free Website Audit</li>
            <li>✔️ Free Keyword Research (5 Keywords)</li>
            <li>✔️ Free Backlink Check</li>
            <li>✔️ SEO Performance Summary</li>
          </ul>
        </div>

        <div className="plan base">
          <h2>Basic Plan — $250/month</h2>
          <p style={{ padding: '0px 0' }}>For small to medium-sized businesses seeking comprehensive SEO support.</p>
          <Link to="/Paymentbase">Choose Plan</Link>
          <ul>
            <li>✔️ On-Page SEO Optimization</li>
            <li>✔️ Technical SEO Audit</li>
            <li>✔️ Keyword Research (10 Keywords)</li>
            <li>✔️ Monthly Performance Reporting</li>
            <li>✔️ Ongoing Backlink Monitoring</li>
            <li>✔️ Flexible Monthly Renewal</li>
          </ul>
        </div>

        <div className="plan standard">
          <h2>Standard Plan — $450/month</h2>
          <p style={{ padding: '0px 0' }}>For larger businesses or those needing more extensive work.</p>
          <Link to="/Paymentbase">Choose Plan</Link>
          <ul>
            <li>✔️ Enhanced On-Page SEO</li>
            <li>✔️ In-Depth Technical SEO Improvements</li>
            <li>✔️ Keyword Research & Content Optimization (20-30 Keywords)</li>
            <li>✔️ Local SEO Setup</li>
            <li>✔️ Advanced Backlink Strategy and Analysis</li>
            <li>✔️ Detailed Monthly Performance Reporting</li>
          </ul>
        </div>
      </section>

      {/* Video Call to Action Section */}
      <section className="video-cta-section">
        <div className="video-container">
          <img src="images/Screenshot 2024-09-13 145000.png" alt="SEO analysis video" autoPlay loop muted playsInline />
        </div>
        <div className="cta-container">
          <h2>Get Personalized SEO Recommendations</h2>
          <p style={{ padding: '60px 0' }}>Upload your website URL, and let us analyze it to suggest the best SEO plan for you. Our expert team will provide a tailored strategy to boost your online presence.</p>
          <Link to="/Call" className="cta-button">Analyze My Website</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-section footer-logo">
          <Link to="/">
            <img src="/images/3.png" alt="Vyrex Logo" className="logo" />
          </Link>
        </div>
        <div className="footer-container">
          <div className="footer-section footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="/#about-us">About Us</a></li>
              <li><a href="/Home#services-overview">Services</a></li>
              <li><a href="#call">Contact Us</a></li>
              <li><a href="pricing.js">Pricing</a></li>
            </ul>
          </div>

          <div className="footer-section footer-legal">
            <h4>Legal</h4>
            <ul>
              <li><Link to='/TermsAndConditions'>Terms of Service</Link></li>
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
          <p>© 2024 Vyrex. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Pricing;
