import { db } from '../components/firebaseConfig'; // Firestore instance
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export async function handleProductPayment(amount, userDetails = {}, cartItems = []) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("Please login to proceed.");
    return;
  }

  try {
    // ✅ Convert paise to rupees before sending to backend
    const rupeeAmount = amount / 100;

    const response = await fetch('http://127.0.0.1:8000/payments/create-order/', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: rupeeAmount }), // send in ₹
    });

    const data = await response.json();

    if (data.error) {
      alert('Payment initiation failed: ' + data.error);
      return;
    }

    const options = {
      key: data.key,
      amount: data.amount, // amount in paise (returned from backend)
      currency: data.currency,
      order_id: data.order_id,
      name: 'Bharat Petals',
      description: 'Product Purchase',

      handler: async function (response) {
        alert("Payment Successful!");

        const now = Timestamp.now();
        const orderDocId = `order_${Date.now()}`;

        try {
          await setDoc(doc(db, 'orders', orderDocId), {
            user_id: user.uid,
            razorpay_payment_id: response.razorpay_payment_id,
            order_id: data.order_id,
            signature: response.razorpay_signature,
            mobile: userDetails.mobile || '',
            delivery_address: userDetails.address || '',
            cart_items: cartItems,
            created_at: now,
            total_amount: rupeeAmount, // store actual ₹
          });

          console.log("Order saved:", orderDocId);
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Error saving order to Firestore:', error);
          alert('Payment succeeded but saving order failed.');
        }
      },

      prefill: {
        name: userDetails.name || 'User Name',
        email: userDetails.email || 'user@example.com',
        contact: userDetails.mobile || '',
      },

      theme: {
        color: '#F37254',
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    console.error('Payment process error:', err);
    alert('Something went wrong: ' + err.message);
  }
}
