const userRoute = require("./UserRoute");
const userPreferenceRoute = require("./UserPreferenceRoute");
const productRoute = require("./ProductRoute");
const orderRoute = require("./OrderRoute");
const advertisingContentRoute = require("./AdvertisingContentRoute");
const mlRoute = require("./mlRoute")

const router = require("express").Router();

router.use("/", userRoute);
router.use("/", userPreferenceRoute);
router.use("/", productRoute);
router.use("/", orderRoute);
router.use("/", advertisingContentRoute);
router.use("/", mlRoute);

module.exports = router;
