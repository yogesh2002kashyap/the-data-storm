const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // load .env variavles first

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware imports
const logger = require('./middleware/logger');

// Route imports
const postRouter = require('./routes/posts');
const usersRouter = require('./routes/users')

// CORS - must comes BEFORE all routes
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/posts', postRouter);
app.use('/api/users', usersRouter);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to The data storm'
    });
});

// Connect to MongoDB Atlas to start server
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB Atlas is connected ');
    app.listen(PORT, () => {
        console.log(`The data storm running -> http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.log('MongoDB connection failed', err.message);
    process.exit(1);
});
