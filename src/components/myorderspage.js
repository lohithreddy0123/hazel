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

  console.log('MyOrdersPage mounted');

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        console.log('User logged in:', u.email);
        setUser(u);
      } else {
        console.log('No user logged in');
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time fetch orders
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'orders'), where('user_id', '==', user.uid));

    const unsubscribe = onSnapshot(q, snapshot => {
      console.log('Orders snapshot received:', snapshot.size);
      const ordersData = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        console.log('Processing order:', docSnap.id);

        return {
          id: docSnap.id,
          order_id: data.order_id,
          order_timeline: data.order_timeline || ['ordered'],
          total_amount: data.total_amount,
          delivery_address: data.delivery_address,
          mobile: data.mobile,
          razorpay_payment_id: data.razorpay_payment_id,
          products: [{
            id: data.id,
            name: data.name,
            description: data.description,
            imageUrl: data.image,
            offerLine: data.offerLine,
            price: data.price,
            priceBeforeDiscount: data.priceBeforeDiscount,
            quantity: data.quantity,
            stock: data.stock,
            created_at: data.created_at
          }]
        };
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return <p>Loading orders...</p>;
  if (!user) return <p>Please login to view your orders.</p>;

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

            {/* Products */}
            <div className="catalog">
              {order.products.map((p, idx) => (
                <div key={idx} className="product-item">
                  <img src={p.imageUrl} alt={p.name} />
                  <span className="product-name">{p.name}</span>
                  <span className="product-desc">{p.description}</span>
                  {p.offerLine && <span className="product-offer">{p.offerLine}</span>}
                  <div className="product-price">
                    <span className="price">₹{p.price}</span>
                    {p.priceBeforeDiscount && p.priceBeforeDiscount > p.price && (
                      <span className="price-before">₹{p.priceBeforeDiscount}</span>
                    )}
                  </div>
                  <span className="product-quantity">Quantity: {p.quantity}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="timeline">
              {["Ordered", "Shipped Out for Delivery", "Delivered"].map((status, idx) => {
                const completed = order.order_timeline?.map(s => s.toLowerCase()).includes(status.toLowerCase());
                return (
                  <div key={idx} className={`timeline-step ${completed ? 'completed' : ''}`}>
                    <div className="circle">{idx + 1}</div>
                    <span className="status-text">{status}</span>
                    {idx < 2 && <div className="line"></div>}
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
