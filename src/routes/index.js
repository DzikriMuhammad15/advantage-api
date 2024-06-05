const userRoute = require("./UserRoute");
const userPreferenceRoute = require("./UserPreferenceRoute");

const router = require("express").Router();

router.use("/", userRoute);
router.use("/", userPreferenceRoute);

module.exports = router;
