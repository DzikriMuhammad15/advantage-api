const express = require("express");
const {
  addOrder,
  updateStatusOrder,
  getOrders,
  getOrdersByUserId,
  getOrdersShowAdvertisementByUserId,
  createShowAdvertisement,
  cancelOrder,
} = require("../controllers/OrderController");
const { authenticate } = require("../middlewares/Authorizaton");
const {
  addOrderValidation,
} = require("../middlewares/validations/OrderValidation");

const router = express.Router();

router.post("/orders", authenticate, addOrderValidation, addOrder);
router.post(
  "/orders/show-advertisement",
  authenticate,
  createShowAdvertisement
);
router.patch("/orders/status", authenticate, updateStatusOrder);
router.get("/orders", authenticate, getOrders);
router.get("/orders/user/:userId", authenticate, getOrdersByUserId);
router.get(
  "/orders/show-advertisement/user/:userId",
  authenticate,
  getOrdersShowAdvertisementByUserId
);
router.delete("/orders/:orderId", authenticate, cancelOrder);

module.exports = router;
