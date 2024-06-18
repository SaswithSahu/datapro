// AdmissionForm.js
import React from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

const AdmissionForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
    // Handle form submission, including file upload via multer on the backend
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Personal Details</h2>
      <form className="admission-form" onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <label htmlFor="idNo">ID No</label>
          <input type="text" id="idNo" className="input-field" {...register('idNo', { required: true })} />
          {errors.idNo && <span className="error">ID No is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="center">Center</label>
          <select id="center" className="input-field" {...register('center', { required: true })}>
            <option value="DWK">DWK</option>
            <option value="MVP">MVP</option>
            <option value="GWK">GWK</option>
          </select>
          {errors.center && <span className="error">Center is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" className="input-field" {...register('name', { required: true })} />
          {errors.name && <span className="error">Name is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select id="gender" className="input-field" {...register('gender', { required: true })}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error">Gender is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input type="file" id="image" className="input-field" {...register('image', { required: true })} />
          {errors.image && <span className="error">Image is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" className="input-field" {...register('address', { required: true })} />
          {errors.address && <span className="error">Address is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="aadharNo">Aadhar No</label>
          <input type="text" id="aadharNo" className="input-field" {...register('aadharNo', { required: true })} />
          {errors.aadharNo && <span className="error">Aadhar No is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="mobileNo">Mobile No</label>
          <input type="text" id="mobileNo" className="input-field" {...register('mobileNo', { required: true })} />
          {errors.mobileNo && <span className="error">Mobile No is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="input-field" {...register('email', { required: true })} />
          {errors.email && <span className="error">Email is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="group">Group/College/Occupation/Others</label>
          <input type="text" id="group" className="input-field" {...register('group', { required: true })} />
          {errors.group && <span className="error">This field is required</span>}
        </div>

        <h2 className="form-heading">Fees and Course Details</h2>

        <div className="form-group">
          <label htmlFor="course">Course Enrolled</label>
          <input type="text" id="course" className="input-field" {...register('course', { required: true })} />
          {errors.course && <span className="error">Course is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dateOfJoining">Date of Joining</label>
          <input type="date" id="dateOfJoining" className="input-field" {...register('dateOfJoining', { required: true })} />
          {errors.dateOfJoining && <span className="error">Date of Joining is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="totalFees">Total Fees</label>
          <input type="text" id="totalFees" className="input-field" {...register('totalFees', { required: true })} />
          {errors.totalFees && <span className="error">Total Fees is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration of Course</label>
          <input type="text" id="duration" className="input-field" {...register('duration', { required: true })} />
          {errors.duration && <span className="error">Duration is required</span>}
        </div>

        <div className="form-group">
          <label htmlFor="feeDueDate">Fee Due Date</label>
          <input type="date" id="feeDueDate" className="input-field" {...register('feeDueDate', { required: true })} />
          {errors.feeDueDate && <span className="error">Fee Due Date is required</span>}
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default AdmissionForm;
