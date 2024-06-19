const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  IDNO: {
    type: String,
    unique: true,
    required: true
  },
  centerName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  aadharNo: {
    type: String,
    required: true
  },
  mobileNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  others: {
    type: String,
  },
  courseEnrolled: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  totalFees: {
    type: Number,
    required: true
  },
  durationOfCourse: {
    type: String,
    required: true
  },
  feeDueDate: {
    type: Date,
    required: true
  },
  trainer: {
    type: String,
    required: true
  },
  timings: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);
