const Validator = require("validatorjs");
const admin = require("firebase-admin");

const db = admin.firestore();
const userPreferenceCollection = db.collection("user_preferences");

const createUserPreferenceValidation = async (req, res, next) => {
  try {
    const { userId, question1, question2, question3, question4 } = req.body;
    const data = { userId, question1, question2, question3, question4 };
    const rules = {
      userId: "required|string",
      question1: "required|boolean",
      question2: "required|string",
      question3: "required|string",
      question4: "required|array",
      "question4.*": "string",
    };
    const validation = new Validator(data, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: validation.errors.all(),
      });
    }

    const userPreferenceQuery = await userPreferenceCollection
      .where("userId", "==", userId)
      .get();

    if (userPreferenceQuery.docs.length > 0) {
      return res.status(400).json({
        status: false,
        message: "User preference already exists",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error,
    });
  }
};

module.exports = { createUserPreferenceValidation };
