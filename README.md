# BlogSpace – Full Stack Blog Application

A responsive full-stack Blog Application developed as part of my **Full Stack Web Development Virtual Internship at Codomax Digital Solutions**.

BlogSpace allows users to register, log in, create blog posts, manage their own blogs and explore posts published by the community.

## Features

### Frontend
- Responsive homepage
- User registration and login
- Dynamic homepage blog display
- User dashboard
- Create new blog posts
- Edit and delete blog posts
- User-specific blog management
- JWT-based login session handling
- Protected dashboard and create-blog pages

### Backend
- RESTful API development using Express.js
- User registration and login APIs
- Password hashing using bcryptjs
- JWT authentication
- Authentication middleware
- Blog CRUD operations
- User-specific blog retrieval
- Environment variable configuration

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| bcryptjs | Password hashing |
| JSON Web Token | Authentication |
| dotenv | Environment variables |
| CORS | Frontend-backend communication |
| Git & GitHub | Version control |

## Project Structure

```text
BlogSpace/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── config.js
│   └── script.js
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YashFunde/BlogSpace.git
```

### 2. Open the project

Open the project folder in VS Code.

### 3. Install backend dependencies

Open the terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder:

```env
JWT_SECRET=your_own_secret_key
```

Use your own secure secret value. Do not upload the `.env` file to GitHub.

### 5. Start the backend server

```bash
npm run dev
```

The backend server will run at:

`http://localhost:5000`

### 6. Run the frontend

Install the Live Server extension in VS Code and open `index.html` using Live Server.

## API Endpoints

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

### Blog APIs

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/blogs` | Get all blogs | No |
| GET | `/api/blogs/my-blogs` | Get logged-in user's blogs | Yes |
| POST | `/api/blogs` | Create a blog | Yes |
| PUT | `/api/blogs/:id` | Update a blog | Yes |
| DELETE | `/api/blogs/:id` | Delete a blog | Yes |

Protected endpoints require a JWT Bearer token in the Authorization header.

## Current Development Status

- Module 01: Frontend Development
- Module 02: Backend Development and Frontend Integration
- Module 03: MongoDB Integration (Planned)

**Note:** User and blog data currently use temporary in-memory storage. Data is reset when the backend server restarts. MongoDB integration is planned for the next module.

## Internship

**Organization:** Codomax Digital Solutions  
**Program:** Full Stack Web Development Virtual Internship  
**Project:** BlogSpace – Blog Application

---

Developed as part of my Full Stack Web Development learning journey.