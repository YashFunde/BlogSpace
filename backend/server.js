// BlogSpace Backend - Main Server
const cors = require("cors");

require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

const PORT = 5000;

// Middleware to parse JSON data
app.use(cors());

app.use(express.json());
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("BlogSpace Backend Server is Running!");
});

// Test API route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "BlogSpace API is working successfully!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
