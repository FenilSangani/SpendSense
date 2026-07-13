// ============================================================
// routes/insightRoutes.js — Defines the AI insights API routes
// ============================================================

// Import Express and create a router
const express = require("express");
const router = express.Router();

// Import the insight controller function
const { generateInsights } = require("../controllers/insightController");

// Import the auth middleware — insights require login
const protect = require("../middleware/authMiddleware");

// POST /api/insights/generate — Generate AI-powered financial insights
// Protected route — user must be logged in
router.post("/generate", protect, generateInsights);

// Export the router
module.exports = router;
