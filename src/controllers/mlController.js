const express = require('express');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Load TensorFlow model
let model;
const loadModel = async () => {
    try {
        model = await tf.loadLayersModel('https://storage.googleapis.com/advantage-ml/models/model.json');
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model: " + error);
    }
};
loadModel();

// Load Scaler
const loadScaler = () => {
    const filePath = path.join(__dirname, 'scaler.json');
    const scaler = JSON.parse(fs.readFileSync(filePath));
    return scaler;
};

const scaler = loadScaler();

// Update DataFrame based on conditions
const updateBasedOnConditions = (Jenis, Tema, Produk) => {
    kolom = {
        'Billboard': [0], 'Spanduk': [0], 'Signage': [0], 'Baliho': [0],
        'FnB': [0], 'Fashion': [0], 'Edukasi': [0], 'Kesehatan': [0], 'Hiburan': [0],
        'Restoran': [0], 'Pakaian_Aksesoris': [0], 'Kursus_Sekolah': [0], 'Klinik_RumahSakit': [0], 'Hiburan_Travel': [0]
    }
    kolom[Jenis][0] = 1;
    kolom[Tema][0] = 1;
    kolom[Produk][0] = 1;
    return kolom;
};

// Normalize data using the scaler
const normalizeData = (data, scaler) => {
    const mean = tf.tensor1d(scaler.mean);
    const variance = tf.tensor1d(scaler.variance);
    const tensorData = tf.tensor2d([data], [1, data.length]);
    return tensorData.sub(mean).div(variance.sqrt());
};

// Predict cluster
const predictCluster = async (data) => {
    console.log("1");
    const normalizedData = normalizeData(Object.values(data).flat(), scaler);
    console.log("2");
    const predictions = model.predict(normalizedData);
    console.log("3");
    const result = predictions.argMax(-1).dataSync()[0];
    console.log("4");
    return result;
};

// Endpoint for predictions
const predict = async (req, res) => {
    const { Jenis, Tema, Produk } = req.body;
    if (!Jenis || !Tema || !Produk) {
        return res.status(400).json({ status: 'fail', message: 'Invalid input' });
    }

    try {
        const filter = updateBasedOnConditions(Jenis, Tema, Produk);
        // console.log(filter);
        const result = await predictCluster(filter);
        // console.log("2");

        // Here you should integrate the clustering part
        // Assuming `data` is already loaded and contains your clustered data
        const data = []; // replace with your actual data
        // console.log("3");
        const clust = data.filter(item => item.Cluster === result);
        // console.log("4");

        res.status(200).json({
            status: 'success',
            message: 'Prediction made successfully',
            data: clust.map(item => ({
                Jenis: item[Jenis],
                Tema: item[Tema],
                Produk: item[Produk],
                Cluster: item.Cluster
            })),
            hasilMl: result,
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Error making prediction', error: error.message });
    }
}
module.exports = { predict }