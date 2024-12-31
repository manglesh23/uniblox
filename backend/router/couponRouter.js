const express=require('express');
const { getCouponCode } = require('../controller/coupon');
const { verifytoken } = require('../helper/verifyToken');
const couponRouter=express.Router();

couponRouter.get('/getcoupon',verifytoken,getCouponCode);

module.exports=couponRouter