const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  
const cors = require('cors');  
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config(); 
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all routes
app.use(cors());  

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI) // Use remote MongoDB URI from environment variables
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId); 
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }
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
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token, user });
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

// Route to delete a job (protected route)
app.delete('/api/jobs/:id', authMiddleware, async (req, res) => {
  try {
    
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' }); 
    }

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
});

// Route to edit a job (protected route)
app.patch('/api/jobs/:id', authMiddleware, async (req, res) => { // Apply authMiddleware
  const { company, position, status, jobLocation, jobType } = req.body;

  try {
    // Find the job by ID and ensure it belongs to the authenticated user
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' }); // Job not found or doesn't belong to the user
    }

    // Update the job details
    job.company = company || job.company;
    job.position = position || job.position;
    job.status = status || job.status;
    job.jobLocation = jobLocation || job.jobLocation;
    job.jobType = jobType || job.jobType;

    await job.save(); // Save updated job

    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
});

app.get('/api/jobs/stats', authMiddleware, async (req, res) => {
  try {
    
    const stats = await Job.aggregate([
      { $match: { createdBy: req.user._id } },  
      { $group: { _id: '$status', count: { $sum: 1 } } } 
    ]);

    const defaultStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;  
      return acc;
    }, {});

   
    const monthlyApplications = await Job.aggregate([
      { $match: { createdBy: req.user._id } },  
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },  // Sort by year and month in descending order
      { $limit: 6 },  // Get the last 6 months of data
    ]);

    res.status(200).json({ defaultStats, monthlyApplications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});
