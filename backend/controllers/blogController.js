// Temporary blog storage (MongoDB will replace this in Module 03)
const blogs = [];

// Create Blog
const createBlog = (req, res) => {
    try {
        const { title, content, category } = req.body;

        // Validate fields
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide title, content and category"
            });
        }

        // Create new blog
        const newBlog = {
            id: Date.now().toString(),
            title,
            content,
            category,
            author: req.user.id,
            createdAt: new Date()
        };

        blogs.push(newBlog);

        res.status(201).json({
            success: true,
            message: "Blog created successfully!",
            blog: newBlog
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while creating blog"
        });
    }
};

// Get All Blogs
const getAllBlogs = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs: blogs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching blogs"
        });
    }
};


 // Get Blogs Created by Logged-in User
const getMyBlogs = (req, res) => {
    try {
        const myBlogs = blogs.filter(
            blog => blog.author === req.user.id
        );

        res.status(200).json({
            success: true,
            count: myBlogs.length,
            blogs: myBlogs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching your blogs"
        });
    }
};

// Update Blog
const updateBlog = (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        const blog = blogs.find(blog => blog.id === id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Only the author can update the blog
        if (blog.author !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog"
            });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;

        res.status(200).json({
            success: true,
            message: "Blog updated successfully!",
            blog
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while updating blog"
        });
    }
};

// Delete Blog
const deleteBlog = (req, res) => {
    try {
        const { id } = req.params;

        const blogIndex = blogs.findIndex(
            blog => blog.id === id
        );

        if (blogIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Only the author can delete the blog
        if (blogs[blogIndex].author !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog"
            });
        }

        blogs.splice(blogIndex, 1);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while deleting blog"
        });
    }
};

module.exports = { createBlog, getAllBlogs, getMyBlogs, updateBlog, deleteBlog};