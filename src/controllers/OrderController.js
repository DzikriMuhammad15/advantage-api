const admin = require("firebase-admin");
const Order = require("../models/OrderModel");

const db = admin.firestore();
const ordersCollection = db.collection("orders");
const productsCollection = db.collection("products");
const advertisingContentsCollection = db.collection("advertising_contents");

const addOrder = async (req, res) => {
  try {
    const {
      userId,
      productId,
      imageProduct,
      productName,
      categoryProduct,
      locationProduct,
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
      productId,
      imageProduct,
      productName,
      categoryProduct,
      locationProduct,
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
    await productsCollection.doc(productId).update({ isBooked: true });

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

const getOrders = async (req, res) => {
  try {
    const orders = await ordersCollection.get();
    if (orders.empty) {
      return res.status(404).json({
        status: false,
        message: "No orders found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Orders retrieved successfully",
      data: orders.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the orders",
      error: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await ordersCollection.where("userId", "==", userId).get();

    if (orders.empty) {
      return res.status(404).json({
        status: false,
        message: "No orders found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Orders retrieved successfully",
      data: orders.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the orders",
      error: error.message,
    });
  }
};

const getOrdersShowAdvertisementByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await ordersCollection
      .where("userId", "==", userId)
      .where("status", "in", ["approve", "rejected", "active", "ended"])
      .get();
    if (orders.empty) {
      return res.status(404).json({
        status: false,
        message: "No show ads found",
      });
    }
    return res.status(200).json({
      status: true,
      message: "Show Ads retrieved successfully",
      data: orders.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving the show ads",
      error: error.message,
    });
  }
};

const createShowAdvertisement = async (req, res) => {
  try {
    const { orderId, advertisingContentId } = req.body;

    const orderDoc = await ordersCollection.doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    const advertisingContentDoc = await advertisingContentsCollection
      .doc(advertisingContentId)
      .get();

    if (!advertisingContentDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "Advertising content not found",
      });
    }

    await ordersCollection.doc(orderId).update({
      advertisingContentId,
      status: "active",
    });

    const updatedOrderDoc = await ordersCollection.doc(orderId).get();

    return res.status(200).json({
      status: true,
      message: "Show advertisement created successfully",
      data: {
        id: updatedOrderDoc.id,
        ...updatedOrderDoc.data(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while creating the show advertisement",
      error: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDoc = await ordersCollection.doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }
    await ordersCollection.doc(orderId).update({ status: "cancelled" });
    return res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "An error occurred while cancelling the order",
      error: error.message,
    });
  }
};

module.exports = {
  addOrder,
  updateStatusOrder,
  getOrders,
  getOrdersByUserId,
  getOrdersShowAdvertisementByUserId,
  createShowAdvertisement,
  cancelOrder,
};
