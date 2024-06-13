const express = require("express");
const upload = require("../middlewares/Upload");
const {
  addProduct,
  getProducts,
} = require("../controllers/ProductController");
const { authenticate } = require("../middlewares/Authorizaton");
const {
  addProductValidation,
} = require("../middlewares/validations/ProductValidation");

const router = express.Router();

router.get("/products", authenticate, getProducts);
router.post("/products", authenticate, upload.single("image"), addProduct);

module.exports = router;
