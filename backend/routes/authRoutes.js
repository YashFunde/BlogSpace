
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserProfile
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Authentication APIs
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected User Profile API
router.get("/profile", protect, getUserProfile);

module.exports = router;
