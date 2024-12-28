const crypto = require("crypto");
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  // Generate signature for comparison
  const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully!" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid payment signature!" });
  }
};

module.exports = { verifyPayment };
