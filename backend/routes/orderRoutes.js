const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/order", createOrder);
router.get("/orders", getOrders);
router.delete("/order/:id", deleteOrder);

module.exports = router;