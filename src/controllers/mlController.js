const express = require("express");
const bodyParser = require("body-parser");
const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const admin = require("firebase-admin");
const Product = require("../models/ProductModel");
const { v4: uuidv4 } = require("uuid");

const db = admin.firestore();
const productsCollection = db.collection("products");
const bucket = admin.storage().bucket();

const app = express();
app.use(bodyParser.json());

// Load TensorFlow model
let model;
const loadModel = async () => {
  try {
    model = await tf.loadLayersModel(
      "https://storage.googleapis.com/advantage-ml/models/model.json"
    );
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model: " + error);
  }
};
loadModel();

// Load Scaler
const loadScaler = () => {
  const filePath = path.join(__dirname, "scaler.json");
  try {
    const scaler = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log("Loaded scaler:", scaler);
    return scaler;
  } catch (error) {
    console.error("Error loading scaler: " + error);
    return null;
  }
};

const scaler = loadScaler();

// Update DataFrame based on conditions
const updateBasedOnConditions = (Jenis, Tema, Produk) => {
  let kolom = {
    Billboard: [0],
    Spanduk: [0],
    Signage: [0],
    Baliho: [0],
    FnB: [0],
    Fashion: [0],
    Edukasi: [0],
    Kesehatan: [0],
    Hiburan: [0],
    Restoran: [0],
    Pakaian_Aksesoris: [0],
    Kursus_Sekolah: [0],
    Klinik_RumahSakit: [0],
    Hiburan_Travel: [0],
  };
  kolom[Jenis][0] = 1;
  kolom[Tema][0] = 1;
  kolom[Produk][0] = 1;
  return kolom;
};

// Normalize data using the scaler
const normalizeData = (data, scaler) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Data for normalization is invalid");
  }
  if (!scaler || !Array.isArray(scaler.mean) || !Array.isArray(scaler.var)) {
    console.error("Scaler content:", scaler);
    throw new Error("Scaler is invalid");
  }

  const mean = tf.tensor1d(scaler.mean);
  const variance = tf.tensor1d(scaler.var);
  const tensorData = tf.tensor2d([data], [1, data.length]);

  console.log("Tensor data before normalization:", tensorData.toString());
  const normalizedData = tensorData.sub(mean).div(variance.sqrt());
  console.log("Normalized data:", normalizedData.toString());
  return normalizedData;
};

// Predict cluster
const predictCluster = async (data) => {
  console.log("Predict cluster data:", data);
  const flatData = Object.values(data).flat();
  console.log("Flat data:", flatData);

  if (flatData.includes(null) || flatData.includes(undefined)) {
    throw new Error("Flat data contains null or undefined values");
  }

  const normalizedData = normalizeData(flatData, scaler);
  console.log("Normalized data:", normalizedData.toString());
  const predictions = model.predict(normalizedData);
  predictions.print(); // Log the predictions
  const result = predictions.argMax(-1).dataSync()[0];
  console.log("Prediction result:", result);
  return result;
};

// Endpoint for predictions
const predict = async (req, res) => {
  const { Jenis, Tema, Produk } = req.body;
  if (!Jenis || !Tema || !Produk) {
    return res.status(400).json({ status: "fail", message: "Invalid input" });
  }

  try {
    console.log("Received input:", { Jenis, Tema, Produk });
    const filter = updateBasedOnConditions(Jenis, Tema, Produk);
    console.log("Updated conditions:", filter);
    const hasil = await predictCluster(filter);
    const result = hasil.toString();
    console.log("Cluster prediction result:", result);

    let results = [];
    const csvFilePath = path.join(__dirname, "data_final2.csv");

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        results = results.map((el) => {
          el.Latitude = parseFloat(el.Latitude);
          el.Longitude = parseFloat(el.Longitude);
          return el;
        });

        const clust = results.filter((item) => item.Cluster === result);

        let returnVal = [];
        const fetchProductsPromises = clust.map(async (el) => {
          console.log({ lat: el.Latitude, long: el.Longitude });
          try {
            const productsSnapshot = await productsCollection
              .where("isBooked", "==", false)
              .where("latitude", "==", el.Latitude)
              .where("longitude", "==", el.Longitude)
              .get();

            if (productsSnapshot.empty) {
              console.log("No matching documents.");
              return;
            }

            productsSnapshot.forEach((doc) => {
              console.log("masuk");
              returnVal.push({ id: doc.id, ...doc.data() });
              console.log(returnVal);
            });
          } catch (error) {
            console.error("Error getting documents: ", error);
          }
        });

        await Promise.all(fetchProductsPromises);

        res.status(200).json({
          status: "success",
          message: "Prediction made successfully",
          data: returnVal,
          hasilMl: result,
        });
      })
      .on("error", (error) => {
        res.status(500).send("Error reading the CSV file: " + error.message);
      });
  } catch (error) {
    console.error("Error during prediction:", error);
    res.status(500).json({
      status: "fail",
      message: "Error making prediction",
      error: error.message,
    });
  }
};
module.exports = { predict };
