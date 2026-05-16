const mongoose = require('mongoose');
const validator = require('validator');

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'Category is required'],
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  contactName: {
    type: String,
    trim: true,
    default: '',
  },
  contactEmail: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => !value || validator.isEmail(value),
      message: 'Please provide a valid email address',
    },
    default: '',
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobRequest', jobRequestSchema);
