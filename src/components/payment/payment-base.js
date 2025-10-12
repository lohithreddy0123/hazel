import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/side-section-css/payment.css';
import { auth } from '../../firebaseConfig.js';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import GoogleIcon from '../../assets/image.png';
import Payment from '../../assets/payment.png';
import Signin from '../../assets/signin.png';

const db = getFirestore();

function Paymentbase() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('base');
  const [total, setTotal] = useState(250);
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const googleProvider = new GoogleAuthProvider();

  const plans = [
    { id: 'base', name: 'Base Plan', price: 250 },
    { id: 'standard', name: 'Standard Plan', price: 450 },
    { id: 'premium', name: 'Premium Plan', price: 999 },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/paymentbase');
    } catch (error) {
      setMessage('Invalid email or password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/paymentbase');
    } catch (error) {
      setMessage('Failed to sign in with Google.');
    }
  };

  const handlePlanChange = (e) => {
    const selectedPlanId = e.target.value;
    setSelectedPlan(selectedPlanId);
    const selectedPlanDetails = plans.find(plan => plan.id === selectedPlanId);
    setTotal(selectedPlanDetails.price);
  };

  const storeUserData = async (uid, paymentData) => {
    try {
      const userRef = doc(db, 'users', uid);
      const existingData = (await getDoc(userRef)).data();
      const updatedPaymentHistory = existingData?.paymentHistory ? [...existingData.paymentHistory, paymentData] : [paymentData];

      await setDoc(userRef, { ...existingData, paymentHistory: updatedPaymentHistory }, { merge: true });
      console.log('User data stored successfully');
    } catch (error) {
      console.error('Error storing user data: ', error);
      throw new Error('Failed to store user data');
    }
  };

  const calculateExpiryDate = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 31);
    return expiryDate.toISOString().split('T')[0];
  };

  const validateForm = () => {
    if (!name || !websiteUrl || !phone) {
      setFormError('All fields are required. Please fill out the form completely.');
      return false;
    }
    setFormError('');
    return true;
  };

  useEffect(() => {
    if (user) {
      const paypalButtonsContainer = document.getElementById('paypal-button-container');
      paypalButtonsContainer.innerHTML = '';

      const paypalButtons = window.paypal.Buttons({
        createOrder: async (data, actions) => {
          if (!validateForm()) {
            return; // Stop if form is not valid
          }

          const expiryDate = calculateExpiryDate(); // Calculate the expiry date

          // Create the order with the initial data
          const initialPaymentData = {
            name,
            websiteUrl,
            phone,
            selectedPlan,
            total,
            successAmount: total,
            paymentStatus: 'Pending',
            expiryDate: expiryDate, // Set initial expiry date
            timestamp: new Date().toISOString(),
          };

          await storeUserData(user.uid, initialPaymentData); // Store initial data

          // Create the order
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toString(),
              },
            }],
          });
        },
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async function (details) {
            alert('Transaction completed by ' + details.payer.name.given_name);

            const expiryDate = calculateExpiryDate(); // Calculate the expiry date after payment

            // Update payment data upon success
            const successfulPaymentData = {
              name,
              websiteUrl,
              phone,
              selectedPlan,
              total,
              successAmount: total,
              paymentStatus: 'Paid',
              expiryDate, // Set expiry date
              transactionId: details.id,
              timestamp: new Date().toISOString(),
            };

            await storeUserData(user.uid, successfulPaymentData); // Update user data after payment success
            navigate('/Dashboard'); // Navigate after storing data
          });
        },
        onError: async (err) => {
          console.error('PayPal payment error: ', err);
          setMessage('Failed to process PayPal payment.');

          // Update user data upon payment failure
          const failedPaymentData = {
            name,
            websiteUrl,
            phone,
            selectedPlan,
            total,
            successAmount: 0,
            paymentStatus: 'Failed',
            expiryDate: '-', // No expiry date on failure
            timestamp: new Date().toISOString(),
          };

          await storeUserData(user.uid, failedPaymentData); // Update user data on payment failure
        },
      });

      paypalButtons.render(paypalButtonsContainer); // Render PayPal buttons
    }
  }, [user, total, name, websiteUrl, phone]); // Added name, websiteUrl, and phone to dependencies

  return (
    <div className="payment-page">
      <div className="logo-container">
        <Link to='/'>
          <img src="images/3.png" alt='Vyrex Logo' className="vyrex-logo" />
        </Link>
      </div>
      <h1 className="page-heading">Complete Your Payment for Vyrex SEO Services</h1>

      <div>
        <img src={user ? Payment : Signin} alt='progress bar' className='progress-bar' />
      </div>

      {user ? (
        <section className="main-contentp">
          <div className="payment-form">
            <h2 className="form-title">Payment Information</h2>

            <div className="plan-selection">
              <h3>Select Your Plan</h3>
              {plans.map(plan => (
                <div key={plan.id}>
                  <input
                    type="radio"
                    id={plan.id}
                    name="plan"
                    value={plan.id}
                    checked={selectedPlan === plan.id}
                    onChange={handlePlanChange}
                  />
                  <label htmlFor={plan.id}>{plan.name} - ${plan.price} per month</label>
                </div>
              ))}
            </div>

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

            {formError && <p className="form-error">{formError}</p>}

            <div className="payment-summary">
              Total: <strong>{total} USD</strong> (Selected: {plans.find(plan => plan.id === selectedPlan)?.name})
            </div>

            <div id="paypal-button-container"></div>
          </div>
        </section>
      ) : (
        <div className="login-page">
          <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
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
              {message && <p className="error-message">{message}</p>}
              <button type="submit" className="auth-btn">Login</button>

              {/* Google Sign In Button */}
              <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                <img src={GoogleIcon} alt="Google Icon" className="google-icon" />
                Sign in with Google
              </button>

              <p onClick={() => navigate('/reset-password')} className="toggle-link">Forgot Password?</p>
              <p onClick={() => navigate('/signup')} className="toggle-link">Don't have an account? Sign Up</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Paymentbase;
