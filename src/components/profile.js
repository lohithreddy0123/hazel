import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FaUser, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate('/login'))
      .catch((err) => console.error('Logout failed:', err));
  };

  const handleHelpRedirect = () => {
    navigate('/discover'); // Adjust to your actual help route
  };

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="profile-icon" aria-label="User Profile Icon">
          <FaUser />
        </div>
        <h1 tabIndex={0} className="welcome-heading">Welcome</h1>
      </header>

      <main className="profile-main">


        <section className="orders-section">
          <Link to="/myorderspage" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>MY Orders</h2>
            <div className="orders-content">
              {/* You can optionally add a brief summary or icon here */}
            </div>
          </Link>
        </section>

        {/* Help Section */}
        <div className="help-section action-section" onClick={handleHelpRedirect}>
          <div className="action-label">
            <FaQuestionCircle className="action-icon" />
            <span>Help & Support</span>
          </div>
          <div className="action-arrow">→</div>
        </div>

        {/* Logout Section */}
        <div className="logout-section action-section" onClick={handleLogout}>
          <div className="action-label">
            <FaSignOutAlt className="action-icon" />
            <span>Logout</span>
          </div>
          <div className="action-arrow">→</div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
