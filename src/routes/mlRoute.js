const express = require("express");
const upload = require("../middlewares/Upload");
const { predict } = require("../controllers/mlController")

const router = express.Router();

router.post("/predict",)