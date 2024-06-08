const Validator = require("validatorjs");
const admin = require("firebase-admin");

const db = admin.firestore();
const usersCollection = db.collection("users");

const registerValidation = async (req, res, next) => {
  try {
    const { username, email, fullname, phone, password, role } = req.body;
    const data = { username, email, fullname, phone, password, role };
    const rules = {
      username: "required|string|max:15",
      email: "required|email",
      fullname: "required|string|max:50",
      phone: "required|string",
      password: "required|string|min:6",
      role: "required|string",
    };
    const validation = new Validator(data, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: validation.errors.all(),
      });
    }

    const userEmailQuery = await usersCollection
      .where("email", "==", email)
      .get();

    if (userEmailQuery.docs.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Email already used",
      });
    }

    const userUsernameQuery = await usersCollection
      .where("username", "==", username)
      .get();

    if (userUsernameQuery.docs.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Username already used",
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

const loginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = { email, password };
    const rules = {
      email: "required|email",
      password: "required|string|min:6",
    };
    const validation = new Validator(data, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: validation.errors.all(),
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

const updateUserValidation = async (req, res, next) => {
  try {
    const { username, email, fullname, phone } = req.body;
    const data = { username, email, fullname, phone };
    const rules = {
      username: "required|string|max:15",
      email: "required|email",
      fullname: "required|string|max:50",
      phone: "required|string",
    };
    const validation = new Validator(data, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: validation.errors.all(),
      });
    }

    const userEmailQuery = await usersCollection
      .where("email", "==", email)
      .get();

    if (userEmailQuery.docs.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: "Email already used",
      });
    }

    const userUsernameQuery = await usersCollection
      .where("username", "==", username)
      .get();

    if (userUsernameQuery.docs.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Bad Request",
        errors: "Username already used",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error while processing your request",
      message: error,
    });
  }
};

module.exports = { registerValidation, loginValidation, updateUserValidation };
