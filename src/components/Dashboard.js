import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust path as needed
import '../styles/profile.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login'); // Redirect to login after logout
      })
      .catch((err) => {
        console.error('Logout failed:', err);
      });
  };

  return (
    <div className="dashboard-container-dash">
      {/* Main Content */}
      <main className="main-content-dash">
        {/* Personal Area */}
        <section className="personal-area-dash">
          <h2>Your Personal Info</h2>
          <p><strong>Email:</strong> user@example.com</p>
        </section>

        {/* Subscriptions Section */}
        <section className="subscriptions-section-dash">
          <h2>Your Subscriptions</h2>
          <p>No subscriptions yet.</p>
        </section>

        {/* Orders Section */}
        <section className="orders-section-dash">
          <h2>Your Orders</h2>
          <p>No orders yet.</p>
        </section>

        {/* Buttons */}
        <section className="buttons-section-dash">
          <Link to="/cart">
            <button className="action-button-dash">Go to Cart</button>
          </Link>
          <Link to="/discover">
            <button className="action-button-dash">Contact Support</button>
          </Link>
        </section>
      </main>

      {/* Logout Button Fixed at Bottom */}
      <footer className="footer-logout-dash">
        <button className="logout-button-dash" onClick={handleLogout}>Logout</button>
      </footer>
    </div>
  );
};

export default Dashboard;
