const express = require("express");
const { createUser, userlogIn, getUserById } = require("../controller/user");
const { verifytoken } = require("../helper/verifyToken");
const userrouter = express.Router();

userrouter.post("/signup", createUser);
userrouter.post("/login", userlogIn);
userrouter.get("/getuser", verifytoken, getUserById);
console.log("user router");
module.exports = userrouter;
