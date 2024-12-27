const express=require('express');
const { verifytoken } = require('../helper/verifyToken');
const { orderPlace, getOrderByuser } = require('../controller/order');
const orderrouter= express.Router();

orderrouter.post('/orderplace',verifytoken,orderPlace);
orderrouter.get('/getorder',verifytoken,getOrderByuser);
module.exports=orderrouter;

