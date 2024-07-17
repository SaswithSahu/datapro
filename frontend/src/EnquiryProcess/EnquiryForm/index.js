import React, { useState,useEffect } from 'react';
import './index.css';

const EnquiryForm = () => {
  const api = process.env.REACT_APP_API
  
  const [formData, setFormData] = useState({
    place: '',
    name: '',
    address: '',
    background: '',
    collegeSchool: '',
    mobile: '',
    email: '',
    dob: '',
    aadhar: '',
    coursePreferred: '',
    timePreferred: '',
    source: '',
    courseFee: '',
    counselorName: '',
    centerName: "",
    status:"joined",
    remarks:""
  });

  const [errors, setErrors] = useState({});
  const [employee,setEmployee] = useState([]);
  const center = localStorage.getItem("center");
  const fetchEmployees = async () => {
      const response = await fetch(`${api}/employees`)
      const data = await response.json()
      const filteredData = data.employees.filter(employee =>employee.center === center && employee.role === 'Councillor')
      setEmployee(filteredData)
      
  }
  useEffect(() => {
    fetchEmployees()
  },[])


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validate = () => {
    let tempErrors = {};
    if (!formData.place) tempErrors.place = 'Place is required';
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.address) tempErrors.address = 'Address is required';
    if (!formData.background) tempErrors.background = 'Background is required';
    if (formData.background === 'student' && !formData.collegeSchool)
      tempErrors.collegeSchool = 'College/School is required';
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      tempErrors.mobile = 'Valid mobile number is required';
    // if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
    //   tempErrors.email = 'Valid email is required';
    if (!formData.dob) tempErrors.dob = 'Date of Birth is required';
    // if (formData.aadhar && !/^\d{12}$/.test(formData.aadhar))
    //   tempErrors.aadhar = 'Valid Aadhar number is required';
    if (!formData.coursePreferred)
      tempErrors.coursePreferred = 'Course Preferred is required';
    if (!formData.timePreferred)
      tempErrors.timePreferred = 'Time Preferred is required';
    if (!formData.source) tempErrors.source = 'Source is required';
    if (!formData.counselorName)
      tempErrors.counselorName = 'Counselor Name is required';
    // if (!formData.centerName) tempErrors.centerName = 'Center Name is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt_token");
    if (validate()) {
      try {
        const filteredFormData = Object.fromEntries(
          Object.entries(formData).filter(([key, value]) => value.trim() !== '')
        );
        filteredFormData.centerName = center;
        const response = await fetch(`${api}/enquiries`, {
          method: 'POST',
          headers: {
            
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          mode: 'cors',
          body: JSON.stringify(filteredFormData),
        });
        const data = await response.json();
        if (!response.ok) {
          alert("Invalid Access")
          throw new Error('Failed to submit form data');
        }
        alert('Registered Successfully');
        setFormData({
          place: '',
          name: '',
          address: '',
          background: '',
          collegeSchool: '',
          mobile: '',
          email: '',
          dob: '',
          aadhar: '',
          coursePreferred: '',
          timePreferred: '',
          source: '',
          courseFee: '',
          counselorName: '',
          remarks:""
        });
      } catch (error) {
        console.error('Error submitting form data:', error.message);
        alert('Failed to Register');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="enquiry-form">
      <div className="form-group">
        <label>Place:</label>
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
        />
        {errors.place && <span className="error">{errors.place}</span>}
      </div>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>
      <div className="form-group">
        <label>Background:</label>
        <select
          name="background"
          value={formData.background}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="student">Student</option>
          <option value="service">Service</option>
          <option value="housewife">House Wife</option>
          <option value="professional">Professional</option>
          <option value="business">Business</option>
          <option value="others">Others</option>
        </select>
        {errors.background && <span className="error">{errors.background}</span>}
      </div>
      {formData.background === 'student' && (
        <div className="form-group">
          <label>College/School:</label>
          <input
            type="text"
            name="collegeSchool"
            value={formData.collegeSchool}
            onChange={handleChange}
          />
          {errors.collegeSchool && (
            <span className="error">{errors.collegeSchool}</span>
          )}
        </div>
      )}
      <div className="form-group">
        <label>Mobile:</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />
        {errors.mobile && <span className="error">{errors.mobile}</span>}
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
        {errors.dob && <span className="error">{errors.dob}</span>}
      </div>
      <div className="form-group">
        <label>Aadhar Card No:</label>
        <input
          type="text"
          name="aadhar"
          value={formData.aadhar}
          onChange={handleChange}
        />
        {errors.aadhar && <span className="error">{errors.aadhar}</span>}
      </div>
      <div className="form-group">
        <label>Course Preferred:</label>
        <input
          type="text"
          name="coursePreferred"
          value={formData.coursePreferred}
          onChange={handleChange}
        />
        {errors.coursePreferred && (
          <span className="error">{errors.coursePreferred}</span>
        )}
      </div>
      <div className="form-group">
        <label>Time Preferred:</label>
        <select
          name="timePreferred"
          value={formData.timePreferred}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
        {errors.timePreferred && (
          <span className="error">{errors.timePreferred}</span>
        )}
      </div>
      <div className="form-group">
        <label>How did you come to know about DATAPRO:</label>
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="friends">Friends</option>
          <option value="relatives">Relatives</option>
          <option value="datapro-students">Datapro Students</option>
          <option value="newspaper">News Paper</option>
          <option value="direct-walk-in">Direct Walk-in</option>
          <option value="telecalling">Telecalling</option>
          <option value="others">Others</option>
        </select>
        {errors.source && <span className="error">{errors.source}</span>}
      </div>
      <div className="form-group">
        <label>Course Fee:</label>
        <input
          type="text"
          name="courseFee"
          value={formData.courseFee}
          onChange={handleChange}
        />
        {errors.courseFee && <span className="error">{errors.courseFee}</span>}
      </div>
      <div className='form-group'>
      <label>Counselor Name:</label>
      <select
          name="counselorName"
          value={formData.counselorName}
          onChange={handleChange}
        >
        <option value = "">Select</option>
         {employee.map(each =>(
          <option key = {each.username} value = {each.username}>{each.username}</option>
         ))}
        </select>
        {errors.counselorName && (
          <span className="error">{errors.counselorName}</span>
        )}
      </div>
      {/* <div className="form-group">
        <label>Counselor Name:</label>
        <input
          type="text"
          name="counselorName"
          value={formData.counselorName}
          onChange={handleChange}
        />
        {errors.counselorName && (
          <span className="error">{errors.counselorName}</span>
        )}
      </div> */}
      {/* <div className="form-group">
        <label>Center Name:</label>
        <select
          name="centerName"
          value={formData.centerName}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="DWK">DWK</option>
          <option value="MVP">MVP</option>
          <option value="GWK">GWK</option>
        </select>
        {errors.centerName && <span className="error">{errors.centerName}</span>}
      </div>*/}
       <div className="form-group">
         <label>Status:</label>
         <select
           name="status"
           value={formData.status}
           onChange={handleChange}
         >
           <option value="joined">Joined</option>
           <option value="notJoined">Not Joined</option>
        </select>
      </div> 
      <div className="form-group">
        <label>Remarks:</label>
        <textarea
          type="text"
          name="remarks"
          cols={70}
          rows={10}
          value={formData.remarks}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EnquiryForm;
