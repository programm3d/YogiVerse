require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');
const PORT=process.env.PORT||5000
// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const connectDB=require("./config/db")
// Import middleware
const { notFound, errorHandler } = require('./middlewares/error');
const { limiter, authLimiter } = require('./middlewares/rateLimit');
const DB_URL=process.env.MONGO_URI
// Initialize Express app
const app = express();
connectDB(DB_URL);




// Security middleware
app.use(helmet());
// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }));
app.use(cors());
// Logger
app.use(morgan('dev'));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Cookie parser
app.use(cookieParser());



// Rate limiting
// app.use(limiter);
app.use('/api/auth', authLimiter);

// Static files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/report', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})


