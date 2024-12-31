const Cart = require("../models/cart");
const Order = require("../models/order");
const Coupon = require("../models/coupon");

const orderPlace = async (req, res) => {
  const userId = req.user.id; // Logged-in user's ID
  const { couponCode } = req.body;

  try {
    // Fetch cart details
    const getCartProduct = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    if (!getCartProduct || getCartProduct.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Calculate subtotal
    let subtotal = 0;
    getCartProduct.items.forEach((item) => {
      subtotal += item.productId.price * item.quantity;
    });

    // Calculate discount
    let discount = 0;
    let appliedCoupon = null;
    let discountPercentage=0;
    if (couponCode) {
      // Validate the coupon code
      const validCoupon = await Coupon.findOne({
        code: couponCode,
        userId,
        isUsed: false,
      });

      console.log("Validating coupon code:", couponCode);

      if (!validCoupon) {
        console.error("Coupon validation failed. Code is invalid or expired.");
        return res
          .status(400)
          .json({ message: "Invalid or expired coupon code.", success: false });
      }

      discount = subtotal * (validCoupon.discount / 100);
      validCoupon.isUsed = true; // Mark coupon as used
      appliedCoupon = validCoupon.code;
      discountPercentage=validCoupon.discount
      await validCoupon.save();
    }

    const totalAmount = subtotal - discount;

     const product = getCartProduct.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      discountOnProduct: appliedCoupon?item.productId.price *(discountPercentage/100):0,
    }));

    // Create a new order
    const newOrder = new Order({
      userId,
      products: product,
      totalAmount,
      couponApplied: appliedCoupon ? discount : 0,
    });

    await newOrder.save();

    // Clear the cart
    await Cart.findOneAndDelete({ userId });

    // Generate a new coupon for every nth order
    const nthOrder = (await Order.countDocuments({ userId })) + 1; // nth order count
    if (nthOrder % 5 === 0) {
      const newCouponCode = `SAVE${nthOrder * 10}`; // Generate unique code
      const newCoupon = new Coupon({
        userId,
        code: newCouponCode,
        discount: 15, // e.g., 15% discount
        isUsed: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid for 7 days
      });
      await newCoupon.save();
    }

    res.status(200).json({
      message: "Order placed successfully.",
      orderDetails: newOrder,
      success: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const getOrderByuser = async (req, res) => {
  const userId = req.user.id;

  try {
    let getOrderHistory = await Order.find({ userId });
    console.log("Order History:-", getOrderHistory);

    if (getOrderHistory && getOrderHistory.length > 0) {
      let totalAmount = getOrderHistory.reduce(
        (amount, item) => amount + item.totalAmount,
        0
      );

      let totalDiscount = getOrderHistory.reduce(
        (amount, item) => amount + item.couponApplied,
        0
      );
      res.status(200).json({
        Total_Order: getOrderHistory.length,
        Total_Discount_Amount: totalDiscount,
        Total_Amount: totalAmount,
        OrderDetails: getOrderHistory,
      });
    } else {
      res.status(200).json({ Total_Order: 0, message: "No Order From You" });
    }
  } catch (e) {
    res.status(404).json({ msg: e.message });
  }
};

module.exports = { orderPlace, getOrderByuser };
