// components/Login.js
import '../styles/login/login.css';
import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../assets/image.png'; // Ensure this path is correct

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider(); // Create an instance of the Google provider

  useEffect(() => {
    // Check user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/dashboard'); // Redirect to dashboard if user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/Dashboard'); // Redirect to dashboard on success
    } catch (error) {
      setMessage('Invalid email or password. Please try again.'); // Custom error message
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/Dashboard'); // Redirect to dashboard after Google sign-in
    } catch (error) {
      setMessage('Failed to sign in with Google. Please try again.'); // Custom error message
    }
  };

  return (
    <div className="auth-page">
      <header className="headera">
        <h1 className="brand">Bharat petals - Login</h1>
      </header>

      <div className="auth-container">
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p className="message">{message}</p>}
          <button type="submit" className="auth-btn">Login</button>

          {/* Google Sign In Button */}
          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt="Google Icon" className="google-icon" />
            Login with Google
          </button>

          <p onClick={() => navigate('/reset-password')} className="toggle-link">Forgot Password?</p>
          <p onClick={() => navigate('/signup')} className="toggle-link">Don't have an account? Sign Up</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
