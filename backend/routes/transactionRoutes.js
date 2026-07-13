// ============================================================
// routes/transactionRoutes.js — Defines the transaction API routes
// ============================================================

// Import Express and create a router
const express = require("express");
const router = express.Router();

// Import the transaction controller functions
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

// Import the auth middleware — all transaction routes require login
const protect = require("../middleware/authMiddleware");

// IMPORTANT: The /summary route MUST come BEFORE the /:id route
// Otherwise, Express would treat "summary" as an ID parameter!

// GET /api/transactions/summary — Get spending summary and category breakdown
router.get("/summary", protect, getSummary);

// GET /api/transactions — Get all transactions (with optional filters)
router.get("/", protect, getTransactions);

// POST /api/transactions — Add a new transaction
router.post("/", protect, addTransaction);

// PUT /api/transactions/:id — Update a specific transaction
router.put("/:id", protect, updateTransaction);

// DELETE /api/transactions/:id — Delete a specific transaction
router.delete("/:id", protect, deleteTransaction);

// Export the router
module.exports = router;
