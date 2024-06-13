const admin = require("firebase-admin");
const AdvertisingContent = require("../models/AdvertisingContentModel");
const { v4: uuidv4 } = require("uuid");

const db = admin.firestore();
const usersCollection = db.collection("users");
const advertisingContentsCollection = db.collection("advertising_contents");
const bucket = admin.storage().bucket();

const addAdvertisingContent = async (req, res) => {
  try {
    const { userId, name, category } = req.body;

    const userDoc = await usersCollection.doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded",
      });
    }

    const blob = bucket.file(
      `advertising-content-images/${uuidv4()}_${file.originalname}`
    );

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      return res.status(500).json({
        status: false,
        message: "Something went wrong while uploading the image",
        error: error.message,
      });
    });

    blobStream.on("finish", async () => {
      await blob.makePublic();
      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const newAdvertisingContent = new AdvertisingContent(
        userId,
        name,
        category,
        imageUrl,
        "pending"
      );
      const docRef = await advertisingContentsCollection.add({
        ...newAdvertisingContent,
      });
      return res.status(200).json({
        status: true,
        message: "Advertising content added successfully",
        data: {
          id: docRef.id,
          ...newAdvertisingContent,
        },
      });
    });
    blobStream.end(file.buffer);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the advertising content",
      error: error.message,
    });
  }
};

const getAdvertisingContents = async (req, res) => {
  try {
    const advertisingContents = await advertisingContentsCollection.get();
    if (advertisingContents.empty) {
      return res.status(404).json({
        status: false,
        message: "No advertising contents found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Advertising contents retrieved successfully",
      data: advertisingContents.docs.map((doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the advertising contents",
      error: error.message,
    });
  }
};

module.exports = {
  addAdvertisingContent,
  getAdvertisingContents
};
