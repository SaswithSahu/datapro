import React, { useEffect, useState } from 'react';
import './index.css';

const StudentJoiningStatus = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedCount, setJoinedCount] = useState(0);
  const [notJoinedCount, setNotJoinedCount] = useState(0);
  const center = localStorage.getItem("center");

  useEffect(() => {
    fetch('http://localhost:5000/enquiries')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const filteredData = data.filter(data => data.centerName === center);
        setEnquiries(filteredData);
        setLoading(false);

        const joined = filteredData.filter(enquiry => enquiry.status === 'joined').length;
        const notJoined = filteredData.length - joined;
        setJoinedCount(joined);
        setNotJoinedCount(notJoined);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="studentJoinStatus-loading">Loading...</p>;
  }

  if (error) {
    return <p className="studentJoinStatus-error">Error: {error.message}</p>;
  }

  return (
    <div className="studentJoinStatus-container">
      <div className="studentJoinStatus-counts">
        <p style={{color:"green"}}>Joined: {joinedCount}</p>
        <p style={{color:"red"}}>Not Joined: {notJoinedCount}</p>
      </div>
      <table className="studentJoinStatus-table">
        <thead>
          <tr>
            <th className="studentJoinStatus-th">Student Name</th>
            <th className="studentJoinStatus-th">Course Name</th>
            <th className="studentJoinStatus-th">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry, index) => (
            <tr
              key={index}
              className={`studentJoinStatus-tr ${
                enquiry.status === 'joined' ? 'studentJoinStatus-joined' : 'studentJoinStatus-notJoined'
              }`}
            >
              <td className="studentJoinStatus-td">{enquiry.name}</td>
              <td className="studentJoinStatus-td">{enquiry.coursePreferred}</td>
              <td className="studentJoinStatus-td">{enquiry.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleRemark(id) {
    console.log(`Remark button clicked for enquiry ID: ${id}`);
    // Add your logic here for handling remarks
  }
};

export default StudentJoiningStatus;
