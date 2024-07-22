import React, { useState, useEffect } from 'react';
import './index.css'; // Import your CSS file for styling

const FeesRemainders = () => {
  const [students, setStudents] = useState([]);
  const api = process.env.REACT_APP_API;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${api}/fees-due-today`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []); 

  return (
    <div className="student-table">
      <table>
        <thead>
          <tr>
            <th className="fee-id">ID No</th>
            <th className="fee-name">Name</th>
            <th className="fee-course">Course Enrolled</th>
            <th className="fee-total">Total Fees</th>
            <th className="fee-paid">Paid Fees</th>
            <th className="fee-remainder">Fee Remainder</th>
            <th className="fee-phone">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.admission._id}>
              <td className="fee-id">{student.fee.IdNo}</td>
              <td className="fee-name">{student.admission.name}</td>
              <td className="fee-course">{student.admission.courseEnrolled}</td>
              <td className="fee-total">{student.admission.totalFees}</td>
              <td className="fee-paid">
                {student.fee.terms.reduce((total, term) => total + term.amountPaid, 0)}
              </td>
              <td className="fee-remainder">
                {student.admission.totalFees - student.fee.terms.reduce((total, term) => total + term.amountPaid, 0)}
              </td>
              <td className="fee-phone">{student.admission.mobileNo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FeesRemainders;
