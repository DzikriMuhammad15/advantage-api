const express = require("express");
const {
  registerUser,
  getUsers,
  loginUser,
  updateUser,
  updatePassword,
  deleteUser,
} = require("../controllers/UserController");
const { authenticate } = require("../middlewares/Authorizaton");

const router = express.Router();

router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);
router.put("/users/:id", authenticate, updateUser);
router.patch("/users/password/:id", authenticate, updatePassword);
router.get("/users", authenticate, getUsers);
router.delete("/users/:id", authenticate, deleteUser);

module.exports = router;
