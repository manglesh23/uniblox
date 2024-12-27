const express=require('express');
const { createProduct, getProduct } = require('../controller/product');

const productrouter=express.Router();

productrouter.post('/createproduct',createProduct);
productrouter.get('/getproduct',getProduct);

module.exports=productrouter;

