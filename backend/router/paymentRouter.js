const express = require("express");
const { payment } = require("../controller/payment");
const { verifyPayment } = require("../controller/verifyPayment");
const paymentRouter = express.Router();

paymentRouter.post("/payment", payment);
paymentRouter.post("/verifypayment", verifyPayment);

module.exports = paymentRouter;
