const express=require('express');
const userrouter = require('./userRouter');
const productrouter = require('./productRouter');
const cartRouter = require('./cartRouter');
const orderrouter = require('./orderRouter');

const router=express.Router();

router.use('/user',userrouter);
router.use('/product',productrouter);
router.use('/cart',cartRouter);
router.use('/order',orderrouter);

module.exports=router;