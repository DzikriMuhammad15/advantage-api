const express = require("express");
const {
  addOrder,
  updateStatusOrder,
} = require("../controllers/OrderController");
const { authenticate } = require("../middlewares/Authorizaton");
const {
  addOrderValidation,
} = require("../middlewares/validations/OrderValidation");

const router = express.Router();

router.post("/orders", authenticate, addOrderValidation, addOrder);
router.patch("/orders/status", authenticate, updateStatusOrder);

module.exports = router;
