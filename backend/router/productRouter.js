const express=require('express');
const { createProduct, getProduct, searchProduct } = require('../controller/product');

const productrouter=express.Router();

productrouter.post('/createproduct',createProduct);
productrouter.get('/getproduct',getProduct);
productrouter.get('/searchproduct',searchProduct);

module.exports=productrouter;

