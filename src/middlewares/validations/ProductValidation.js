const Validator = require("validatorjs");
const admin = require("firebase-admin");

const db = admin.firestore();
const usersCollection = db.collection("products");

const addProductValidation = async (req, res, next) => {
  try {
    const {
      userId,
      name,
      description,
      price,
      locationDesc,
      longitude,
      latitude,
      type,
      theme,
      category,
      height,
      width,
      startBooked,
      endBooked,
    } = req.body;
    const data = {
      userId,
      name,
      description,
      price,
      locationDesc,
      longitude,
      latitude,
      type,
      theme,
      category,
      height,
      width,
      startBooked,
      endBooked,
    };
    const rules = {
      userId: "required|string",
      name: "required|string",
      description: "required|string",
      price: "required",
      locationDesc: "required|string",
      longitude: "required",
      latitude: "required",
      type: "required|string",
      theme: "required|string",
      category: "required|string",
      height: "required",
      width: "required",
      startBooked: "required|string",
      endBooked: "required|string",
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

module.exports = {
  addProductValidation,
};
