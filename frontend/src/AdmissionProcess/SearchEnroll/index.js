// SearchEnroll.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const SearchEnroll = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = process.env.REACT_APP_API
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api}/getDetails?mobile=${mobileNumber}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to retrieve data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = (id) => {
    navigate("/admission-process/form")
    console.log(`Enroll clicked for ID: ${id}`);
  };

  return (
    <div className="search-enroll-container">
      <div className="search-box">
        <input
          type="text"
          className="input-field"
          placeholder="Enter Mobile Number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button className="get-button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Loading...' : 'Get'}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {data.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{data.indexOf(item) + 1}</td>
                <td>{item.name}</td>
                <td>{item.address}</td>
                <td>
                  <button className="enroll-button" onClick={() => handleEnroll(item.id)}>
                    Enroll
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchEnroll;
