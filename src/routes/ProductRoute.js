const express = require("express");
const upload = require("../middlewares/Upload");
const {
  addProduct,
  getProducts,
  getProductsByUserPreferences,
} = require("../controllers/ProductController");
const { predict } = require("../controllers/mlController");
const { authenticate } = require("../middlewares/Authorizaton");
const {
  addProductValidation,
} = require("../middlewares/validations/ProductValidation");

const router = express.Router();

router.get("/products", authenticate, getProducts);
router.get(
  "/products/user-preferences",
  authenticate,
  getProductsByUserPreferences
);
router.get("/products/user-predict", authenticate, predict);
router.post("/products", authenticate, upload.single("image"), addProduct);

module.exports = router;
