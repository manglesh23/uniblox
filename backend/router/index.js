const express=require('express');
const userrouter = require('./userRouter');
const productrouter = require('./productRouter');
const cartRouter = require('./cartRouter');

const router=express.Router();

router.use('/user',userrouter);
router.use('/product',productrouter);
router.use('/cart',cartRouter);

module.exports=router;