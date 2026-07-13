// ============================================================
// models/Transaction.js — Defines what a Transaction looks like in our database
// ============================================================

// Import mongoose to create the schema and model
const mongoose = require("mongoose");

// Define the structure (schema) of a Transaction document
const transactionSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this transaction
    // This links each transaction to a specific user
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Special ID type that references another document
      ref: "User", // This tells Mongoose it refers to the User model
      required: [true, "User ID is required"],
    },

    // Type of transaction — either "income" (money coming in) or "expense" (money going out)
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: ["income", "expense"], // Only these two values are allowed
    },

    // How much money was involved
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"], // No negative amounts
    },

    // Category like "Food", "Salary", "Transport", etc.
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    // Optional note/description about the transaction
    note: {
      type: String,
      trim: true,
      default: "", // If no note is provided, use empty string
    },

    // The date when this transaction happened
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now, // Default to current date if not provided
    },
  },
  {
    // This adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// Create the Transaction model from the schema and export it
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
