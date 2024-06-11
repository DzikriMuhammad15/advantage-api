const admin = require("firebase-admin");
const AdvertiseProduct = require("../models/AdvertiseProudctModel");

const db = admin.firestore();
const productsCollection = db.collection("products");

const getAllProducts = async (req, res) => {
    try {
        const products = await productsCollection.get();
        const returnObject = [];
        products.forEach((doc) => {
            let dataDoc = doc.data();
            let idDoc = doc.id;
            returnObject.push({ id: idDoc, ...dataDoc });
        })
        return res.status(400).json({
            status: true,
            message: "data fetched successfully",
            data: returnObject
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred while fetching product",
            error: error.message,
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        // ambil dulu params dari requestnya
        const id = req.params.id;
        // cari docrefnya
        const docRef = productsCollection.doc(id);
        // jika hasilnya kosong, kembalikan 404
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({
                status: false,
                message: "not found"
            })
        }
        else {
            // jika hasilnya ada, hapus doc tersebut
            await docRef.delete();
            return res.status(200).json({
                status: true,
                message: "product deleted successfully"
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred while deleting product",
            error: error.message,
        });
    }
}

const addProduct = async (req, res) => {
    try {

        const { name, description, locationDesc, longitude, latitude, imageUrl, type, theme, category, height, width, price, rating, isBooked, startBooked, endBooked } = req.body;
        const newProduct = new AdvertiseProduct(name, description, locationDesc, longitude, latitude, imageUrl, type, theme, category, height, width, price, rating, isBooked, startBooked, endBooked);
        const docRef = await productsCollection.add({ ...newProduct });
        return res.status(200).json({
            status: true,
            message: "Product added successfully",
            data: {
                name: docRef.name,
                description: docRef.description,
                locationDesc: docRef.locationDesc,
                longitude: docRef.longitude,
                latitude: docRef.latitude,
                imageUrl: docRef.imageUrl,
                type: docRef.type,
                theme: docRef.theme,
                category: docRef.category,
                height: docRef.height,
                width: docRef.width,
                price: docRef.price,
                rating: docRef.rating,
                isBooked: docRef.isBooked,
                startBooked: docRef.startBooked,
                endBooked: docRef.endBooked
            },
        });

    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred while adding product",
            error: error.message,
        });
    }
}

const getProductById = async (req, res) => {
    try {
        // ambil dulu params dari requestnya
        const id = req.params.id;
        // cari docrefnya
        const docRef = productsCollection.doc(id);
        // jika hasilnya kosong, kembalikan 404
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({
                status: false,
                message: "not found"
            })
        }
        else {
            // jika hasilnya ada, hapus doc tersebut
            return res.status(200).json({
                status: true,
                message: "data fetched successfully",
                data: doc.data()
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: "An error occurred while fetching product",
            error: error.message,
        });
    }
}

module.exports = { getAllProducts, deleteProduct, addProduct, getProductById }