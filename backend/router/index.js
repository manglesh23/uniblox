const express=require('express');
const userrouter = require('./userRouter');

const router=express.Router();

router.use('/user',userrouter);
console.log("Index")
module.exports=router;