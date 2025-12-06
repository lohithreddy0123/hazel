import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/myorders.css';

const db = getFirestore();
const auth = getAuth();

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  console.log('✅ MyOrdersPage mounted');

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        console.log('👤 User logged in:', u.email);
        setUser(u);
      } else {
        console.log('⚠️ No user logged in');
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time fetch orders
  useEffect(() => {
    if (!user) return;

    console.log('🔍 Fetching real-time orders for user:', user.uid);
    const q = query(collection(db, 'orders'), where('user_id', '==', user.uid));

    const unsubscribe = onSnapshot(q, snapshot => {
      console.log('📦 Orders snapshot received:', snapshot.size);

      const ordersData = snapshot.docs.map(docSnap => {
        const data = docSnap.data();

        let timeline = data.order_timeline;
        if (!Array.isArray(timeline)) {
          // Convert string to array, or default to ['ordered']
          timeline = timeline ? [timeline] : ['ordered'];
        }

        return {
          id: docSnap.id,
          order_id: data.order_id,
          order_timeline: timeline,
          total_amount: data.total_amount,
          delivery_address: data.delivery_address,
          mobile: data.mobile,
          razorpay_payment_id: data.razorpay_payment_id,
          cart_items: data.cart_items || []
        };
      });


      console.log('✅ Final parsed orders:', ordersData);
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <p>Loading your orders...</p>;
  if (!user) return <p>Please login to view your orders.</p>;

  const timelineSteps = ["Ordered", "Shipped", "Out for Delivery", "Delivered"];

  return (
    <div className="my-orders-page">
      {!orders.length ? (
        <div className="no-orders">
          <p>No orders yet.</p>
          <button onClick={() => navigate('/')}>Explore Products</button>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <h3 className="order-id">Order ID: {order.order_id}</h3>

            {/* Product Catalog */}
            <div className="catalog">
              {order.cart_items.map((item, idx) => (
                <div key={idx} className="product-item">
                  <img src={item.image} alt={item.name} />
                  <span className="product-name">{item.name}</span>
                  <span className="product-desc">{item.description}</span>
                  {item.offerLine && <span className="product-offer">{item.offerLine}</span>}
                  <div className="product-price">
                    <span className="price">₹{item.price}</span>
                    {item.priceBeforeDiscount && item.priceBeforeDiscount > item.price && (
                      <span className="price-before">₹{item.priceBeforeDiscount}</span>
                    )}
                  </div>
                  <span className="product-quantity">Quantity: {item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Order Timeline */}
            <div className="timeline">
              {timelineSteps.map((status, idx) => {
                const completed = order.order_timeline
                  ?.map(s => s.toLowerCase())
                  .includes(status.toLowerCase());
                return (
                  <div key={idx} className={`timeline-step ${completed ? 'completed' : ''}`}>
                    <div className="circle">{idx + 1}</div>
                    <span className="status-text">{status}</span>
                    {idx < timelineSteps.length - 1 && <div className="line"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrdersPage;
