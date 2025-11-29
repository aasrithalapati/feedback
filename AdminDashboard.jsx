import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [allFeedback, setAllFeedback] = useState([]);
  const [filteredFeedback, setFilteredFeedback] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const courses = ["AI Basics", "Machine Learning", "Deep Learning", "Data Science", "Web Development", "Database Management"];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      navigate("/");
      return;
    }
    
    // Simple admin check - you can enhance this
    if (user.email !== "admin@college.edu") {
      navigate("/home");
      return;
    }
    
    setCurrentUser(user);
    loadFeedback();
  }, [navigate]);

  const loadFeedback = () => {
    const feedback = JSON.parse(localStorage.getItem("feedbackData")) || [];
    setAllFeedback(feedback);
    setFilteredFeedback(feedback);
  };

  useEffect(() => {
    let filtered = allFeedback;
    
    if (filterCourse) {
      filtered = filtered.filter(fb => fb.course === filterCourse);
    }
    
    if (filterRating) {
      filtered = filtered.filter(fb => fb.rating === parseInt(filterRating));
    }
    
    setFilteredFeedback(filtered);
  }, [filterCourse, filterRating, allFeedback]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const getAverageRating = (course = null) => {
    const relevantFeedback = course 
      ? allFeedback.filter(fb => fb.course === course)
      : allFeedback;
    
    if (relevantFeedback.length === 0) return 0;
    
    const sum = relevantFeedback.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / relevantFeedback.length).toFixed(1);
  };

  const getCourseStats = () => {
    const stats = {};
    courses.forEach(course => {
      const courseFeedback = allFeedback.filter(fb => fb.course === course);
      stats[course] = {
        count: courseFeedback.length,
        avgRating: getAverageRating(course)
      };
    });
    return stats;
  };

  const courseStats = getCourseStats();

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, Admin!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <div className="stat-card">
          <h3>Total Feedback</h3>
          <p className="stat-number">{allFeedback.length}</p>
        </div>
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p className="stat-number">{getAverageRating()}/5</p>
        </div>
        <div className="stat-card">
          <h3>Courses</h3>
          <p className="stat-number">{courses.length}</p>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="course-stats">
        <h2>Course Statistics</h2>
        <div className="course-grid">
          {courses.map(course => (
            <div key={course} className="course-stat-card">
              <h4>{course}</h4>
              <p>Feedback: {courseStats[course].count}</p>
              <p>Avg Rating: {courseStats[course].avgRating}/5</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <h2>Filter Feedback</h2>
        <div className="filter-controls">
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          
          <select 
            value={filterRating} 
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="feedback-section">
        <h2>All Feedback ({filteredFeedback.length})</h2>
        {filteredFeedback.length === 0 ? (
          <p>No feedback found.</p>
        ) : (
          <div className="admin-feedback-list">
            {filteredFeedback.map((fb) => (
              <div key={fb.id} className="admin-feedback-card">
                <div className="feedback-header">
                  <h3>{fb.course}</h3>
                  <span className="rating">{"⭐".repeat(fb.rating)}</span>
                </div>
                <p><strong>Student:</strong> {fb.studentName}</p>
                <p><strong>Faculty:</strong> {fb.facultyName}</p>
                <p><strong>Date:</strong> {fb.date}</p>
                {fb.comments && (
                  <div className="comments">
                    <strong>Comments:</strong>
                    <p>{fb.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;