const express = require("express");
const upload = require("../middlewares/Upload");
const {
  addAdvertisingContent,
} = require("../controllers/AdvertisingContentController");

const router = express.Router();

router.post(
  "/advertising-content",
  upload.single("image"),
  addAdvertisingContent
);

module.exports = router;
