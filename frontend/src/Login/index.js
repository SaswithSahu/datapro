import React, { useState } from 'react';
// import { BrowserRouter as useHistory } from 'react-router-dom';
import './index.css';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const history = useHistory();
  const api = process.env.REACT_APP_API

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const response = await fetch(`${api}/manager-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        // history.replace('/home');
        console.log(result.data);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
  <div style = {{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
     <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Sign In</h2>
        <div className="input-group">
          <label className="login-label" htmlFor="username">Username</label>
          <input
            className="login-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label className="login-label" htmlFor="password">Password</label>
          <div className="password-container">
            <input
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-button"
              onClick={handleShowPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button className="login-button" type="submit">Sign In</button>
      </form>
    </div>
  </div>
   
  );
}

export default Login;
