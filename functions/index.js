const { onRequest } = require("firebase-functions/v2/https");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });

exports.createRazorpayOrder = onRequest({ cors: true }, async (req, res) => {
  cors(req, res, async () => {
    try {
      const { amount } = req.body;
      if (!amount) return res.status(400).json({ error: "Amount required" });

      // ✅ Razorpay instance using keys from .env
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      // ✅ Create order in Razorpay
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // rupees → paise
        currency: "INR",
        payment_capture: 1,
      });

      // ✅ Return order details to frontend
      res.status(200).json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err) {
      console.error("Razorpay order error:", err);
      res.status(500).json({ error: err.message });
    }
  });
});
