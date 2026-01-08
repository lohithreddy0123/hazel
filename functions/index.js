import { db } from "../components/firebaseConfig";
import { setDoc, doc, runTransaction, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function handleProductPayment(
  amount,
  userDetails = {},
  cartItems = [],
  setLoading
) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("Please log in to proceed with payment.");
    return;
  }

  try {
    setLoading(true);

    // 🚨 STOCK CHECK + ORDER CREATION (BACKEND)
    const response = await fetch(
      "https://us-central1-hazel-d9071.cloudfunctions.net/createRazorpayOrder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount, // paise
          cartItems,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      setLoading(false);
      alert(data.error);
      return;
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "Bharat Petals",
      description: "Product Purchase",

      handler: async function (response) {
        try {
          const now = Timestamp.now();
          const orderDocId = `order_${Date.now()}`;

          // 🔒 FINAL STOCK CHECK + UPDATE (TRANSACTION)
          for (const item of cartItems) {
            const ref = doc(db, "products", item.id);

            await runTransaction(db, async (tx) => {
              const snap = await tx.get(ref);
              if (!snap.exists()) {
                throw new Error("Product not found");
              }

              const currentStock = snap.data()[item.size];

              if (currentStock < (item.quantity || 1)) {
                throw new Error(
                  `Out of stock after payment: ${item.name} (${item.size})`
                );
              }

              tx.update(ref, {
                [item.size]: currentStock - (item.quantity || 1),
              });
            });
          }

          // ✅ SAVE ORDER ONLY AFTER STOCK SUCCESS
          await setDoc(doc(db, "orders", orderDocId), {
            user_id: user.uid,
            razorpay_payment_id: response.razorpay_payment_id,
            order_id: data.order_id,
            signature: response.razorpay_signature,
            ...userDetails,
            cart_items: cartItems,
            total_amount: amount / 100,
            created_at: now,
            order_timeline: ["ordered"],
          });

          setLoading(false);
          window.location.href = "/myorderspage";
        } catch (err) {
          setLoading(false);
          alert(err.message || "Stock update failed after payment");
        }
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    setLoading(false);
    alert(err.message || "Something went wrong");
  }
}
