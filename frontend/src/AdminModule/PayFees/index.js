import React, { useState } from 'react';
import './index.css';

const PayFees = () => {
  const [studentID, setStudentID] = useState('');
  const [student, setStudent] = useState(null);
  const [payment, setPayment] = useState(null)
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [nextTermDate, setNextTermDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const api = process.env.REACT_APP_API;

  const handleInputChange = (e) => {
    setStudentID(e.target.value);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} at ${formattedTime}`;
  };
  const center = localStorage.getItem("center")
  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${api}/student/${studentID}`);
      if (!response.ok) {
        alert("Student not found")
        throw new Error('Student not found');
      }
      const data = await response.json();
      console.log(data)
      if(data.admission.centerName !== center) {
        alert("This Student Is Not From Your Center")
        throw new Error('Student not found');
      }
      setStudent(data.admission);
      setPayment(data.feesDetails)

      setError(null);
    } catch (error) {
      setStudent(null);
      setError(error.message);
    }
  };

  const handlePayFeesClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleNextTermDateChange = (e) => {
    setNextTermDate(e.target.value);
  };

  const handlePaymentModeChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handlePayButtonClick = async () => {
    const paymentDetails = {
      IdNo:studentID,
      amountPaid:amount,
      nextTermDate,
      modeOfPayment:paymentMode,
      center
    };

    try {
      const response = await fetch(`${api}/pay-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentDetails)
      });
      console.log(paymentDetails)

      if (!response.ok) {
        throw new Error('Failed to process payment');
      }

      alert('Payment successful');
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };
 
  return (
    <div className="student-details-container">
      <div className="input-container">
        <input
          type="text"
          value={studentID}
          onChange={handleInputChange}
          placeholder="Enter Student ID"
          className="student-input"
        />
        <button onClick={handleButtonClick} className="search-button">Get Details</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {student && (
        <div className="student-card">
          <img src={require(`../../../../backend/uploads/${student.image}`)} alt={student.name} className="student-pic" />
          <div className="student-info">
            <h2 className="student-name">{student.name}</h2>
            <p className="student-course"><strong>Course:</strong> {student.courseEnrolled}</p>
            <p className="student-timings"><strong>Timings:</strong> {student.timings}</p>
            <p className="student-start-date"><strong>Start Date:</strong> {formatDate(student.dateOfJoining)}</p>
            <p className="student-total-fees"><strong>Total Fees:</strong> {student.totalFees}</p>
            {
              payment ? payment.totalStatus === "completed"?(<h1 style={{color:"green",fontFamily:"Roboto"}}>Fees Paid</h1>):(<button onClick={handlePayFeesClick} className="pay-fees-button">Pay</button>):(<button  onClick={handlePayFeesClick} className="pay-fees-button">Pay</button>)
            }
          </div>
        </div>
      )}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            width: '400px',
            position: 'relative',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
          }}>
            <span style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px',
              cursor: 'pointer',
            }} onClick={closeModal}>&times;</span>
            <h2>Pay Fees</h2>
            <div style={{ marginBottom: '10px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
              }}>Amount</label>
              <input
                type="number"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px',
                }}
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
              }}>Next Term Date</label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px',
                }}
                value={nextTermDate}
                onChange={handleNextTermDateChange}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
              }}>Mode of Payment</label>
              <select
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px',
                }}
                value={paymentMode}
                onChange={handlePaymentModeChange}
              >
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>
            <button
              onClick={handlePayButtonClick}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                color: '#fff',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                width: '100%',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayFees;
