require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./route/authRoutes');
const userRoutes = require('./route/userRoutes');
const postRoutes = require('./route/postRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Rate limiting middleware (apply to all requests)
app.use(generalLimiter);

// Middleware
app.use(cors({
    origin:"*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
connectDB(process.env.MONGODB_URI);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// module.exports = app;
