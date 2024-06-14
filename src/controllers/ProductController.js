const admin = require("firebase-admin");
const Product = require("../models/ProductModel");
const { v4: uuidv4 } = require("uuid");

const db = admin.firestore();
const productsCollection = db.collection("products");
const bucket = admin.storage().bucket();

const addProduct = async (req, res) => {
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
    } = req.body;

    const parsedPrice = parseFloat(price);
    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);
    const parsedHeight = parseFloat(height);
    const parsedWidth = parseFloat(width);

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded",
      });
    }

    const blob = bucket.file(`product-images/${uuidv4()}_${file.originalname}`);
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
      const newProduct = new Product(
        userId,
        name,
        description,
        parsedPrice,
        locationDesc,
        parsedLongitude,
        parsedLatitude,
        imageUrl,
        type,
        theme,
        category,
        parsedHeight,
        parsedWidth,
        0,
        false,
        "",
        ""
      );

      const docRef = await productsCollection.add({
        ...newProduct,
      });

      return res.status(201).json({
        status: true,
        message: "Product added successfully",
        data: {
          id: docRef.id,
          ...newProduct,
        },
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the product",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productsCollection
      .where("isBooked", "==", false)
      .get();
    if (products.empty) {
      return res.status(404).json({
        status: false,
        message: "No products found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Products retrieved successfully",
      data: products.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the products",
      error: error.message,
    });
  }
};

const getProductsByUserPreferences = async (req, res) => {
  const { question1, question2, question3, question4 } = req.body;
  console.log(question1, question2, question3, question4);

  try {
    const products = await productsCollection
      .where("isBooked", "==", false)
      .get();
    if (products.empty) {
      return res.status(404).json({
        status: false,
        message: "No products found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Products retrieved successfully",
      data: products.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the products",
      error: error.message,
    });
  }
};

module.exports = { addProduct, getProducts, getProductsByUserPreferences };
