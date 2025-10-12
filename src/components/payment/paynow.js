import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { auth } from '../../firebaseConfig.js';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import '../../styles/side-section-css/payment.css';
import Payment from '../../assets/payment.png';
import visaLogo from '../../assets/visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import amexLogo from '../../assets/amex.png';
import discoverLogo from '../../assets/discover.png';

function Paynow() {
  const location = useLocation();
  const [totalAmount, setTotalAmount] = useState(0);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentType, setPaymentType] = useState('credit');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  const { selectedPlan, total } = location.state || { selectedPlan: '', total: 0 };

  useEffect(() => {
    if (total) {
      setTotalAmount(total);
    }

    // Fetch user details from Firebase
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email); // Set email from Firebase Auth
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid)); // Change 'users' to your Firestore collection name
        if (userDoc.exists()) {
          setContact(userDoc.data().phoneNumber); // Assuming phoneNumber is the field name
        }
      }
    };

    fetchUserDetails();
  }, [total]);

  const handlePayment = (e) => {
    e.preventDefault();
    // Basic validation
    if (!cardHolderName || !cardNumber || !expirationDate || !cvv) {
      setError('All fields are required.');
      return;
    }

    // Prepare Razorpay payment options
    const options = {
      key: "rzp_test_JP5iDOqeP8PaSU", // Replace with your Razorpay API Key ID
      amount: totalAmount * 100, // Amount in paise
      currency: "INR",
      name: "Vyrex SEO Services",
      description: "Payment for selected plan",
      image: `${window.location.origin}/images/3.png`, // Logo path
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // You can also add your logic to handle post-payment actions here
      },
      prefill: {
        name: cardHolderName,
        email: email, // Use the retrieved email from Firebase
        contact: contact // Use the retrieved contact from Firestore
      },
      theme: {
        color: "#3399cc" // Optional: Customize the theme color
      }
    };

    // Create Razorpay instance and open the payment dialog
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="payment-page">
      <div className="logo-container">
        <Link to='/Home'>
          <img src="images/3.png" alt='Vyrex Logo' className="vyrex-logo" />
        </Link>
      </div>

      <h1 className="page-heading">Complete Your Payment for Vyrex SEO Services</h1>

      <div>
        <img
          src={Payment}
          alt='progress bar'
          className='progress-bar'
        />
      </div>

      <section className="main-contentp">
        <div className="payment-form">
          <h2 className="form-title">Make Payment</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handlePayment}>
            <div className="payment-type">
              <label>
                <input
                  type="radio"
                  value="credit"
                  checked={paymentType === 'credit'}
                  onChange={() => setPaymentType('credit')}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="debit"
                  checked={paymentType === 'debit'}
                  onChange={() => setPaymentType('debit')}
                />
                Debit Card
              </label>
            </div>

            <div className="card-logos">
              <img src={visaLogo} alt="Visa" className="card-logo" />
              <img src={mastercardLogo} alt="MasterCard" className="card-logo" />
              <img src={amexLogo} alt="American Express" className="card-logo" />
              <img src={discoverLogo} alt="Discover" className="card-logo" />
            </div>

            <input
              type="text"
              placeholder='*Card Number'
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder='*Expiration Date (MM/YY)'
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder='*CVV'
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder='*Cardholder Name'
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              required
            />

            <div className='totalandpay'>
              <div className="payment-summary">
                Total: <strong>${totalAmount}/month</strong>
              </div>
              <button type="submit" className="submit-payment-button">Pay Now</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Paynow;
