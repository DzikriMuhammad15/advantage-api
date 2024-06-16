const express = require("express");
const upload = require("../middlewares/Upload");
const {
  addAdvertisingContent,
  getAdvertisingContents,
  getAdvertisingContentsByUserId
} = require("../controllers/AdvertisingContentController");

const router = express.Router();

router.get("/advertising-content", getAdvertisingContents);
router.get(
  "/advertising-content/user/:userId",
  getAdvertisingContentsByUserId
)
router.post(
  "/advertising-content",
  upload.single("image"),
  addAdvertisingContent
);

module.exports = router;
