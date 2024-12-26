const express=require('express');
const { createUser, userlogIn } = require('../controller/user');

const userrouter=express.Router();

userrouter.post('/signup',createUser);
userrouter.post('/login',userlogIn);
console.log('user router')
module.exports=userrouter