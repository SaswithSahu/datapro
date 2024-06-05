import React, { useState } from 'react';

import './index.css';

const StudentDetailsView = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [enteredValue, setEnteredValue] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setEnteredValue('');
    setUserDetails(null);
  };

  const handleValueChange = (event) => {
    setEnteredValue(event.target.value);
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/student-details?${selectedOption}=${enteredValue}`);
      const data = await response.json();
      console.log(data)
      setUserDetails(data);
    } catch (error) {    
      console.error('Error fetching user details:', error);
    }
  };

  return (
    <div className="user-details-container">
      <div className="select-container">
        <select className="select-option" value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select an option</option>
          <option value="mobile">Phone Number</option>
          <option value="aadhar">Aadhar Number</option>
        </select>
      </div>
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          value={enteredValue}
          onChange={handleValueChange}
          placeholder={`Enter ${selectedOption}`}
          disabled={!selectedOption}
        />
      </div>
      <div className="button-container">
        <button
          className="fetch-button"
          onClick={fetchUserDetails}
          disabled={!enteredValue}
        >
          Fetch User Details
        </button>
      </div>
      {userDetails && (
        <div className="table-container">
          <table className="user-details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Aadhar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userDetails.name}</td>
                <td>{userDetails.email}</td>
                <td>{userDetails.mobile}</td>
                <td>{userDetails.aadhar}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDetailsView