const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');  
const Job = require('./models/Job');    

dotenv.config();  // Load environment variables

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)  // Use remote MongoDB URI from environment variables
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  //Middleware for Authentication
  const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId);
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid Token' });
    }
  };

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Route for user registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Route for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Route to add a new job (protected route)
app.post('/api/jobs', authMiddleware, async (req, res) => {  // Apply authMiddleware
  const { company, position, status, jobLocation, jobType } = req.body;

  try {
    const newJob = new Job({ 
      company, 
      position, 
      status, 
      jobLocation, 
      jobType, 
      createdBy: req.user._id  // Set createdBy from authenticated user
    });
    
    await newJob.save();
    res.status(201).json({ message: 'Job added successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error adding job', error: error.message });
  }
});

// Route to fetch all jobs (protected route)
app.get('/api/jobs', authMiddleware, async (req, res) => {  // Apply authMiddleware
  try {
    const jobs = await Job.find({ createdBy: req.user._id });  // Fetch jobs created by the authenticated user
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;  // Define PORT properly

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);  // This will log for debugging
});
