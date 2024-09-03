const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config(); // Load environment variables

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI) // Use remote MongoDB URI from environment variables
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware for Authentication
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // Corrected to use 'id'
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

// Function to generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Route for user registration
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate token for the newly registered user
    const token = generateToken(newUser._id);

    res.status(201).json({ message: 'User registered successfully', user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Route for user login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check if user exists and compare hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.status(200).json({ message: 'Login successful', user, token }); // Include token in response
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Route to add a new job (protected route)
app.post('/api/jobs', authMiddleware, async (req, res) => { // Apply authMiddleware
  const { company, position, status, jobLocation, jobType } = req.body;

  try {
    const newJob = new Job({
      company,
      position,
      status,
      jobLocation,
      jobType,
      createdBy: req.user._id // Set createdBy from authenticated user
    });

    await newJob.save();
    res.status(201).json({ message: 'Job added successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Error adding job', error: error.message });
  }
});

// Route to fetch all jobs (protected route)
app.get('/api/jobs', authMiddleware, async (req, res) => { // Apply authMiddleware
  try {
    const jobs = await Job.find({ createdBy: req.user._id }); // Fetch jobs created by the authenticated user
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});