import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Ensure this imports your Firebase config
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../assets/image.png'; // Ensure this path is correct
import '../styles/login/signup.css'; // Ensure this path is correct

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      // Register the user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send a verification email
      await sendEmailVerification(user);

      // Optional: show success message briefly before redirecting
      setMessage('Registration successful! Verification email sent.');

      // Redirect to home page
      navigate('/'); // <-- changed from '/dashboard' to '/'
    } catch (error) {
      setMessage('An error occurred during sign up. Please try again.');
      console.error('Error during sign up:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      // Redirect to home page after Google sign-up
      navigate('/'); // <-- changed from '/dashboard' to '/'
    } catch (error) {
      setMessage('Failed to sign up with Google. Please try again.');
      console.error('Google sign up error:', error);
    }
  };

  return (
    <div className="auth-page">
      <header className="headera">
        <h1 className="brand">Bharat petals - Sign Up</h1>
      </header>

      <div className="auth-container">
        <form onSubmit={handleSignUp} className="auth-form">
          <h2>Sign Up</h2>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {message && <p className="message">{message}</p>}
          <button type="submit" className="auth-btn">Sign Up</button>

          {/* Google Sign Up Button */}
          <button type="button" className="google-btn" onClick={handleGoogleSignUp}>
            <img src={GoogleIcon} alt="Google Icon" className="google-icon" />
            Sign Up with Google
          </button>

          <p onClick={() => navigate('/login')} className="toggle-link">
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
