import '../../styles/side-section-css/payment.css'; // Use the same styles as login
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import GoogleIcon from '../../assets/image.png'; // Ensure this path is correct

const db = getFirestore();

const FreeSection = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null); // To track user authentication state
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider(); // Create an instance of the Google provider

  useEffect(() => {
    // Check user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update the user state based on authentication
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The effect will handle the navigation after logging in
    } catch (error) {
      setMessage('Invalid email or password. Please try again.'); // Custom error message
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // The effect will handle the navigation after logging in
    } catch (error) {
      setMessage('Failed to sign in with Google. Please try again.'); // Custom error message
    }
  };

  const handleEnrollFreePlan = async () => {
    if (!name || !websiteUrl || !phone || !country) {
      setMessage('All fields are required. Please fill out the form completely.');
      return;
    }

    const userData = {
      name,
      websiteUrl,
      phone,
      country,
      selectedPlan: 'lite',
      total: 0, // Free plan has no cost
      successAmount: 0,
      paymentStatus: 'Paid', // Automatically set to Paid for free plan
      expiryDate: '-', // No expiry date for free plan
      timestamp: new Date().toISOString(),
    };

    try {
      if (user) {
        await storeUserData(user.uid, userData);
        navigate('/dashboard'); // Navigate to the dashboard after successful enrollment
      } else {
        setMessage('You need to be logged in to enroll.');
      }
    } catch (error) {
      setMessage('Failed to enroll in the free plan.');
    }
  };

  const storeUserData = async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      const existingData = (await getDoc(userRef)).data();
      const updatedPaymentHistory = existingData?.paymentHistory ? [...existingData.paymentHistory, userData] : [userData];

      await setDoc(userRef, { ...existingData, paymentHistory: updatedPaymentHistory }, { merge: true });
      console.log('User data stored successfully');
    } catch (error) {
      console.error('Error storing user data: ', error);
      throw new Error('Failed to store user data');
    }
  };

  return (
    <div className="auth-page">
      <header className="headera">
        <h1 className="brand">Vyrex - Get the Lite Plan for Free</h1>
      </header>

      <div className="auth-container">
        {user ? (
          // If user is logged in, show enrollment form
          <form onSubmit={(e) => { e.preventDefault(); handleEnrollFreePlan(); }} className="auth-form">
            <h2 className="enroll-heading">Claim Your Free Lite Plan</h2> {/* Updated heading */}
            <input
              type="text"
              placeholder="*Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="*Website URL"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="*Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="*Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            {message && <p className="message">{message}</p>}
            <button type="submit" className="enroll-button">Claim Your Free Lite Plan - $0</button> {/* Updated button */}
          </form>
        ) : (
          // If user is not logged in, show login form
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
        )}
      </div>
    </div>
  );

};

export default FreeSection;
