const express = require("express");
const router = express.Router();
const { getAllProducts, updateProduct, deleteProduct, addProduct, getProductById } = require("../controllers/ProductController")

// router
router.get("/", getAllProducts);
// router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/", addProduct);
router.get("/:id", getProductById);


module.exports = router