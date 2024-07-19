import React, { useState, useEffect } from 'react';
import './index.css';

const CenterCourses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const api = process.env.REACT_APP_API;
  const center = localStorage.getItem('center');

  useEffect(() => {
    fetch(`${api}/get-center-courses?center=${center}`)
      .then(response => response.json())
      .then(data => {
        console.log(data.courses)
        setCourses(data.courses);

        const uniqueCategories = Array.from(new Set(data.courses.map(course => course.category)));
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, [api]);

  const filteredCourses = courses.filter(course => 
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || course.category === selectedCategory)
  );

  const handleEditClick = (course) => {
    // Handle edit course logic here
    console.log('Edit course:', course);
  };

  const handleDeleteClick = (course) => {
    // Handle delete course logic here
    console.log('Delete course:', course);
  };

  return (
    <div className="all-courses-container">
      <div className="all-courses-search-bar">
        <input 
          type="text" 
          placeholder="Search courses..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="all-courses-input"
        />
      </div>
      <div className="all-courses-category-dropdown">
        <select 
          value={selectedCategory} 
          onChange={e => setSelectedCategory(e.target.value)} 
          className="all-courses-select"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="all-courses-list">
        {filteredCourses.map(course => (
          <div key={course.courseName} className="courses-card">
            <img src={require(`../../../../backend/uploads/${course.image}`)} alt={course.courseName} className="all-courses-image" />
            <div className="all-courses-details">
              <h3 className="all-courses-name">{course.courseName}</h3>
              <p className="all-courses-fees">Actual Fees: {course.courseFees} Rs</p>
              <p>Center Fees: {course.centerFees} Rs</p>
              <p className="all-courses-duration">Duration: {course.courseDuration} days</p>
              <div className="all-courses-buttons">
                <button 
                  className="all-courses-edit-button" 
                  onClick={() => handleEditClick(course)}
                >
                  Edit
                </button>
                <button 
                  className="all-courses-delete-button" 
                  onClick={() => handleDeleteClick(course)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterCourses;
