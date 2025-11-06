import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "../styles/discover/footer.css"; // reuse your existing footer styles

const Footer = () => {
  return (
    <footer className="footer">


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
  );
};

export default Footer;
