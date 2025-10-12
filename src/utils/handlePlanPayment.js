import { db } from '../components/firebaseConfig'; // Firestore instance
import { collection, setDoc, doc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export async function handlePlanPayment(planAmount, userDetails = {}) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("Please login to proceed.");
    return;
  }

  try {
    const response = await fetch('https://bharatpetalsserver-kwut.onrender.com/payments/create-order/', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: planAmount }),
    });

    const data = await response.json();

    if (data.error) {
      alert('Payment initiation failed: ' + data.error);
      return;
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: 'Bharat Petals',
      description: 'Plan Subscription',

      handler: async function (response) {
        alert("Payment Successful!");

        const now = Timestamp.now();
        const expire = Timestamp.fromDate(
          new Date(now.toDate().getTime() + 30 * 24 * 60 * 60 * 1000)
        );

        try {
          await setDoc(doc(db, 'subscriptions', user.uid), {
            razorpay_payment_id: response.razorpay_payment_id,
            order_id: data.order_id,
            signature: response.razorpay_signature,
            mobile: userDetails.mobile || '',
            delivery_address: userDetails.address || '',
            delivery_slot: userDetails.slot || '',
            created_at: now,
            expires_at: expire,
            plan_amount: planAmount,
          });

          console.log("Subscription saved for user:", user.uid);
          // Redirect to dashboard after success
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('Error saving to Firestore:', error);
          alert('Payment succeeded but saving info failed.');
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
