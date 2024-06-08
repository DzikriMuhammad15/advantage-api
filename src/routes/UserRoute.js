const express = require("express");
const {
  registerUser,
  getUsers,
  loginUser,
  updateUser,
  updatePassword,
  deleteUser,
  logoutUser,
  getDetailUser,
} = require("../controllers/UserController");
const {
  registerValidation,
  loginValidation,
  updateUserValidation,
} = require("../middlewares/validations/UserValidation");
const { authenticate } = require("../middlewares/Authorizaton");

const router = express.Router();

router.get("/users", authenticate, getUsers);
router.get("/users/:id", authenticate, getDetailUser);
router.post("/auth/login", loginValidation, loginUser);
router.post("/auth/register", registerValidation, registerUser);
router.post("/auth/logout", authenticate, logoutUser);
router.put("/users/:id", authenticate, updateUserValidation, updateUser);
router.patch("/users/password/:id", authenticate, updatePassword);
router.delete("/users/:id", authenticate, deleteUser);

module.exports = router;
