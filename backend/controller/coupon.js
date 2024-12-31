const Coupon= require('../models/coupon');
const getCouponCode=async(req,res)=>{
    let userId=req.user.id;
    let getUserCouponCode= await Coupon.find({userId});
    console.log(getUserCouponCode);
    res.status(200).json({msg:getUserCouponCode})
}

module.exports={getCouponCode};