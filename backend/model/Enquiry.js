const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enquirySchema = new Schema({
  place: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  background: {
    type: String,
    enum: ['student', 'service', 'housewife', 'professional', 'business', 'others'],
    required: true
  },
  collegeSchool: {
    type: String
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    required: true,
    match: /\S+@\S+\.\S+/
  },
  dob: {
    type: Date,
    required: true
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{12}$/
  },
  coursePreferred: {
    type: String,
    required: true
  },
  timePreferred: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  source: {
    type: String,
    enum: ['friends', 'relatives', 'datapro-students', 'newspaper', 'others'],
    required: true
  },
  courseFee: {
    type: String,
    required: true
  },
  counselorName: {
    type: String,
    required: true
  },
  centerName: {
    type: String,
    enum: ['DWK', 'MVP'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
