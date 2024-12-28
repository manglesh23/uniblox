const Cart = require("../models/cart");
const Order = require("../models/order");

const orderPlace = async (req, res) => {
  let userId = req.user.id;
  const { couponCode } = req.body;

  try {
    let getCartProduct = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    // console.log("Cart Product:-", getCartProduct);

    if (!getCartProduct || getCartProduct.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    let subtotal = 0;
    getCartProduct.items.forEach((item) => {
      subtotal += item.productId.price * item.quantity;
    });
    // console.log("Sub Total:-", subtotal);

    let discount = 0;

    const nthOrder = (await Order.countDocuments({ userId })) + 1;
    if (couponCode === "10PERCENT" && nthOrder % 2 === 0) {
      discount = subtotal * 0.1;
    }

    const totalAmount = subtotal - discount;
    // console.log("Totla Amount:-", totalAmount);
    let product = [];
    
      product = getCartProduct.items.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
        discountOnProduct:discount>0? item.productId.price * 0.1:0,
      }));
    
    console.log("Product Ordered:-", product);
    const newOrder = new Order({
      userId,
      products: [...product],
      totalAmount,
      couponApplied: discount,
    });

    await newOrder.save();
    // console.log("order placed");
    // Clear cart
    await Cart.findOneAndDelete({ userId });

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
