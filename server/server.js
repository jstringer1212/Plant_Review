const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Import route files
const authRoutes = require('./routes/auth');
const commentsRoutes = require('./routes/comments');
const favoritesRoutes = require('./routes/favorites');
const loginRoutes = require('./routes/login');
const plantsRoutes = require('./routes/plants');
const registerRoutes = require('./routes/register');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin'); 


// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/plants', plantsRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/users', usersRoutes); // Keep this for general user routes
app.use('/api', adminRoutes); // Admin routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
