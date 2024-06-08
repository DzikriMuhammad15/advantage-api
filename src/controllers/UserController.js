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
      role,
      false
    );
    const docRef = await usersCollection.add({ ...newUser });

    return res.status(200).json({
      status: true,
      message: "User added successfully",
      data: {
        id: docRef.id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        phone: newUser.phone,
        role: newUser.role,
        isFillSurvey: newUser.isFillSurvey,
      },
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
    userData.id = user.docs[0].id;
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(400).json({
        status: false,
        message: "Your email or password is incorrect",
      });
    }

    const tokenData = helper.generateToken({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });

    const refreshTokenData = helper.generateRefreshToken({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      role: userData.role,
    });

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        fullname: userData.fullname,
        phone: userData.phone,
        isFillSurvey: userData.isFillSurvey,
      },
      token: tokenData,
      refreshToken: refreshTokenData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while logging in",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullname, phone } = req.body;
    const user = await usersCollection.doc(id).get();
    if (!user.exists) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const updatedUser = {
      username,
      email,
      fullname,
      phone,
    };

    const updatedResult = await usersCollection.doc(id).update(updatedUser);

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: {
        id: updatedResult.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullname: updatedUser.fullname,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the user",
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = await usersCollection.doc(id).get();
    if (!user.exists) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = {
      password: hashedPassword,
    };

    await usersCollection.doc(id).update(updatedUser);

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the password",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersCollection.doc(id).get();
    if (!user.exists) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    await usersCollection.doc(id).delete();
    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while deleting the user",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  getUsers,
  loginUser,
  updateUser,
  updatePassword,
  deleteUser,
};
