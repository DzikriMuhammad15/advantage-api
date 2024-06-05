const express = require("express");
const {
  createUserPreferences,
  getUserPreferencesByIdUser,
} = require("../controllers/UserPreferenceController");
const {
  createUserPreferenceValidation,
} = require("../middlewares/validations/UserPreferenceValidation");
const { authenticate } = require("../middlewares/Authorizaton");

const router = express.Router();

router.post(
  "/user-preferences",
  authenticate,
  createUserPreferenceValidation,
  createUserPreferences
);

router.get(
  "/user/user-preferences/:id",
  authenticate,
  getUserPreferencesByIdUser
);

module.exports = router;
