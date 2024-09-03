const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100,
  },
  company: {
    type: String,
    required: [true, 'Please provide company'],
    maxlength: 100,
  },
  jobLocation: {
    type: String,
    required: [true, 'Please provide job location'],
    maxlength: 100,
    default: 'My City',
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'remote', 'internship'],
    default: 'full-time',
  },
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
