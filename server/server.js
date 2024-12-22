require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const passport = require('passport');
const session = require('express-session');
const { router: authRoutes, authenticateToken } = require('./routes/auth');
const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plant');
const reviewRoutes = require('./routes/reviews');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const commentRoutes = require('./routes/comments');

// Middleware
app.use(express.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/comments', commentRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
