import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './InstructorDashboard.css';

function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const { getCoursesFromStorage } = await import('../utils/courseStorage');
      const allCourses = getCoursesFromStorage();
      const instructorCourses = allCourses.filter(course => course.instructorId === user.uid);
      setCourses(instructorCourses);

      // Get enrollments from localStorage
      const enrollmentsData = JSON.parse(localStorage.getItem('purchases') || '[]');
      const courseIds = instructorCourses.map(course => course.id);
      const instructorEnrollments = enrollmentsData.filter(enrollment => 
        courseIds.includes(enrollment.courseId)
      );
      setEnrollments(instructorEnrollments);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="instructor-dashboard">
      <ThemeToggle />
      <header className="dashboard-header">
        <h1>LearnHub Instructor</h1>
        <div className="header-actions">
          <span>Welcome, Instructor!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'courses' ? 'active' : ''}
          onClick={() => setActiveTab('courses')}
        >
          My Courses ({courses.length})
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          Create Course
        </button>
        <button 
          className={activeTab === 'enrollments' ? 'active' : ''}
          onClick={() => setActiveTab('enrollments')}
        >
          Enrollments ({enrollments.length})
        </button>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'courses' && (
          <div className="courses-section">
            <h2>My Courses</h2>
            {courses.length === 0 ? (
              <p className="no-data">No courses created yet.</p>
            ) : (
              <div className="courses-grid">
                {courses.map(course => (
                  <div key={course.id} className="instructor-course-card">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-stats">
                      <span>Price: ₹{course.price}</span>
                      <span>Students: {enrollments.filter(e => e.courseId === course.id).length}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <CreateCourseForm onCourseCreated={fetchInstructorData} />
        )}

        {activeTab === 'enrollments' && (
          <div className="enrollments-section">
            <h2>Course Enrollments</h2>
            {enrollments.length === 0 ? (
              <p className="no-data">No enrollments yet.</p>
            ) : (
              <div className="enrollments-list">
                {enrollments.map(enrollment => (
                  <div key={enrollment.id} className="enrollment-card">
                    <h4>{enrollment.courseName}</h4>
                    <p>Student ID: {enrollment.userId}</p>
                    <p>Purchase Date: {enrollment.purchaseDate?.toDate().toLocaleDateString()}</p>
                    <p>Amount: ₹{enrollment.totalPrice}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function CreateCourseForm({ onCourseCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: 'Beginner'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) return;

      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        instructorId: user.uid,
        instructorName: user.displayName || user.email,
        students: 0
      };

      const { addCourse } = await import('../utils/courseStorage');
      await addCourse(courseData);

      alert('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        duration: '',
        level: 'Beginner'
      });
      onCourseCreated();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-section">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit} className="course-form">
        <input
          type="text"
          placeholder="Course Title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Course Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Duration (e.g., 4 weeks)"
          value={formData.duration}
          onChange={(e) => setFormData({...formData, duration: e.target.value})}
          required
        />
        <select
          value={formData.level}
          onChange={(e) => setFormData({...formData, level: e.target.value})}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}

export default InstructorDashboard;