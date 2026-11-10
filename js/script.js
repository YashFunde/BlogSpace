
// ==========================================
// BLOGSPACE - FRONTEND FUNCTIONALITY
// ==========================================


// ==========================================
// LOGOUT FUNCTIONALITY
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        alert("You have been logged out successfully!");
        window.location.href = "login.html";
    });
}


// ==========================================
// HOMEPAGE NAVBAR BASED ON LOGIN STATUS
// ==========================================

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");

if (loginLink && registerLink) {
    const token = localStorage.getItem("token");

    if (token) {
        loginLink.textContent = "Dashboard";
        loginLink.href = "dashboard.html";

        registerLink.textContent = "Logout";
        registerLink.href = "#";
        registerLink.id = "logoutBtn";

        registerLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            alert("You have been logged out successfully!");
            window.location.reload();
        });
    }
}


// ==========================================
// PROTECT CREATE BLOG PAGE
// ==========================================

if (window.location.pathname.endsWith("/create-blog.html")) {
    if (!localStorage.getItem("token")) {
        alert("Please login first!");
        window.location.href = "login.html";
    }
}


// ==========================================
// CREATE BLOG FUNCTIONALITY
// ==========================================

const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("category").value;
        const image = document.getElementById("blogImage").value.trim();
        const content = document.getElementById("blogContent").value.trim();

        if (!title || !category || !content) {
            alert("Please fill in all required fields.");
            return;
        }

        if (image) {
            try {
                const imageURL = new URL(image);

                if (!["http:", "https:"].includes(imageURL.protocol)) {
                    throw new Error();
                }
            } catch {
                alert("Please enter a valid image URL.");
                return;
            }
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    category,
                    content,
                    image
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create blog");
            }

            alert("Your blog has been published successfully!");
            blogForm.reset();
            window.location.href = "dashboard.html";

        } catch (error) {
            alert(error.message);
        }
    });
}


// ==========================================
// LOGIN FUNCTIONALITY
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);

            alert("Login successful!");
            window.location.href = "dashboard.html";

        } catch (error) {
            alert(error.message);
        }
    });
}


// ==========================================
// REGISTER FUNCTIONALITY
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            alert("Account created successfully! Please login.");
            registerForm.reset();
            window.location.href = "login.html";

        } catch (error) {
            alert(error.message);
        }
    });
}


// ==========================================
// DASHBOARD FUNCTIONALITY
// ==========================================

const dashboard = document.querySelector(".dashboard");

if (dashboard) {

    // DISPLAY LOGGED-IN USER NAME

    const welcomeMessage = document.getElementById("welcomeMessage");
    const userName = localStorage.getItem("userName");

    if (welcomeMessage && userName) {
        welcomeMessage.replaceChildren(
            document.createTextNode("Welcome back, "),
            Object.assign(document.createElement("span"), {
                className: "highlight-name",
                textContent: userName
            }),
            document.createTextNode("! Manage your blog posts here.")
        );
    }

    async function loadDashboard() {

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(`${API_URL}/blogs/my-blogs`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load blogs");
            }

            const blogs = data.blogs || [];
            const statNumbers = document.querySelectorAll(".stat-card h2");

            if (statNumbers.length >= 3) {
                statNumbers[0].textContent = blogs.length;
                statNumbers[1].textContent = 0;
                statNumbers[2].textContent = 0;
            }

            const tableBody = document.querySelector("tbody");

            if (!tableBody) return;

            tableBody.replaceChildren();

            if (blogs.length === 0) {
                const row = document.createElement("tr");
                const cell = document.createElement("td");

                cell.colSpan = 5;
                cell.textContent = "No blogs yet. Create your first blog!";
                cell.style.textAlign = "center";

                row.appendChild(cell);
                tableBody.appendChild(row);
                return;
            }

            blogs.forEach(blog => {

                const blogId = blog._id || blog.id;
                const row = document.createElement("tr");

                const titleCell = document.createElement("td");
                titleCell.textContent = blog.title;

                const categoryCell = document.createElement("td");
                categoryCell.textContent = blog.category;

                const statusCell = document.createElement("td");
                const status = document.createElement("span");

                status.className = "status published";
                status.textContent = "Published";
                statusCell.appendChild(status);

                const viewsCell = document.createElement("td");
                viewsCell.textContent = "0";

                const actionCell = document.createElement("td");

                // EDIT BLOG

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "edit-btn";

                editButton.addEventListener("click", async function () {

                    const newTitle = prompt("Enter new blog title:", blog.title);
                    if (newTitle === null) return;

                    const newCategory = prompt("Enter new category:", blog.category);
                    if (newCategory === null) return;

                    const newContent = prompt("Enter new blog content:", blog.content);
                    if (newContent === null) return;

                    const newImage = prompt(
                        "Enter new image URL (leave empty to remove image):",
                        blog.image || ""
                    );

                    if (newImage === null) return;

                    if (!newTitle.trim() || !newCategory.trim() || !newContent.trim()) {
                        alert("Title, category and content cannot be empty!");
                        return;
                    }

                    if (newImage.trim()) {
                        try {
                            const imageURL = new URL(newImage.trim());

                            if (!["http:", "https:"].includes(imageURL.protocol)) {
                                throw new Error();
                            }
                        } catch {
                            alert("Please enter a valid image URL.");
                            return;
                        }
                    }

                    try {
                        const updateResponse = await fetch(`${API_URL}/blogs/${blogId}`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                title: newTitle.trim(),
                                category: newCategory.trim(),
                                content: newContent.trim(),
                                image: newImage.trim()
                            })
                        });

                        const updateData = await updateResponse.json();

                        if (!updateResponse.ok) {
                            throw new Error(updateData.message || "Failed to update blog");
                        }

                        alert("Blog updated successfully!");
                        loadDashboard();

                    } catch (error) {
                        alert(error.message);
                    }
                });


                // DELETE BLOG

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "delete-btn";

                deleteButton.addEventListener("click", async function () {

                    if (!confirm("Are you sure you want to delete this blog?")) {
                        return;
                    }

                    try {
                        const deleteResponse = await fetch(`${API_URL}/blogs/${blogId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        const deleteData = await deleteResponse.json();

                        if (!deleteResponse.ok) {
                            throw new Error(deleteData.message || "Failed to delete blog");
                        }

                        alert("Blog deleted successfully!");
                        loadDashboard();

                    } catch (error) {
                        alert(error.message);
                    }
                });

                actionCell.append(editButton, deleteButton);

                row.append(
                    titleCell,
                    categoryCell,
                    statusCell,
                    viewsCell,
                    actionCell
                );

                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error("Dashboard Error:", error);
            alert(error.message);
        }
    }

    loadDashboard();
}


// ==========================================
// HOMEPAGE - SEARCH AND CATEGORY FILTER
// ==========================================

const blogContainer = document.querySelector(".blog-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

if (blogContainer) {

    let allBlogs = [];

    // DISPLAY BLOG CARDS

    function displayBlogs(blogs) {

        blogContainer.replaceChildren();

        if (blogs.length === 0) {
            blogContainer.textContent =
                allBlogs.length === 0
                    ? "No blogs available yet. Be the first to create one!"
                    : "No blogs match your search or selected category.";

            return;
        }

        blogs.forEach(blog => {

            const card = document.createElement("div");
            card.className = "blog-card";

            // BLOG IMAGE

            const img = document.createElement("img");
            const imageURL = blog.image ? blog.image.trim() : "";

            img.src = imageURL ||
                "https://placehold.co/600x400/eef2ff/4f46e5?text=BlogSpace";

            img.alt = blog.title || "Blog image";

            img.onerror = function () {
                this.onerror = null;
                this.src = "https://placehold.co/600x400/eef2ff/4f46e5?text=Image+Not+Found";
            };

            // BLOG CONTENT

            const content = document.createElement("div");
            content.className = "blog-content";

            const category = document.createElement("span");
            category.textContent = blog.category || "General";

            const title = document.createElement("h3");
            title.textContent = blog.title;

            const description = document.createElement("p");
            const blogText = blog.content || "";

            description.textContent =
                blogText.length > 100
                    ? blogText.substring(0, 100) + "..."
                    : blogText;

            content.append(category, title, description);
            card.append(img, content);

            // OPEN BLOG DETAILS PAGE

            card.style.cursor = "pointer";

            card.addEventListener("click", function () {
                window.location.href =
                    `blog-details.html?id=${encodeURIComponent(blog._id || blog.id)}`;
            });

            blogContainer.appendChild(card);
        });
    }


    // SEARCH AND FILTER BLOGS

    function filterBlogs() {

        const searchText = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        const selectedCategory = categoryFilter
            ? categoryFilter.value.toLowerCase()
            : "";

        const filteredBlogs = allBlogs.filter(blog => {

            const title = (blog.title || "").toLowerCase();
            const content = (blog.content || "").toLowerCase();
            const category = (blog.category || "").toLowerCase();

            const matchesSearch =
                title.includes(searchText) ||
                content.includes(searchText);

            const matchesCategory =
                !selectedCategory || category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        displayBlogs(filteredBlogs);
    }


    // LOAD BLOGS FROM MONGODB

    async function loadHomeBlogs() {

        try {
            const response = await fetch(`${API_URL}/blogs`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load blogs");
            }

            allBlogs = data.blogs || [];

            // POPULATE CATEGORY DROPDOWN

            if (categoryFilter) {

                const categories = [
                    ...new Set(
                        allBlogs
                            .map(blog => (blog.category || "").trim())
                            .filter(Boolean)
                    )
                ];

                categories.sort((a, b) => a.localeCompare(b));

                categories.forEach(category => {

                    const option = document.createElement("option");

                    option.value = category;
                    option.textContent = category;

                    categoryFilter.appendChild(option);
                });
            }

            displayBlogs(allBlogs);

        } catch (error) {
            console.error("Homepage Error:", error);

            blogContainer.textContent =
                "Unable to load blogs. Please try again later.";
        }
    }


    // SEARCH EVENT

    if (searchInput) {
        searchInput.addEventListener("input", filterBlogs);
    }

    // CATEGORY FILTER EVENT

    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterBlogs);
    }

    loadHomeBlogs();
}


// ==========================================
// INDIVIDUAL BLOG DETAILS PAGE
// ==========================================

const blogDetailsContainer = document.getElementById("blogDetails");

if (blogDetailsContainer) {

    async function loadBlogDetails() {

        try {
            const params = new URLSearchParams(window.location.search);
            const blogId = params.get("id");

            if (!blogId) {
                throw new Error("Blog ID not found.");
            }

            const response = await fetch(
                `${API_URL}/blogs/${encodeURIComponent(blogId)}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load blog.");
            }

            const blog = data.blog;

            if (!blog) {
                throw new Error("Blog not found.");
            }

            blogDetailsContainer.replaceChildren();

            const category = document.createElement("span");
            category.className = "details-category";
            category.textContent = blog.category;

            const title = document.createElement("h1");
            title.className = "details-title";
            title.textContent = blog.title;

            const author = document.createElement("p");
            author.className = "details-author";

            const authorName = blog.author?.name || "BlogSpace Author";
            author.textContent = `By ${authorName}`;

            const image = document.createElement("img");
            image.className = "details-image";
            image.alt = blog.title;

            image.src = blog.image ||
                "https://placehold.co/900x450/eef2ff/4f46e5?text=BlogSpace";

            image.onerror = function () {
                this.onerror = null;
                this.src = "https://placehold.co/900x450/eef2ff/4f46e5?text=Image+Not+Found";
            };

            const content = document.createElement("div");
            content.className = "details-content";
            content.textContent = blog.content;

            blogDetailsContainer.append(
                category,
                title,
                author,
                image,
                content
            );

        } catch (error) {
            console.error("Blog Details Error:", error);
            blogDetailsContainer.textContent = error.message;
        }
    }

    loadBlogDetails();
}
