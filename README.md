# The Data Hub v2 🚀

A production-structured RESTful API built with Node.js, Express, and MongoDB Atlas. This sprint transitions from volatile in-memory storage to persistent cloud database architecture using Mongoose ODM, relational schema design, and aggregation queries.

**Live URL:** `https://the-data-storm.onrender.com`

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Middleware](#middleware)
- [Deployment](#deployment)
- [Development Notes](#development-notes)

---

## Overview

The Data Hub v2 is the second sprint of a backend engineering series. It replaces the Sprint 09 in-memory array with a persistent MongoDB Atlas cloud database, introduces Mongoose schema validation and ODM patterns, implements relational modeling between Users and Posts using `ref` and `.populate()`, and adds aggregation queries for sorted and limited result sets.

**Key engineering decisions:**
- Server only starts after a confirmed MongoDB Atlas connection — no silent failures
- `authorId` is a real ObjectId reference to the User collection — not a plain string
- `.populate()` field selector explicitly excludes sensitive user fields like `password`
- `/top` route is registered before `/:id` to prevent Express parameter collision
- Logger middleware carried forward from Sprint 09 — cross-cutting concerns reused, not rebuilt

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js v18+ | JavaScript runtime |
| Express.js | HTTP server and routing |
| Mongoose | ODM for MongoDB — schema, validation, queries |
| MongoDB Atlas | Cloud-hosted NoSQL database (M0 free tier) |
| dotenv | Environment variable management |
| Nodemon | Development auto-restart |

---

## Project Structure

```
the-data-hub-v2/
├── controllers/
│   ├── postController.js     # CRUD + populate + top 3 aggregation
│   └── userController.js     # User creation with validation
├── middleware/
│   └── logger.js             # Global request logger — IST timezone
├── models/
│   ├── Post.js               # Post schema with authorId ref to User
│   └── User.js               # User schema with unique email constraint
├── routes/
│   ├── posts.js              # Post routes — /top registered before /:id
│   └── users.js              # User routes
├── .env                      # Environment secrets — never committed
├── .gitignore                # Excludes .env and node_modules
├── server.js                 # Entry point — Atlas connection, middleware, routes
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free at [cloud.mongodb.com](https://cloud.mongodb.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/yogesh2002kashyap/the-data-storm.git
cd the-data-storm

# Install dependencies
npm install
```

### Atlas Setup

1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Under **Database Access** — create a database user with a simple alphanumeric password
3. Under **Network Access** — allow `0.0.0.0/0` for development
4. Click **Connect → Drivers** — copy the connection URI
5. Replace `<password>` and add your database name before the `?`

### Running the Server

```bash
# Development — auto restarts on file changes
npm run dev

# Production
npm start
```

On successful start, terminal shows:
```
MongoDB Atlas connected ✅
Data Hub running → http://localhost:5000
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/datahub?retryWrites=true&w=majority
PORT=5000
```

> Never commit `.env` to version control. It is excluded via `.gitignore`.

---

## API Reference

### Base URL

```
http://localhost:5000/api
```

### Response Envelope

All responses follow this consistent structure:

```json
{
  "status": "success" | "error",
  "message": "Human-readable description",
  "data": { } | [ ]
}
```

---

### Health Check

```
GET /
```

```json
{
  "status": "success",
  "message": "Welcome to The Data Hub v2 🚀"
}
```

---

### Users

#### Create a user

```
POST /api/users
```

**Request body:**
```json
{
  "name": "Yogesh",
  "email": "yogesh@example.com",
  "password": "password123"
}
```

**Response `201 Created`:**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "_id": "6643f1a2b4e3c2d1e0f9a8b7",
    "name": "Yogesh",
    "email": "yogesh@example.com",
    "createdAt": "2026-05-20T10:05:00.000Z",
    "updatedAt": "2026-05-20T10:05:00.000Z"
  }
}
```

**Response `400 Bad Request`** — missing fields:
```json
{
  "status": "error",
  "message": "name, email and password are required fields"
}
```

**Response `409 Conflict`** — duplicate email:
```json
{
  "status": "error",
  "message": "Email already exists"
}
```

---

### Posts

#### Get all posts

```
GET /api/posts
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "664a...",
      "title": "MongoDB Relational Modeling",
      "content": "Using refs and populate to join collections.",
      "authorId": {
        "_id": "6643f1a2...",
        "name": "Yogesh",
        "email": "yogesh@example.com"
      },
      "createdAt": "2026-05-20T10:05:00.000Z",
      "updatedAt": "2026-05-20T10:05:00.000Z"
    }
  ]
}
```

---

#### Get top 3 most recent posts

```
GET /api/posts/top
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "count": 3,
  "data": [ ...3 most recent posts sorted by createdAt descending ]
}
```

---

#### Get post by ID

```
GET /api/posts/:id
```

**Response `200 OK`** — post with populated author

**Response `404 Not Found`:**
```json
{
  "status": "error",
  "message": "Post with id 664a... not found"
}
```

---

#### Create a post

```
POST /api/posts
```

**Request body:**
```json
{
  "title": "MongoDB Relational Modeling",
  "content": "Using refs and populate to join collections.",
  "authorId": "6643f1a2b4e3c2d1e0f9a8b7"
}
```

**Response `201 Created`** — post document with `_id` and timestamps

**Response `400 Bad Request`** — validation failure

---

#### Update a post

```
PUT /api/posts/:id
```

**Request body** — any subset of fields:
```json
{
  "title": "Updated Title"
}
```

**Response `200 OK`** — updated post document, `updatedAt` refreshed automatically

---

#### Delete a post

```
DELETE /api/posts/:id
```

**Response `200 OK`:**
```json
{
  "status": "success",
  "message": "Post deleted successfully"
}
```

---

## Data Models

### User

| Field | Type | Rules |
|-------|------|-------|
| `_id` | ObjectId | Auto-generated by MongoDB |
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required |
| `createdAt` | Date | Auto-managed by Mongoose timestamps |
| `updatedAt` | Date | Auto-managed by Mongoose timestamps |

### Post

| Field | Type | Rules |
|-------|------|-------|
| `_id` | ObjectId | Auto-generated by MongoDB |
| `title` | String | Required, trimmed |
| `content` | String | Required, trimmed |
| `authorId` | ObjectId | Required, ref → User collection |
| `createdAt` | Date | Auto-managed by Mongoose timestamps |
| `updatedAt` | Date | Auto-managed by Mongoose timestamps |

---

## Middleware

### Request Logger

Every incoming request is logged to the server console in IST timezone:

```
[GET] /api/posts - 10:05 AM
[POST] /api/users - 10:06 AM
[DELETE] /api/posts/664a... - 10:07 AM
```

Implemented as a global Express middleware in `middleware/logger.js`, mounted before all routes in `server.js`.

---

## Deployment

This API is deployed on **Render** as a Web Service.

### Render Setup

| Field | Value |
|-------|-------|
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Environment | Node |

### Environment Variables on Render

Add these under **Environment → Environment Variables** in your Render dashboard:

```
MONGO_URI   →  your full Atlas connection URI
PORT        →  (leave empty — Render injects this automatically)
```

### Auto-Deploy

Connected to GitHub — every push to `main` triggers an automatic redeploy.

> **Note:** Free tier Render instances spin down after 15 minutes of inactivity. The first request after that takes 30–60 seconds to wake up. Subsequent requests are fast.

---

## Error Handling

| Status Code | Meaning | When |
|------------|---------|------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing or invalid fields |
| `404` | Not Found | Resource with given ID does not exist |
| `409` | Conflict | Duplicate unique field — email already exists |
| `500` | Internal Server Error | Unhandled server or database exception |

---

## Development Notes

### Why the server starts inside `.then()`

```js
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT);
  })
```

The API only accepts requests after the database connection is confirmed. Starting before connecting would allow requests to arrive before the DB is ready, causing immediate failures.

### Why `/top` is registered before `/:id`

Express matches routes top to bottom. If `/:id` came first, a request to `/api/posts/top` would match with `req.params.id = "top"`, causing a Mongoose CastError. Specific literal routes always come before parameterized ones.

### Why `password` is excluded from `.populate()`

```js
.populate('authorId', 'name email')
```

The second argument is a field selector. Only `name` and `email` are returned from the users collection — `password` is never exposed in post responses.

---

## Author

**Yogesh**
Built as part of a Node.js, Express, and MongoDB Atlas backend engineering sprint.

---

## License

MIT
