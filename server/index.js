// index.js
const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plants');
const reviewRoutes = require('./routes/reviews');
const commentRoutes = require('./routes/comments');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');

// Use the routes
router.use('/users', userRoutes);
router.use('/plants', plantRoutes);
router.use('/reviews', reviewRoutes);
router.use('/comments', commentRoutes);
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

module.exports = router;
