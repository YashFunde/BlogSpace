const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

router.get("/", getAllBlogs);
router.get("/my-blogs", protect, getMyBlogs);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;