const express = require("express");
const upload = require("../middlewares/Upload");
const {
  addAdvertisingContent,
  getAdvertisingContents,
} = require("../controllers/AdvertisingContentController");

const router = express.Router();

router.get("/advertising-content", getAdvertisingContents);
router.post(
  "/advertising-content",
  upload.single("image"),
  addAdvertisingContent
);

module.exports = router;
