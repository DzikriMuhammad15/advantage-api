const userRoute = require("./UserRoute");
const userPreferenceRoute = require("./UserPreferenceRoute");
const productRoute = require("./ProductRoute");

const router = require("express").Router();

router.use("/", userRoute);
router.use("/", userPreferenceRoute);
router.use("/product", productRoute);

module.exports = router;
