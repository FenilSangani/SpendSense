// ============================================================
// routes/authRoutes.js — Defines the authentication API routes
// ============================================================

// Import Express and create a router
const express = require("express");
const router = express.Router();

// Import the auth controller functions
const { register, login, getMe } = require("../controllers/authController");

// Import the auth middleware (to protect certain routes)
const protect = require("../middleware/authMiddleware");

// POST /api/auth/register — Create a new user account
// No middleware needed — anyone can register
router.post("/register", register);

// POST /api/auth/login — Log in and get a JWT token
// No middleware needed — anyone can try to log in
router.post("/login", login);

// GET /api/auth/me — Get the logged-in user's profile
// Uses "protect" middleware — user must be logged in (have a valid token)
router.get("/me", protect, getMe);

// Export the router
module.exports = router;
