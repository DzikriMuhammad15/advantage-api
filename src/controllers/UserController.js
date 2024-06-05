// src/controllers/userController.js
const admin = require("firebase-admin");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const helper = require("../helpers/Helper");

const db = admin.firestore();
const usersCollection = db.collection("users");

const registerUser = async (req, res) => {
  try {
    const { username, email, fullname, phone, password, role } = req.body;

    const user = await usersCollection
      .where("username", "==", username)
      .where("email", "==", email)
      .get();
    if (!user.empty) {
      return res.status(400).json({
        status: false,
        message: "Username or Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(
      username,
      email,
      fullname,
      phone,
      hashedPassword,
      role
    );
    const docRef = await usersCollection.add({ ...newUser });

    res.status(200).json({
      status: true,
      message: "User added successfully",
      data: { id: docRef.id, ...newUser },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.where("email", "==", email).get();
    if (user.empty) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const userData = user.docs[0].data();
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Unauthorized",
      });
    }

    const tokenData = helper.generateToken({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });
    res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        id: userData.id,
        ...userData,
      },
      token: tokenData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while logging in",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  getUsers,
  loginUser,
};
