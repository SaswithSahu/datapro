import React, { useState, useEffect } from 'react';
import './index.css';
import { Chrono } from 'react-chrono';

const JoinedAdmission = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [popupData, setPopupData] = useState({
    completedPercentage: '',
    supportRequired: '',
    anyProblems: '',
    estimatedDateToComplete: '',
  });
  const [viewDetailsPopup, setViewDetailsPopup] = useState(null);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        const response = await fetch(`${api}/project-admissions`);
        if (response.ok) {
          const data = await response.json();
          setAdmissions(data);
        } else {
          setError('Failed to fetch project admissions');
        }
      } catch (error) {
        setError('An error occurred while fetching project admissions');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [api]);

  const handleUpdateClick = (admission) => {
    setSelectedAdmission(admission);
    setPopupData({
      projectId: admission.projectId,
      completedPercentage: admission.completedPercentage || '',
      supportRequired: admission.supportRequired || '',
      anyProblems: admission.anyProblems || '',
      estimatedDateToComplete: admission.estimatedDateToComplete || '',
    });
  };

  const handleViewDetailsClick = async (admission) => {
    try {
      const response = await fetch(`${api}/project-status/${admission.projectId}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.status)
        setViewDetailsPopup(data.status);
      } else {
        setError('Failed to fetch project status details');
      }
    } catch (error) {
      setError('An error occurred while fetching project status details');
    }
  };

  const handleClosePopup = () => {
    setSelectedAdmission(null);
    setViewDetailsPopup(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPopupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${api}/project-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(popupData),
      });

      if (response.ok) {
        const updatedAdmission = await response.json();
        setAdmissions((prevAdmissions) =>
          prevAdmissions.map((admission) =>
            admission._id === updatedAdmission._id ? updatedAdmission : admission
          )
        );
        handleClosePopup();
      } else {
        setError('Failed to update project admission');
      }
    } catch (error) {
      setError('An error occurred while updating project admission');
    }
  };

  if (loading) {
    return <p className="project-admission-loading">Loading...</p>;
  }

  if (error) {
    return <p className="project-admission-error">{error}</p>;
  }

  return (
    <div className="project-admission-container">
      <div className="project-admission-header">
        <h1>Project Admissions</h1>
      </div>
      {admissions.length === 0 ? (
        <p className="project-admission-no-data">NO DATA</p>
      ) : (
        <table className="project-admission-table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Student Name 1</th>
              <th>Student Name 2</th>
              <th>Phone Number 1</th>
              <th>Phone Number 2</th>
              <th>Total Fees</th>
              <th>Fees Paid</th>
              <th>Guide 1</th>
              <th>Guide 2</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Councillor</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((admission) => (
              <tr key={admission._id}>
                <td>{admission.projectId}</td>
                <td>{admission.projectName}</td>
                <td>{admission.studentName1}</td>
                <td>{admission.studentName2}</td>
                <td>{admission.phoneNumber1}</td>
                <td>{admission.phoneNumber2}</td>
                <td>{admission.totalFees}</td>
                <td>{admission.feesPaid}</td>
                <td>{admission.guide1}</td>
                <td>{admission.guide2}</td>
                <td>{new Date(admission.deadline).toLocaleDateString()}</td>
                <td>{admission.status}</td>
                <td>{admission.councillor}</td>
                <td>{admission.remarks}</td>
                <td>
                  <button onClick={() => handleUpdateClick(admission)} style={{ marginBottom: "10px" }}>Update</button>
                  <button onClick={() => handleViewDetailsClick(admission)}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedAdmission && (
        <div className="project-admission-popup">
          <div className="project-admission-popup-content">
            <h2>Update Project Admission</h2>
            <label>
              Completed Percentage:
              <input
                type="number"
                name="completedPercentage"
                value={popupData.completedPercentage}
                onChange={handleChange}
              />
            </label>
            <label>
              Support Required:
              <textarea
                name="supportRequired"
                value={popupData.supportRequired}
                onChange={handleChange}
              />
            </label>
            <label>
              Any Problems:
              <textarea
                name="anyProblems"
                value={popupData.anyProblems}
                onChange={handleChange}
              />
            </label>
            <label>
              Estimated Date to Complete:
              <input
                type="date"
                name="estimatedDateToComplete"
                value={popupData.estimatedDateToComplete}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
      {viewDetailsPopup && (
        <div className="chrono-popup">
          <div className="chrono-popup-content">
            <h2>Project Status Details</h2>
            <Chrono
              items={viewDetailsPopup.map((status) => ({
                title: new Date(status.date).toLocaleDateString(),
               }))}
              mode="VERTICAL">
                {viewDetailsPopup.map((status) =>(
                  <div>
                  <p><strong>Completed Percentage:</strong> {status.completedPercentage}</p>
                  <p><strong>Support Required:</strong> {status.supportRequired}</p>
                  <p><strong>Any Problems:</strong> {status.anyProblems}</p>
                  <p><strong>Estimated Date to Complete:</strong> {new Date(status.estimatedDateToComplete).toLocaleDateString()}</p>
                </div>
                ))}
              </Chrono>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinedAdmission;
