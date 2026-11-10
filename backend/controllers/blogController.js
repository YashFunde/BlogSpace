const Blog = require("../models/Blog");
const mongoose = require("mongoose");

// Create Blog
const createBlog = async (req, res) => {
    try {
        const { title, content, category, image } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, content and category"
            });
        }

        const newBlog = await Blog.create({
            title,
            content,
            category,
            image: image || "",
            author: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully!",
            blog: newBlog
        });

    } catch (error) {
        console.error("Create Blog Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating blog"
        });
    }
};


// Get All Blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });

    } catch (error) {
        console.error("Get Blogs Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching blogs"
        });
    }
};


// Get Single Blog by ID
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findById(id)
            .populate("author", "name email");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        console.error("Get Single Blog Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching blog"
        });
    }
};


// Get Blogs Created by Logged-in User
const getMyBlogs = async (req, res) => {
    try {
        const myBlogs = await Blog.find({
            author: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: myBlogs.length,
            blogs: myBlogs
        });

    } catch (error) {
        console.error("Get My Blogs Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching your blogs"
        });
    }
};


// Update Blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, image } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Only the author can update the blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            });
        }

        blog.title = title ?? blog.title;
        blog.content = content ?? blog.content;
        blog.category = category ?? blog.category;

        // NEW: Update image URL
        blog.image = image ?? blog.image;

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully!",
            blog
        });

    } catch (error) {
        console.error("Update Blog Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while updating blog"
        });
    }
};


// Delete Blog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Only the author can delete the blog
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully!"
        });

    } catch (error) {
        console.error("Delete Blog Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting blog"
        });
    }
};


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    getMyBlogs,
    updateBlog,
    deleteBlog
};