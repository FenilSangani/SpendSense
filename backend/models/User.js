// ============================================================
// models/User.js — Defines what a User looks like in our database
// ============================================================

// Import mongoose to create the schema and model
const mongoose = require("mongoose");

// Import bcryptjs to hash passwords before saving
const bcrypt = require("bcryptjs");

// Define the structure (schema) of a User document
const userSchema = new mongoose.Schema(
  {
    // User's full name — required
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true, // Removes extra spaces from start/end
    },

    // User's email — required and must be unique (no two users can have the same email)
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true, // Convert email to lowercase automatically
      trim: true,
    },

    // User's password — required, minimum 6 characters
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    // This adds createdAt and updatedAt fields automatically
    timestamps: true,
  }
);

// ---- Pre-save Hook: Hash the password before saving to database ----
// This runs automatically BEFORE a user document is saved
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been changed (or is new)
  if (!this.isModified("password")) {
    return next(); // Skip hashing if password wasn't changed
  }

  // Generate a "salt" — random data added to the password before hashing
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);

  next(); // Continue saving the document
});

// ---- Method: Compare entered password with hashed password ----
// We use this during login to check if the password is correct
userSchema.methods.comparePassword = async function (enteredPassword) {
  // bcrypt.compare() returns true if passwords match, false otherwise
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema and export it
const User = mongoose.model("User", userSchema);
module.exports = User;
