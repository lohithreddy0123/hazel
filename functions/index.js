const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });

exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(400).json({ error: "Invalid request method" });
    }

    try {
      const { amount } = req.body;
      if (!amount) return res.status(400).json({ error: "Amount is required" });

      const razorpay = new Razorpay({
        key_id: functions.config().razorpay.key_id,
        key_secret: functions.config().razorpay.key_secret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        payment_capture: 1,
      });

      res.status(200).json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key: functions.config().razorpay.key_id,
      });
    } catch (err) {
      console.error("Razorpay order error:", err);
      res.status(500).json({ error: err.message });
    }
  });
});
