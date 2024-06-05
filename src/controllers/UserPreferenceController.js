const admin = require("firebase-admin");
const UserPreference = require("../models/UserPreferenceModel");

const db = admin.firestore();
const userPreferencesCollection = db.collection("user_preferences");

const createUserPreferences = async (req, res) => {
  try {
    const { userId, question1, question2, question3, question4 } = req.body;
    const newUserPreference = new UserPreference(
      userId,
      question1,
      question2,
      question3,
      question4
    );

    const docRef = await userPreferencesCollection.add({
      userId: newUserPreference.userId,
      question1: newUserPreference.question1,
      question2: newUserPreference.question2,
      question3: newUserPreference.question3,
      question4: newUserPreference.question4,
    });

    return res.status(200).json({
      status: true,
      message: "User preference added successfully",
      data: {
        id: docRef.id,
        userId: newUserPreference.userId,
        question1: newUserPreference.question1,
        question2: newUserPreference.question2,
        question3: newUserPreference.question3,
        question4: newUserPreference.question4,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the user preference",
      error: error.message,
    });
  }
};

const getUserPreferencesByIdUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userPreference = await userPreferencesCollection
      .where("userId", "==", id)
      .get();

    if (userPreference.empty) {
      return res.status(404).json({
        status: false,
        message: "User preference not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User preference retrieved successfully",
      data: userPreference.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        question1: doc.data().question1,
        question2: doc.data().question2,
        question3: doc.data().question3,
        question4: doc.data().question4,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the user preference",
      error: error.message,
    });
  }
};

module.exports = { createUserPreferences, getUserPreferencesByIdUser };
