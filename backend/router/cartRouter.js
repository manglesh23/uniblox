const express= require('express');
const { verifytoken } = require('../helper/verifyToken');
const { addToCart, getCartProduct } = require('../controller/cart');
const cartRouter= express.Router();

cartRouter.post('/addtocart', verifytoken, addToCart);
cartRouter.get('/getcartproduct', verifytoken, getCartProduct);

module.exports=cartRouter;