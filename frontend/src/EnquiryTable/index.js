// src/EnquiryTable.js
import React, { useEffect, useState } from 'react';
import './index.css';
import { useParams } from 'react-router-dom';
import EnquirySlider from '../EnquirySlider';

const EnquiryTable = () => {
    const {id} = useParams()
    console.log(id)
    const [enquiries, setEnquiries] = useState([]);
    
   
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://3.80.28.18:5000/enquiries');
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log(data)
            const filteredData = data.filter(item => item.centerName === id)
            setEnquiries(filteredData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    

    return (
        <div className="table-container">
            <div className='head-container'>
             <h1 className='center-name' style={{fontSize:"46px"}}>{id}</h1>
             <h1 className="total-count">Total:{enquiries.length}</h1>
            </div>
            <EnquirySlider enquiries = {enquiries}/>
            <table className="enquiry-table" >
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
