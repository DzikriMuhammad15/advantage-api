const admin = require("firebase-admin");
const Order = require("../models/OrderModel");

const db = admin.firestore();
const ordersCollection = db.collection("orders");
const productsCollection = db.collection("products");

const addOrder = async (req, res) => {
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
    const order = new Order(
      userId,
      "",
      "",
      fullname,
      phone,
      email,
      paymentMethod,
      startBooked,
      endBooked,
      "pending",
      totalPayment
    );
    const docRef = await ordersCollection.add({ ...order });

    return res.status(200).json({
      status: true,
      message: "Order added successfully",
      data: {
        id: docRef.id,
        ...order,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while adding the order",
      error: error.message,
    });
  }
};

const updateStatusOrder = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const orderDoc = await ordersCollection.doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    await ordersCollection.doc(orderId).update({ status });

    return res.status(200).json({
      status: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while updating the order status",
      error: error.message,
    });
  }
};

module.exports = { addOrder, updateStatusOrder };
