import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarkInputs, setRemarkInputs] = useState({});

  const statusOptions = ["ordered", "packed", "shipped", "delivered", "cancelled"];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user || user.email !== "wearbyhazel@gmail.com") {
        alert("ACCESS DENIED");
        signOut(auth);
        window.location.href = user ? "/" : "/admin/login";
        return;
      }

      try {
        const snap = await getDocs(collection(db, "orders"));
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(arr);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function updateStatus(orderId, status) {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;

    const data = orderSnap.data();
    let timeline = Array.isArray(data.order_timeline) ? data.order_timeline : [];
    if (!timeline.includes(status)) timeline.push(status);

    await updateDoc(orderRef, {
      order_status: status,
      order_timeline: timeline,
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: status } : o))
    );
  }

  async function updateRemark(orderId) {
    const remark = remarkInputs[orderId] || "";
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { remarks: remark });
  }

  function logout() {
    signOut(auth);
    window.location.href = "/admin/login";
  }

  if (loading) return <p className="loading-text">Loading admin panel...</p>;

  // --- Group orders by order_id + timestamp for rowspan ---
  const groupedOrders = {};
  orders.forEach((order) => {
    const timestamp = order.created_at?.toDate
      ? order.created_at.toDate().toLocaleString()
      : order.created_at;
    const key = `${order.order_id}-${timestamp}`;
    if (!groupedOrders[key]) groupedOrders[key] = [];
    groupedOrders[key].push(order);
  });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Timestamp</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Delivery Address</th>
              <th>Phone</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Selected Size</th>
              <th>Quantity</th>
              <th>Remarks</th>
              <th>Bill</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedOrders).map((group) => {
              const totalRows = group.reduce(
                (sum, order) => sum + (order.cart_items?.length || 0),
                0
              );
              let rowIndex = 0;

              return group.map((order) =>
                order.cart_items?.map((item) => {
                  rowIndex++;
                  return (
                    <tr
                      key={`${order.id}-${item.id}-${rowIndex}`}
                      className={`order-row ${order.order_status || "ordered"}`}
                    >
                      {/* Merge Order ID and Timestamp */}
                      {rowIndex === 1 && (
                        <>
                          <td rowSpan={totalRows}>{order.order_id}</td>
                          <td rowSpan={totalRows}>
                            {order.created_at?.toDate
                              ? order.created_at.toDate().toLocaleString()
                              : order.created_at}
                          </td>
                        </>
                      )}

                      <td>₹{order.total_amount || order.total}</td>
                      <td>
                        <select
                          value={order.order_status || "ordered"}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="address-cell" title={order.delivery_address}>
                        {order.delivery_address?.length > 20
                          ? `${order.delivery_address.slice(0, 20)}...`
                          : order.delivery_address}
                      </td>
                      <td>{order.mobile}</td>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.selected_size || item.size}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <input
                          type="text"
                          value={remarkInputs[order.id] || order.remarks || ""}
                          onChange={(e) =>
                            setRemarkInputs({
                              ...remarkInputs,
                              [order.id]: e.target.value,
                            })
                          }
                        />
                        <button onClick={() => updateRemark(order.id)}>Save</button>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            window.open(`/bill/${order.order_id}`, "_blank")
                          }
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            window.open(`/download-bill/${order.order_id}`, "_blank")
                          }
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
