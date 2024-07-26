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
const Fees = require("./model/Fees")
const Course = require("./model/Course");
const CenterCourse = require("./model/centerCourseSchema");
const { FollowUp } = require('./model/FollowUp'); 
const path = require('path');

const app = express();

app.use(cors("*"));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage:storage });

mongoose.connect('mongodb+srv://saswith:saswith@cluster0.rtqlfvi.mongodb.net/datapro')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));


const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied: No Token Provided');

  jwt.verify(token, "jwt-secret", (err, user) => {
      if (err) return res.status(403).send('Invalid Token');
      req.user = user;
      console.log(user)
      next();
  });
};

const getRemainders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const remainders = await FollowUp.aggregate([
      {
        $unwind: "$remarks"
      },
      {
        $match: {
          "remarks.nextFollowUpDate": {
            $gte: today,
            $lte: endOfDay
          }
        }
      },
      {
        $sort: {
          "remarks.followUpDate": -1 
        }
      },
      {
        $group: {
          _id: "$enquiryId",
          studentName: { $first: "$studentName" },
          studentContact: { $first: "$studentContact" },
          courseInquired: { $first: "$courseInquired" },
          lastRemark: { $first: "$remarks" }
        }
      },
      {
        $project: {
          _id: 1,
          studentName: 1,
          studentContact: 1,
          courseInquired: 1,
          lastRemark: {
            followUpDate: 1,
            notes: 1,
            nextFollowUpDate: 1
          }
        }
      }
    ]);

    return remainders;
  } catch (error) {
    console.error('Error fetching remainders:', error.message);
    throw error;
  }
};


app.post('/enquiries',authenticateToken, async (req, res) => {
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

    if(req.user.center !== centerName){
       return res.status(500).json("Invalid Access");
    }

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


    Object.keys(enquiryData).forEach((key) => {
      if (enquiryData[key] === undefined) {
        delete enquiryData[key];
      }
    });

    const newEnquiry = new Enquiry(enquiryData);

    const savedEnquiry = await newEnquiry.save();

    res.status(201).json("Registered Successfully");
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      console.log(err);
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json("Server Error");
    }
  }
});

app.get('/student-details',authenticateToken,async (req, res) => {
  try {
    const { mobile, aadhar } = req.query;

    if (!mobile && !aadhar) {
      return res.status(400).json({ error: 'Please provide either mobile or aadhar number' });
    }
    const query = mobile ? { mobile } : { aadhar };
    const user = await Enquiry.find(query);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const users = user.filter(u => u.centerName === req.user.center)
    res.json(users);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/enquiries',async (req, res) => {
  try {
      const enquiries = await Enquiry.find({});
      res.status(200).json(enquiries);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

app.get('/enquiry-status',authenticateToken,async (req, res) => {
  try {
      const Councillor = req.user.name
      const enquiries = await Enquiry.find({});
      const en = enquiries.filter(u => u.counselorName.toLowerCase() === Councillor.toLowerCase());
      res.status(200).json(en);
  } catch (err) {
      res.status(500).json({ message: 'Error fetching enquiries', error: err });
  }
});

app.delete("/delete-enquiry/:id",authenticateToken,async(req,res) =>{
  const {id} = req.params;
  try{
    const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
    res.status(201).json("Enquiry Deleted")
  }catch(e){
    res.status(500).json("Server Error")
  }
})

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

app.get('/getDetails',authenticateToken,async (req, res) => {
  const { mobile } = req.query;

  if (!mobile) {
    return res.status(400).json('Mobile number is required');
  }

  try {
    const enquiries = await Enquiry.find({ mobile });
    const filteredEnquiries = enquiries.filter(e => e.centerName === req.user.center)
    if (filteredEnquiries.length === 0) {
      return res.status(400).json('No data found for the provided mobile number');
    }

    res.json(filteredEnquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/admissions',authenticateToken,upload.single('image'), async (req, res) => {
  try {
    const {
      IdNo, centerName, name, gender, address, aadharNo,
      mobileNo, email, others, courseEnrolled, dateOfJoining,
      totalFees, durationOfCourse, feeDueDate, trainer, timings, enrolledId
    } = req.body;


    const newAdmissionData = {
      IdNo,
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
      counselorName :req.user.name,
      timings
    };

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/').replace('uploads/', '');
      newAdmissionData.image = imagePath;
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
      const existingEmployee = await Employee.findOne({ username:username,center:center });

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

      const token = jwt.sign({ id: user._id, center: user.center, name:user.username, role: user.role }, "jwt-secret", { expiresIn: '1h' });

      res.status(200).json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.delete("/delete-employees/:id",async(req, res) => {
  const {id} = req.params
  console.log(id)
  try{
    const d = await Employee.findByIdAndDelete({ _id:id });
    res.status(201).json("Deleted Successful")
    console.log("deleted",d)
  }catch(e){
    res.status(500).json("Failed To Delete")
    console.log(e)
  }
})

app.get("/employees",async(req, res) => {
  try{
    const employees = await Employee.find({})
    res.status(200).json({ employees });
  }catch(e){
    res.status(501).json({ "message": e });
  }
})

app.get("/student/:id",async(req,res) => {
  const {id} = req.params
  try{
    const admission = await Admission.findOne({ IdNo:id })
    const feesDetails = await Fees.findOne({ IdNo:id })
    if(!admission){
      return res.status(501).json("student not found")
    }
    res.status(200).json({ admission,feesDetails });
  }catch(e){
    res.status(500).send(e)
  }
})

app.post('/pay-fees', async (req, res) => {
  const { IdNo, amountPaid, modeOfPayment, nextTermDate, center } = req.body;
  if (!IdNo || !amountPaid || !modeOfPayment || !nextTermDate || !center) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const admission = await Admission.findOne({ IdNo });

    if (!admission) {
      return res.status(400).json({ error: 'Student admission record not found' });
    }

    let fees = await Fees.findOne({ IdNo });

    if (fees) {
      const lastTermNumber = fees.terms.length > 0 
        ? Math.max(...fees.terms.map(term => term.termNumber)) 
        : 0;
      const newTermNumber = lastTermNumber + 1;

      fees.terms.push({ termNumber: newTermNumber, amountPaid, modeOfPayment });
      fees.nextTermDate = nextTermDate;
      const totalPaid = fees.terms.reduce((total, term) => total + term.amountPaid, 0);

      fees.totalStatus = totalPaid >= admission.totalFees ? 'completed' : 'pending';
      await fees.save();
    } else {
      const totalPaid = amountPaid;
      const totalStatus = totalPaid >= admission.totalFees ? 'completed' : 'pending';

      fees = new Fees({
        IdNo,
        terms: [{ termNumber: 1, amountPaid, modeOfPayment }],
        nextTermDate,
        totalStatus,
        center
      });
      await fees.save();
    }

    res.status(200).json({ message: 'Term added successfully', fees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/get-fees-details/:id",async(req, res) => {
    const {id} = req.params;
    try{
      const feesDetails = await Fees.findOne({IdNo:id});
      if(!feesDetails){
        res.status(200).json("No Payment Details Found")
      }
      res.status(200).json(feesDetails)
    }catch(e){
      res.status(500).json(e.message)
    }
})

app.get('/fees-due-today', async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Increment the date by one day

  try {
    const feesDueToday = await Fees.find({
      nextTermDate: {
        $gte: today,
        $lt: tomorrow
      },
      totalStatus: 'pending'
    });

    const feesWithAdmissions = await Promise.all(feesDueToday.map(async (fee) => {
      const admission = await Admission.findOne({ IdNo: fee.IdNo });
      return {
        fee,
        admission
      };
    }));

    res.status(200).json(feesWithAdmissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/fees",async(req, res) => {
  try{
    const feesDetails = await Fees.find();
    if(!feesDetails){
      res.status(200).json("No Payment Details Found")
    }
    res.status(200).json(feesDetails)
  }catch(e){
    res.status(500).json(e.message)
  }
})

app.post('/add-course', upload.single('courseImage'), async (req, res) => {
  try {
    const { courseName, courseFees, courseDuration, category } = req.body;
    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) {
      return res.status(409).json({ error: 'Course already exists' });
    }
    const newCourse = new Course({
      courseName,
      courseFees,
      courseDuration,
      category
    });

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, '/').replace('uploads/', '');
      newCourse.image = imagePath;
    }

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

app.get('/get-courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/add-center-course', async (req, res) => {
  try {
    const { courseId, centerName, centerFees } = req.body;

    let centerCourse = await CenterCourse.findOne({ centerName });

    if (centerCourse) {
      const courseExists = centerCourse.courses.some(
        course => course.course.toString() === courseId
      );

      if (courseExists) {
        return res.status(409).json({ error: 'Course already exists for this center' });
      }

      centerCourse.courses.push({ course: courseId, centerFees });
    } else {
      centerCourse = new CenterCourse({
        centerName,
        courses: [{ course: courseId, centerFees }]
      });
    }

    await centerCourse.save();
    res.status(201).json(centerCourse);
  } catch (error) {
    console.error('Error adding center course:', error);
    res.status(500).json({ error: 'Failed to add center course' });
  }
});

app.get('/get-center-courses', async (req, res) => {
  try {
    const { center } = req.query;
    if (!center) {
      return res.status(400).json({ error: 'Center is required' });
    }

    const centerCourses = await CenterCourse.findOne({ centerName: center })
      .populate({
        path: 'courses.course',
        select: 'courseName courseFees courseDuration image category'
      })
      .exec();

    if (!centerCourses) {
      return res.status(404).json({ error: 'No courses found for this center' });
    }

    const courses = centerCourses.courses.map(courseItem => ({
      courseId: courseItem.course._id,
      centerFees: courseItem.centerFees,
      courseName: courseItem.course.courseName,
      courseFees: courseItem.course.courseFees,
      courseDuration: courseItem.course.courseDuration,
      image: courseItem.course.image,
      category: courseItem.course.category
    }));

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching center courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/get-all-center-courses', async (req, res) => {
  try {
    const centerCourses = await CenterCourse.find({})
      .populate({
        path: 'courses.course',
        select: 'courseName courseFees courseDuration image category'
      })
      .exec();

    if (!centerCourses.length) {
      return res.status(404).json({ error: 'No courses found for any center' });
    }

    const formattedData = centerCourses.map(centerCourse => ({
      centerName: centerCourse.centerName,
      courses: centerCourse.courses.map(courseItem => ({
        courseId: courseItem.course._id,
        centerFees: courseItem.centerFees,
        courseName: courseItem.course.courseName,
        courseFees: courseItem.course.courseFees,
        courseDuration: courseItem.course.courseDuration,
        image: courseItem.course.image,
        category: courseItem.course.category
      }))
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching center courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/delete-center-course', async (req, res) => {
  const { centerName, courseId } = req.body;
  console.log(req.body)

  try {
    const centerCourse = await CenterCourse.findOne({ centerName });
    if (!centerCourse) {
      return res.status(404).json({ error: 'Center not found' });
    }

    const courseIndex = centerCourse.courses.findIndex(course => course.course.toString() === courseId);
    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    centerCourse.courses.splice(courseIndex, 1);
    await centerCourse.save();

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/add-follow-up', async (req, res) => {
  try {
    const { enquiryId, studentName, studentContact, courseInquired, notes, nextFollowUpDate } = req.body;

    if (!enquiryId || !notes || !nextFollowUpDate || !studentName || !studentContact || !courseInquired) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const followUpDate = new Date();

    let followUp = await FollowUp.findOne({ enquiryId });
    if (followUp) {
      if (followUp.remarks.length > 0) {
        followUp.remarks[followUp.remarks.length - 1].remainderStatus = 'completed';
      }

      const remark = {
        followUpDate,
        notes,
        nextFollowUpDate,
        remainderStatus: 'pending'
      };
      followUp.remarks.push(remark);

      followUp.status = 'active';

      await followUp.save();

      res.status(200).json({ message: 'Remark added successfully', followUp });
    } else {
      followUp = new FollowUp({
        enquiryId,
        studentName,
        studentContact,
        courseInquired,
        remarks: [{
          followUpDate,
          notes,
          nextFollowUpDate,
          remainderStatus: 'pending'
        }],
        status: 'active'
      });
      await followUp.save();

      res.status(201).json({ message: 'New enquiry created with remark', followUp });
    }
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



app.get('/followup-remainders', async (req, res) => {
  try {
    const remainders = await getRemainders();
    res.status(200).json(remainders);
  } catch (error) {
    console.error('Error in /remainders endpoint:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get("/all-remainders", async (req, res) => {
  try {
    const data = await FollowUp.find();
    const latestRemarks = data.map(followUp => {
      let latestRemark = null;

      if (followUp.remarks && followUp.remarks.length > 0) {
        followUp.remarks.sort((a, b) => b.followUpDate - a.followUpDate);
        latestRemark = followUp.remarks[0];
      }

      return {
        _id: followUp._id,
        enquiryId: followUp.enquiryId,
        studentName: followUp.studentName,
        studentContact: followUp.studentContact,
        courseInquired: followUp.courseInquired,
        latestRemark: latestRemark
      };
    });

    res.status(201).json({ data: latestRemarks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
