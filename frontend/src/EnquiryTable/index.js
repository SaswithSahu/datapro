// src/EnquiryTable.js
import React, { useEffect, useState } from 'react';
import './index.css';
import EnquirySlider from '../EnquirySlider';

const EnquiryTable = () => {
    const [enquiries, setEnquiries] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/enquiries')
            .then(response => response.json())
            .then(data => setEnquiries(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="table-container">
            <EnquirySlider enquiries = {enquiries}/>
            <h1 className="table-title">Total:{enquiries.length}</h1>
            <table className="enquiry-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Counselor Name</th>
                        <th>Course Name</th>
                        <th>Course Fee</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {enquiries.map((enquiry, index) => (
                        <tr key={index} className="table-row">
                            <td>{enquiry.name}</td>
                            <td>{enquiry.counselorName}</td>
                            <td>{enquiry.coursePreferred}</td>
                            <td>{enquiry.courseFee}</td>
                            <td>{new Date(enquiry.date).toLocaleDateString()}</td>
                            <td>{new Date(enquiry.date).toLocaleTimeString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EnquiryTable;
