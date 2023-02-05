const express = require("express");
const router = express.Router()
const {createCustomer} = require("../controllers/customer");
const  {createOrder } = require("../controllers/order");



router.post("/register", createCustomer),

router.post("/order", createOrder)


module.exports =router