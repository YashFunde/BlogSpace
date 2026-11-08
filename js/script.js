
// BlogSpace - Frontend Functionality

// Get saved blogs from LocalStorage
function getBlogs() {
    return JSON.parse(localStorage.getItem("blogs")) || [];
}

// Save blogs to LocalStorage
function saveBlogs(blogs) {
    localStorage.setItem("blogs", JSON.stringify(blogs));
}

// Create Blog Functionality
const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("category").value;
        const image = document.getElementById("blogImage").value.trim();
        const content = document.getElementById("blogContent").value.trim();

        if (!title || !category || !content) {
            alert("Please fill in all required fields.");
            return;
        }

        const blogs = getBlogs();

        const newBlog = {
            id: Date.now(),
            title: title,
            category: category,
            image: image,
            content: content,
            status: "Published",
            views: 0,
            date: new Date().toLocaleDateString()
        };

        blogs.push(newBlog);
        saveBlogs(blogs);

        alert("Your blog has been published successfully!");

        blogForm.reset();

        window.location.href = "dashboard.html";
    });
}

// Dashboard Functionality
const dashboard = document.querySelector(".dashboard");

if (dashboard) {
    const blogs = getBlogs();

    const publishedBlogs = blogs.filter(
        blog => blog.status === "Published"
    );

    const draftBlogs = blogs.filter(
        blog => blog.status === "Draft"
    );

    const statNumbers = document.querySelectorAll(".stat-card h2");

    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = blogs.length;
        statNumbers[1].textContent = blogs.reduce(
            (total, blog) => total + (blog.views || 0), 0
        );
        statNumbers[2].textContent = draftBlogs.length;
    }

    const tableBody = document.querySelector("tbody");

    if (tableBody) {
        tableBody.replaceChildren();

        if (blogs.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.textContent = "No blogs yet. Create your first blog!";
            cell.style.textAlign = "center";

            row.appendChild(cell);
            tableBody.appendChild(row);
        } else {
            blogs.forEach(blog => {
                const row = document.createElement("tr");

                const titleCell = document.createElement("td");
                titleCell.textContent = blog.title;

                const categoryCell = document.createElement("td");
                categoryCell.textContent = blog.category;

                const statusCell = document.createElement("td");
                const status = document.createElement("span");
                status.className = "status published";
                status.textContent = blog.status;
                statusCell.appendChild(status);

                const viewsCell = document.createElement("td");
                viewsCell.textContent = blog.views || 0;

                
const actionCell = document.createElement("td");

// Edit Button
const editButton = document.createElement("button");
editButton.textContent = "Edit";
editButton.className = "edit-btn";

editButton.addEventListener("click", function () {
    const newTitle = prompt("Enter new blog title:", blog.title);

    if (newTitle === null) return;

    const newCategory = prompt(
        "Enter new category:",
        blog.category
    );

    if (newCategory === null) return;

    const newContent = prompt(
        "Enter new blog content:",
        blog.content
    );

    if (newContent === null) return;

    if (!newTitle.trim() || !newCategory.trim() || !newContent.trim()) {
        alert("Fields cannot be empty!");
        return;
    }

    const updatedBlogs = getBlogs().map(item => {
        if (item.id === blog.id) {
            return {
                ...item,
                title: newTitle.trim(),
                category: newCategory.trim(),
                content: newContent.trim()
            };
        }

        return item;
    });

    saveBlogs(updatedBlogs);
    alert("Blog updated successfully!");
    location.reload();
});

// Delete Button
const deleteButton = document.createElement("button");
deleteButton.textContent = "Delete";
deleteButton.className = "delete-btn";

deleteButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this blog?")) {
        const updatedBlogs = getBlogs().filter(
            item => item.id !== blog.id
        );

        saveBlogs(updatedBlogs);
        location.reload();
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
        }
    }
}

// Home Page - Display User Created Blogs
const blogContainer = document.querySelector(".blog-container");

if (blogContainer) {
    const blogs = getBlogs().filter(
        blog => blog.status === "Published"
    );

    blogs.forEach(blog => {
        const card = document.createElement("div");
        card.className = "blog-card";

        const img = document.createElement("img");

        const isValidImage = /^https?:\/\//i.test(blog.image || "");

        if (isValidImage) {
    img.src = blog.image;
} else {
    img.src = "https://placehold.co/600x400/eef2ff/4f46e5?text=BlogSpace";
}

        img.alt = blog.title;

        const content = document.createElement("div");
        content.className = "blog-content";

        const category = document.createElement("span");
        category.textContent = blog.category;

        const title = document.createElement("h3");
        title.textContent = blog.title;

        const description = document.createElement("p");
        description.textContent = blog.content.substring(0, 100) + "...";

        content.append(category, title, description);
        card.append(img, content);

        blogContainer.prepend(card);
    });
}
