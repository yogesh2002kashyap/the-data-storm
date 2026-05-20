const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // load .env variavles first

const app = express();
const PORT = process.env.PORT || 5000;

// Route imports
const postRouter = require('./routes/posts');

// Middleware
app.use(express.json());

// Routes
app.use('/api/posts', postRouter);

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
