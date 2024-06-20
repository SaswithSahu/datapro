const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const Enquiry = require('./model/Enquiry');
const Admission = require("./model/Admission");
const jwt = require('jsonwebtoken');
const Manager = require('./model/Manager');

const app = express();

app.use(bodyParser.json());
app.use(cors("*"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://saswith:saswith@cluster0.rtqlfvi.mongodb.net/datapro')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


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
      centerName,
      status,
      remarks
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
      centerName,
      status,
      remarks
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
 
  
  if (!name || !password || !center) {
    return res.status(400).json({ error: 'Name, password, and center are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);
    
    const newManager = new Manager({
      name,
      password: hashedPassword,
      center
    });

    await newManager.save();
    console.log('Manager saved successfully:', newManager);

    res.status(201).json({ message: 'Manager registered successfully' });
  } catch (error) {
    console.error('Error in /register-manager:', error);
    res.status(500).json({ error: 'Failed to register. Please try again.' });
  }
});

app.post('/manager-login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const manager = await Manager.findOne({ name:username});
    console.log(manager);

    if (!manager) {
      return res.status(401).json({ error: 'Invalid name or password' });
    }
    const isMatch = await bcrypt.compare(password, manager.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid name or password' });
    }

    const token = jwt.sign({ id: manager._id, center: manager.center }, "jwt-secret", { expiresIn: '1h' });

    res.status(200).json({ token, center: manager.center });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login. Please try again.' });
  }
});

app.get('/getDetails', async (req, res) => {
  const { mobile } = req.query;

  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  try {
    const enquiries = await Enquiry.find({ mobile });

    if (enquiries.length === 0) {
      return res.status(404).json({ error: 'No data found for the provided mobile number' });
    }

    res.json(enquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admissions', upload.single('image'), async (req, res) => {
  try {
    const {
      IDNO, centerName, name, gender, address, aadharNo,
      mobileNo, email, others, courseEnrolled, dateOfJoining,
      totalFees, durationOfCourse, feeDueDate, trainer, timings, enrolledId
    } = req.body;

    // Prepare the new admission object
    const newAdmissionData = {
      IDNO,
      centerName,
      name,
      gender,
      address,
      aadharNo,
      mobileNo,
      email,
      others,
      courseEnrolled,
      dateOfJoining,
      totalFees,
      durationOfCourse,
      feeDueDate,
      trainer,
      timings
    };

    if (req.file) {
      newAdmissionData.image = req.file.path;
    }

    const newAdmission = new Admission(newAdmissionData);

    const savedAdmission = await newAdmission.save();

    if (enrolledId !== null) {
      console.log("Enter");
      await Enquiry.findByIdAndUpdate(enrolledId, { status: 'joined' });
    }

    res.status(201).json(savedAdmission);

  } catch (error) {
    console.error('Error creating admission entry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/admissions', async (req, res) => {
  try {
      const admission = await Admission.find({});
      res.status(200).json(admission);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
