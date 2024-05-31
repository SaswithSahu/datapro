const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Enquiry = require('./model/Enquiry');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/datapro')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


app.post('/enquiries', async (req, res) => {
  try {
    const {
      place, date, name, address, background, collegeSchool, mobile, email, dob, aadhar,
      coursePreferred, timePreferred, source, courseFee, counselorName, centerName
    } = req.body;

    const newEnquiry = new Enquiry({
      place, date, name, address, background, collegeSchool, mobile, email, dob, aadhar,
      coursePreferred, timePreferred, source, courseFee, counselorName, centerName
    });

    const savedEnquiry = await newEnquiry.save();

    res.status(201).json(savedEnquiry);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
