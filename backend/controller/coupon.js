const Coupon = require("../models/coupon");
const getCouponCode = async (req, res) => {
  try {
    let userId = req.user.id;
    let getUserCouponCode = await Coupon.find({ userId });
    console.log(getUserCouponCode);
    res.status(200).json({ message: getUserCouponCode });
  } catch (e) {
    res.status(400).json({ msg: "Internal Server Error", error: e });
  }
};

module.exports = { getCouponCode };
