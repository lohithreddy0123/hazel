import { db } from "../components/firebaseConfig";
import { setDoc, doc, runTransaction, Timestamp, getDoc } from "firebase/firestore";
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
    alert("Please log in to continue with your purchase.");
    return;
  }

  try {
    setLoading(true);

    // 🔹 FRONTEND STOCK CHECK BEFORE CALLING BACKEND
    for (const item of cartItems) {
      const productRef = doc(db, "products", item.id);
      const snap = await getDoc(productRef);

      if (!snap.exists()) {
        setLoading(false);
        alert("Sorry, this product is no longer available.");
        return;
      }

      const currentStock = snap.data()[item.size];
      if (typeof currentStock !== "number") {
        setLoading(false);
        alert(`Sorry, ${item.name} in size ${item.size} is unavailable.`);
        return;
      }

      if (currentStock < (item.quantity || 1)) {
        setLoading(false);
        alert(
          currentStock === 0
            ? `Sorry, ${item.name} in size ${item.size} is sold out.`
            : `Only ${currentStock} left in stock for ${item.name} (${item.size}).`
        );
        return;
      }
    }

    // 🚨 CALL BACKEND TO CREATE RAZORPAY ORDER
    const response = await fetch(
      "https://us-central1-hazel-d9071.cloudfunctions.net/createRazorpayOrder",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount, // in paise
          cartItems,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      setLoading(false);
      alert("Unable to initiate payment. Please try again.");
      return;
    }

    // 🔹 RAZORPAY OPTIONS
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.order_id,
      name: "Bharat Petals",
      description: "Product Purchase",

      handler: async function (response) {
        try {
          // 🔹 FINAL STOCK CHECK & UPDATE AFTER PAYMENT
          for (const item of cartItems) {
            const ref = doc(db, "products", item.id);
            await runTransaction(db, async (tx) => {
              const snap = await tx.get(ref);
              if (!snap.exists()) throw new Error("Product no longer available.");
              const currentStock = snap.data()[item.size];

              if (currentStock < (item.quantity || 1)) {
                throw new Error(
                  currentStock === 0
                    ? `${item.name} in size ${item.size} just sold out.`
                    : `Only ${currentStock} left in stock for ${item.name} (${item.size}).`
                );
              }

              tx.update(ref, {
                [item.size]: currentStock - (item.quantity || 1),
              });
            });
          }

          // 🔹 SAVE ORDER
          const now = Timestamp.now();
          const orderDocId = `order_${Date.now()}`;

          // Add selected_size to each cart item
          const cartItemsWithSelectedSize = cartItems.map(item => ({
            ...item,
            selected_size: item.size
          }));

          await setDoc(doc(db, "orders", orderDocId), {
            user_id: user.uid,
            razorpay_payment_id: response.razorpay_payment_id,
            order_id: data.order_id,
            signature: response.razorpay_signature,
            ...userDetails, // keep everything else
            delivery_address: userDetails.address || "", // explicitly store delivery address
            cart_items: cartItemsWithSelectedSize,
            total_amount: amount, // in paise
            created_at: now,
            order_timeline: ["ordered"],
          });

          setLoading(false);
          window.location.href = "/myorderspage";
        } catch (err) {
          setLoading(false);
          alert(err.message || "Some items are not available. Please adjust your cart.");
        }
      },
    };

    // 🔹 OPEN RAZORPAY
    const razor = new window.Razorpay(options);
    razor.open();
  } catch (err) {
    setLoading(false);
    alert("Something went wrong. Please try again later.");
  }
}
