const express = require('express');
const mongoose = require('mongoose');
//const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const Enquiry = require('./model/Enquiry');
const Manager = require('./model/Manager');

const app = express();

app.use(bodyParser.json());
app.use(cors("*"));

mongoose.connect('mongodb+srv://saswith:saswith@cluster0.rtqlfvi.mongodb.net/datapro')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));
//const uri = "mongodb+srv://Saswith:saswith@332@cluster0.kmv0i6e.mongodb.net/datapro?retryWrites=true&w=majority";


app.post('/enquiries', async (req, res) => {
  try {
    const {
      place,
      name,
      address,
      background,
      collegeSchool,
      mobile,
      email,
      dob,
      aadhar,
      coursePreferred,
      timePreferred,
      source,
      courseFee,
      counselorName,
      centerName
    } = req.body;

    const enquiryData = {
      place,
      name,
      address,
      background,
      collegeSchool,
      mobile,
      email,
      dob,
      aadhar,
      coursePreferred,
      timePreferred,
      source,
      courseFee,
      counselorName,
      centerName
    };

    // Remove undefined fields
    Object.keys(enquiryData).forEach((key) => {
      if (enquiryData[key] === undefined) {
        delete enquiryData[key];
      }
    });

    const newEnquiry = new Enquiry(enquiryData);

    const savedEnquiry = await newEnquiry.save();

    res.status(201).json(savedEnquiry);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      console.log(err);
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.get('/student-details', async (req, res) => {
  try {
    const { mobile, aadhar } = req.query;

    if (!mobile && !aadhar) {
      return res.status(400).json({ error: 'Please provide either mobile or aadhar number' });
    }

    const query = mobile ? { mobile } : { aadhar };
    const user = await Enquiry.findOne(query);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/enquiries', async (req, res) => {
  try {
      const enquiries = await Enquiry.find({});
      res.status(200).json(enquiries);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

app.post('/register-manager', async (req, res) => {
  const { name, password, center } = req.body;

  try {
    const newManager = new Manager({
      name,
      password,
      center
    });
    await newManager.save();

    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
