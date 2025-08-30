import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import ThemeToggle from './ThemeToggle.jsx';
import './StudentDashboard.css';

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [myCourses, setMyCourses] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    city: '',
    state: '',
    profilePhoto: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchUserName();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setProfileData(prev => ({
          ...prev,
          email: user.email
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserName = () => {
    const user = auth.currentUser;
    if (user) {
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userData = users[user.uid];
      if (userData && userData.name) {
        setUserName(userData.name);
      }
      
      // Load profile data
      const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      const userProfile = profiles[user.uid] || {};
      setProfileData({
        name: userData?.name || '',
        email: user.email,
        phone: userProfile.phone || '',
        school: userProfile.school || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        profilePhoto: userProfile.profilePhoto || ''
      });
      
      // Fetch user's purchased courses
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      const userPurchases = purchases.filter(p => p.userId === user.uid);
      setMyCourses(userPurchases);
    }
  };

  const saveProfile = () => {
    const user = auth.currentUser;
    if (user) {
      const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      profiles[user.uid] = {
        phone: profileData.phone,
        school: profileData.school,
        city: profileData.city,
        state: profileData.state,
        profilePhoto: profileData.profilePhoto
      };
      localStorage.setItem('profiles', JSON.stringify(profiles));
      
      // Update name in users collection
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[user.uid]) {
        users[user.uid].name = profileData.name;
        localStorage.setItem('users', JSON.stringify(users));
        setUserName(profileData.name);
      }
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  const fetchCourses = async () => {
    try {
      const { getCoursesFromStorage } = await import('../utils/courseStorage');
      const coursesData = getCoursesFromStorage();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleBuyCourse = (course) => {
    navigate('/buy-course', { state: { course } });
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'my-courses':
        return (
          <div className="tab-content">
            <h2>My Courses</h2>
            <div className="courses-grid">
              {myCourses.length === 0 ? (
                <p className="no-courses">You haven't purchased any courses yet.</p>
              ) : (
                myCourses.map(purchase => (
                  <div key={purchase.id} className="my-course-card">
                    <h3>{purchase.courseName}</h3>
                    <p>Instructor: {purchase.instructorName}</p>
                    <p>Purchased: {new Date(purchase.purchaseDate?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                    <button className="continue-btn">Continue Learning</button>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="tab-content">
            <h2>My Progress</h2>
            <div className="progress-grid">
              {myCourses.map(course => (
                <div key={course.id} className="progress-card">
                  <h3>{course.courseName}</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '65%'}}></div>
                  </div>
                  <p>65% Complete</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'certificates':
        return (
          <div className="tab-content">
            <h2>My Certificates</h2>
            <div className="certificates-grid">
              <div className="certificate-card">
                <div className="certificate-icon">🏆</div>
                <h3>JavaScript Fundamentals</h3>
                <p>Completed on: March 15, 2024</p>
                <button className="download-btn">Download Certificate</button>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="tab-content">
            <h2>My Profile</h2>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-photo">
                  {profileData.profilePhoto ? (
                    <img src={profileData.profilePhoto} alt="Profile" />
                  ) : (
                    <div className="photo-placeholder">👤</div>
                  )}
                </div>
                <div className="profile-stats">
                  <p>Courses Enrolled: {myCourses.length}</p>
                  <p>Certificates Earned: 1</p>
                  <p>Role: Student</p>
                </div>
              </div>
              
              {isEditing ? (
                <div className="profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>School/University</label>
                    <input
                      type="text"
                      value={profileData.school}
                      onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                      placeholder="Enter school or university"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={profileData.state}
                        onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Profile Photo URL</label>
                    <input
                      type="url"
                      value={profileData.profilePhoto}
                      onChange={(e) => setProfileData({...profileData, profilePhoto: e.target.value})}
                      placeholder="Enter photo URL"
                    />
                  </div>
                  <div className="form-actions">
                    <button className="save-btn" onClick={saveProfile}>Save Changes</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <strong>Name:</strong> {profileData.name || 'Not provided'}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {profileData.email}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {profileData.phone || 'Not provided'}
                  </div>
                  <div className="detail-item">
                    <strong>School/University:</strong> {profileData.school || 'Not provided'}
                  </div>
                  <div className="detail-item">
                    <strong>City:</strong> {profileData.city || 'Not provided'}
                  </div>
                  <div className="detail-item">
                    <strong>State:</strong> {profileData.state || 'Not provided'}
                  </div>
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
              )}
              
              <div className="profile-actions">
                <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="tab-content">
            <h2>Settings</h2>
            <div className="settings-card">
              <div className="setting-item">
                <h3>Theme</h3>
                <ThemeToggle />
              </div>
              <div className="setting-item">
                <h3>Notifications</h3>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <h3>Email Updates</h3>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="tab-content">
            <h2>Available Courses</h2>
            <div className="courses-grid">
              {courses.length === 0 ? (
                <p className="no-courses">No courses available yet.</p>
              ) : (
                courses.map(course => (
                  <CourseCard 
                    key={course.id} 
                    course={course} 
                    onBuy={() => handleBuyCourse(course)}
                  />
                ))
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>LearnHub</h1>
        <nav className="student-nav">
          <button 
            className={activeTab === 'browse' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('browse')}
          >
            Browse Courses
          </button>
          <button 
            className={activeTab === 'my-courses' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('my-courses')}
          >
            My Courses
          </button>
          <button 
            className={activeTab === 'progress' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('progress')}
          >
            My Progress
          </button>
          <button 
            className={activeTab === 'certificates' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('certificates')}
          >
            My Certificates
          </button>
          <button 
            className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button 
            className={activeTab === 'settings' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
        <div className="header-actions">
          <span>Hello, {userName || 'Student'}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default StudentDashboard;