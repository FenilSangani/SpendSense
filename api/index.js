const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load env variables
dotenv.config();

// Import routes from backend folder
const authRoutes = require("../backend/routes/authRoutes");
const transactionRoutes = require("../backend/routes/transactionRoutes");
const insightRoutes = require("../backend/routes/insightRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Database connection middleware for Serverless
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (mongoose.connections[0] && mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB Connected (Serverless)");
  } catch (err) {
    console.error("MongoDB Connection Error in Serverless:", err.message);
    throw err;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/insights", insightRoutes);

// Base Route
app.get("/api", (req, res) => {
  res.json({
    message: "SpendSense API is running on Vercel Serverless",
    version: "1.0.0",
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Serverless Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: err.message,
  });
});

module.exports = app;
