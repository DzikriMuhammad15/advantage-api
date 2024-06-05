const express = require("express");
const {
  registerUser,
  getUsers,
  loginUser,
} = require("../controllers/UserController");

const router = express.Router();

router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);
router.get("/users", getUsers);

module.exports = router;
