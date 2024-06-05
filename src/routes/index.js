const userRoute = require("./UserRoute");

const router = require("express").Router();

router.use("/", userRoute);

module.exports = router;
