import '../styles/login/ResetPassword.css';
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      if (error.code === 'auth/user-not-found') {
        setMessage('No account found with this email.');
      } else if (error.code === 'auth/invalid-email') {
        setMessage('Please enter a valid email.');
      } else {
        setMessage('Failed to send password reset email. Try again.');
      }
    }
  };

  return (
    <div className="auth-page">
      <header className="headera">
        <h1 className="brand">Bharat petals</h1>
      </header>
      <div className="auth-container">
        <form onSubmit={handleResetPassword} className="auth-form">
          <h2>Reset Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <p className="message">{message}</p>}
          <button type="submit" className="auth-btn">Send Reset Email</button>
          <p onClick={() => navigate('/login')} className="toggle-link">Back to Login</p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
