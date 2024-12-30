const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Percentage discount
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("Coupon", couponSchema);
