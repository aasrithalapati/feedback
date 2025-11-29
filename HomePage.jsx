import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [facultyName, setFacultyName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feedback");

  const courses = [
    "AI Basics",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "Web Development",
    "Database Management",
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      navigate("/");
    } else {
      setCurrentUser(user);
      initializeSampleFeedback();
    }
  }, [navigate]);

  const initializeSampleFeedback = () => {
    const existingFeedback = localStorage.getItem("feedbackData");
    if (!existingFeedback) {
      const sampleFeedback = [
        {
          id: 1,
          studentName: "John Doe",
          studentEmail: "john@student.edu",
          facultyName: "Dr. Sarah Wilson",
          course: "AI Basics",
          rating: 5,
          comments:
            "Excellent course! Dr. Wilson explains complex concepts very clearly.",
          date: new Date().toLocaleDateString(),
        },
        {
          id: 2,
          studentName: "Jane Smith",
          studentEmail: "jane@student.edu",
          facultyName: "Prof. Michael Brown",
          course: "Machine Learning",
          rating: 4,
          comments: "Good course content, but could use more practical examples.",
          date: new Date().toLocaleDateString(),
        },
        {
          id: 3,
          studentName: "Mike Johnson",
          studentEmail: "mike@student.edu",
          facultyName: "Dr. Emily Davis",
          course: "Deep Learning",
          rating: 5,
          comments: "Amazing course! The hands-on projects were very helpful.",
          date: new Date().toLocaleDateString(),
        },
      ];
      localStorage.setItem("feedbackData", JSON.stringify(sampleFeedback));
    }
  };

  // ✅ Fixed handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!facultyName.trim() || !selectedCourse || rating < 1 || rating > 5) {
      alert("Please fill in all required fields correctly!");
      return;
    }

    const feedback = {
      id: Date.now(),
      studentName: `${currentUser.firstName} ${currentUser.lastName}`, // ✅ Correct template literal
      studentEmail: currentUser.email,
      facultyName,
      course: selectedCourse,
      rating,
      comments,
      date: new Date().toLocaleDateString(),
    };

    const existingFeedback = JSON.parse(localStorage.getItem("feedbackData")) || [];
    existingFeedback.push(feedback);
    localStorage.setItem("feedbackData", JSON.stringify(existingFeedback));

    setSubmitted(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const resetForm = () => {
    setFacultyName("");
    setSelectedCourse("");
    setRating(0);
    setComments("");
    setSubmitted(false);
  };

  const handleFacultyNameChange = (e) => setFacultyName(e.target.value);
  const handleCourseChange = (e) => setSelectedCourse(e.target.value);
  const handleRatingChange = (e) =>
    setRating(e.target.value ? parseInt(e.target.value) : 0);
  const handleCommentsChange = (e) => setComments(e.target.value);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage-container">
      {/* Header */}
      <div className="header">
        <h1>College Feedback System</h1>
        <div className="user-info">
          <span>Welcome, {currentUser.firstName}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={activeTab === "feedback" ? "tab active" : "tab"}
          onClick={() => setActiveTab("feedback")}
        >
          Submit Feedback
        </button>
        <button
          className={activeTab === "history" ? "tab active" : "tab"}
          onClick={() => setActiveTab("history")}
        >
          My Feedback
        </button>
      </div>

      {/* Content */}
      <div className="main-content">
        {activeTab === "feedback" && (
          <div className="feedback-layout">
            <div className="left-panel">
              <div className="feedback-form-container">
                {!submitted ? (
                  <form className="feedback-form" onSubmit={handleSubmit}>
                    <h2 className="feedback-title">Submit Feedback</h2>

                    <div className="form-group">
                      <label htmlFor="facultyName">Faculty Name</label>
                      <input
                        id="facultyName"
                        type="text"
                        value={facultyName}
                        onChange={handleFacultyNameChange}
                        placeholder="Enter faculty name"
                        maxLength="100"
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="courseSelect">Select Course</label>
                      <select
                        id="courseSelect"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        required
                      >
                        <option value="">--Choose a course--</option>
                        {courses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="rating">Rate the Course (1 to 5)</label>
                      <input
                        id="rating"
                        type="number"
                        value={rating || ""}
                        onChange={handleRatingChange}
                        min="1"
                        max="5"
                        placeholder="Rate 1 to 5"
                        autoComplete="off"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="comments">Comments (Optional)</label>
                      <textarea
                        id="comments"
                        value={comments}
                        onChange={handleCommentsChange}
                        placeholder="Enter your comments..."
                        maxLength="500"
                        rows="5"
                        autoComplete="off"
                      />
                      <small className="char-count">
                        {comments.length}/500 characters
                      </small>
                    </div>

                    <button type="submit" className="submit-button">
                      Submit Feedback
                    </button>
                  </form>
                ) : (
                  <div className="feedback-success">
                    <h2 className="feedback-title" style={{ color: "green" }}>
                      Thank You!
                    </h2>
                    <div className="success-details">
                      <p>
                        <strong>Faculty:</strong> {facultyName}
                      </p>
                      <p>
                        <strong>Course:</strong> {selectedCourse}
                      </p>
                      <p>
                        <strong>Rating:</strong> {"⭐".repeat(rating)} ({rating}/5)
                      </p>
                      {comments && (
                        <p>
                          <strong>Comments:</strong> {comments}
                        </p>
                      )}
                    </div>
                    <button onClick={resetForm} className="submit-button">
                      Submit Another Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="right-panel">
              <FeedbackSummary currentUser={currentUser} />
            </div>
          </div>
        )}
        {activeTab === "history" && <MyFeedback currentUser={currentUser} />}
      </div>
    </div>
  );
}

// ✅ Separate components
function FeedbackSummary({ currentUser }) {
  const allFeedback = JSON.parse(localStorage.getItem("feedbackData")) || [];
  const myFeedback = allFeedback.filter(
    (fb) => fb.studentEmail === currentUser?.email
  );

  const totalRating = myFeedback.reduce((sum, fb) => sum + fb.rating, 0);
  const averageRating =
    myFeedback.length > 0 ? (totalRating / myFeedback.length).toFixed(1) : 0;

  return (
    <div className="feedback-summary-panel">
      <h3>My Feedback Summary</h3>

      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-number">{myFeedback.length}</span>
          <span className="stat-label">Total Feedback</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{averageRating}</span>
          <span className="stat-label">Avg Rating</span>
        </div>
      </div>

      <div className="recent-feedback">
        <h4>Recent Feedback</h4>
        {myFeedback.length === 0 ? (
          <p className="no-feedback">No feedback submitted yet.</p>
        ) : (
          <div className="feedback-list-summary">
            {myFeedback
              .slice(-3)
              .reverse()
              .map((fb) => (
                <div key={fb.id} className="feedback-item-summary">
                  <div className="feedback-header-summary">
                    <span className="course-name">{fb.course}</span>
                    <span className="rating-display">
                      {"⭐".repeat(fb.rating)}
                    </span>
                  </div>
                  <p className="faculty-name">{fb.facultyName}</p>
                  {fb.comments && (
                    <p className="comment-preview">
                      "
                      {fb.comments.length > 50
                        ? fb.comments.substring(0, 50) + "..."
                        : fb.comments}
                      "
                    </p>
                  )}
                  <span className="feedback-date">{fb.date}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MyFeedback({ currentUser }) {
  const allFeedback = JSON.parse(localStorage.getItem("feedbackData")) || [];
  const myFeedback = allFeedback.filter(
    (fb) => fb.studentEmail === currentUser?.email
  );

  return (
    <div className="feedback-history-container">
      <h2 className="feedback-title">My Feedback History</h2>
      {myFeedback.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <div className="feedback-list">
          {myFeedback.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <div className="feedback-card-header">
                <h3>{fb.course}</h3>
                <span className="rating-stars">
                  {"⭐".repeat(fb.rating)} ({fb.rating}/5)
                </span>
              </div>
              <p>
                <strong>Faculty:</strong> {fb.facultyName}
              </p>
              <p>
                <strong>Date:</strong> {fb.date}
              </p>
              {fb.comments && (
                <div className="comments-section">
                  <strong>Comments:</strong>
                  <p className="comment-text">{fb.comments}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;