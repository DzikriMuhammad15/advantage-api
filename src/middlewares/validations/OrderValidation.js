const Validator = require("validatorjs");
const admin = require("firebase-admin");

const db = admin.firestore();
const productsCollection = db.collection("products");
const usersCollection = db.collection("users");

const addOrderValidation = async (req, res, next) => {
  try {
    const {
      userId,
      fullname,
      phone,
      email,
      paymentMethod,
      startBooked,
      endBooked,

      totalPayment,
    } = req.body;
    const data = {
      userId,
      fullname,
      phone,
      email,
      paymentMethod,
      startBooked,
      endBooked,

      totalPayment,
    };

    const rules = {
      userId: "required|string",
      fullname: "required|string",
      phone: "required|string",
      email: "required|email",
      paymentMethod: "required|string",
      startBooked: "required|string",
      endBooked: "required|string",
      totalPayment: "required",
    };

    const validation = new Validator(data, rules);

    if (validation.fails()) {
      return res.status(400).json({
        status: false,
        message: validation.errors.all(),
      });
    }

    const userDoc = await usersCollection.doc(userId).get();
    if (!userDoc.exists) {
      return res.status(400).json({
        status: false,
        message: "User not found",
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

module.exports = { addOrderValidation };
