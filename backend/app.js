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
const Employee = require('./model/Employee');

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


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied: No Token Provided');

  jwt.verify(token, "jwt-secret", (err, user) => {
      if (err) return res.status(403).send('Invalid Token');
      req.user = user;
      next();
  });
};

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
  const { username, password,center } = req.body;
  try {
    const manager = await Manager.findOne({ name:username});
    if (!manager) {
      return res.status(401).json({ error: 'Invalid name or password' });
    }
    const isMatch = await bcrypt.compare(password, manager.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid name or password' });
    }
    if(manager.center !== center){
      return res.status(401).json({ error: 'Invalid center' });
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

app.post('/register-employee', authenticateToken,async (req, res) => {
  const { username, password, role } = req.body;

  try {

    const center = req.user.center;
    console.log(center)
      const existingEmployee = await Employee.findOne({ username });
      if (existingEmployee) {
          return res.status(400).send('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newEmployee = new Employee({
          username,
          password: hashedPassword,
          role,
          center
      });

      await newEmployee.save();
      res.status(201).send('Employee registered successfully');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/login-employee', async (req, res) => {
  const { username, password, center, role } = req.body;
  try {
      const user = await Employee.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: 'Invalid password' });
      }

      if (user.center !== center || user.role !== role) {
          return res.status(401).json({ message: 'Invalid center or role' });
      }

      const token = jwt.sign({ id: user._id, center: user.center, role: user.role }, "jwt-secret", { expiresIn: '1h' });

      res.status(200).json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.get("/employees",async(req, res) => {
  try{
    const employees = await Employee.find({})
    res.status(200).json({ employees });
  }catch(e){
    res.status(501).json({ "message": e });
  }
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
