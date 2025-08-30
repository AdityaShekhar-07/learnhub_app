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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
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
      
      // Load cart
      const userCart = JSON.parse(localStorage.getItem(`cart_${user.uid}`) || '[]');
      setCart(userCart);
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
      // Expanded courses data with multiple courses per category
      const coursesData = [
        // Web Development
        {"id": "1", "title": "Full Stack Web Development", "description": "Master React, Node.js, and MongoDB. Build real-world projects.", "price": 1, "originalPrice": 499, "duration": "4 weeks", "level": "Intermediate", "category": "Web Development", "instructorName": "Sarah Johnson", "students": 1250, "rating": 4.8, "image": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop&auto=format"},
        {"id": "2", "title": "Frontend React Mastery", "description": "Advanced React concepts, hooks, context, and modern patterns.", "price": 1, "originalPrice": 399, "duration": "3 weeks", "level": "Advanced", "category": "Web Development", "instructorName": "Alex Thompson", "students": 890, "rating": 4.7, "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&auto=format"},
        {"id": "3", "title": "Backend Node.js Expert", "description": "Build scalable APIs with Node.js, Express, and databases.", "price": 1, "originalPrice": 449, "duration": "4 weeks", "level": "Intermediate", "category": "Web Development", "instructorName": "Maria Garcia", "students": 720, "rating": 4.6, "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&auto=format"},
        {"id": "4", "title": "JavaScript Fundamentals", "description": "Master ES6+, async programming, and modern JavaScript.", "price": 1, "originalPrice": 299, "duration": "3 weeks", "level": "Beginner", "category": "Web Development", "instructorName": "David Kim", "students": 1500, "rating": 4.9, "image": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop&auto=format"},
        {"id": "5", "title": "HTML & CSS Mastery", "description": "Responsive design, CSS Grid, Flexbox, and animations.", "price": 1, "originalPrice": 249, "duration": "2 weeks", "level": "Beginner", "category": "Web Development", "instructorName": "Sophie Chen", "students": 2000, "rating": 4.5, "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&auto=format"},
        
        // Data Science
        {"id": "6", "title": "Data Science & ML Complete", "description": "Python, pandas, scikit-learn, TensorFlow for data analysis.", "price": 1, "originalPrice": 599, "duration": "6 weeks", "level": "Advanced", "category": "Data Science", "instructorName": "Dr. Michael Chen", "students": 850, "rating": 4.9, "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format"},
        {"id": "7", "title": "Python for Data Analysis", "description": "Master pandas, NumPy, and data visualization libraries.", "price": 1, "originalPrice": 399, "duration": "4 weeks", "level": "Intermediate", "category": "Data Science", "instructorName": "Dr. Lisa Wang", "students": 1200, "rating": 4.8, "image": "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=250&fit=crop&auto=format"},
        {"id": "8", "title": "Machine Learning Algorithms", "description": "Deep dive into ML algorithms and implementation.", "price": 1, "originalPrice": 499, "duration": "5 weeks", "level": "Advanced", "category": "Data Science", "instructorName": "Prof. Robert Lee", "students": 650, "rating": 4.7, "image": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop&auto=format"},
        {"id": "9", "title": "Data Visualization Mastery", "description": "Create stunning charts with Matplotlib, Seaborn, Plotly.", "price": 1, "originalPrice": 349, "duration": "3 weeks", "level": "Intermediate", "category": "Data Science", "instructorName": "Anna Rodriguez", "students": 900, "rating": 4.6, "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&auto=format"},
        {"id": "10", "title": "Statistics for Data Science", "description": "Statistical concepts essential for data analysis.", "price": 1, "originalPrice": 299, "duration": "3 weeks", "level": "Beginner", "category": "Data Science", "instructorName": "Dr. James Miller", "students": 1100, "rating": 4.5, "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format"},
        
        // Digital Marketing
        {"id": "11", "title": "Digital Marketing Complete", "description": "SEO, SEM, social media, email marketing, and analytics.", "price": 1, "originalPrice": 449, "duration": "4 weeks", "level": "Beginner", "category": "Digital Marketing", "instructorName": "Emma Rodriguez", "students": 2100, "rating": 4.7, "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&auto=format"},
        {"id": "12", "title": "SEO Optimization Expert", "description": "Master search engine optimization and ranking strategies.", "price": 1, "originalPrice": 349, "duration": "3 weeks", "level": "Intermediate", "category": "Digital Marketing", "instructorName": "Mark Johnson", "students": 1800, "rating": 4.8, "image": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=250&fit=crop&auto=format"},
        {"id": "13", "title": "Social Media Marketing", "description": "Facebook, Instagram, LinkedIn, Twitter marketing strategies.", "price": 1, "originalPrice": 299, "duration": "3 weeks", "level": "Beginner", "category": "Digital Marketing", "instructorName": "Jessica Brown", "students": 2500, "rating": 4.6, "image": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop&auto=format"},
        {"id": "14", "title": "Google Ads Mastery", "description": "Create and optimize high-converting Google Ad campaigns.", "price": 1, "originalPrice": 399, "duration": "3 weeks", "level": "Intermediate", "category": "Digital Marketing", "instructorName": "Tom Wilson", "students": 1400, "rating": 4.7, "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop&auto=format"},
        {"id": "15", "title": "Email Marketing Pro", "description": "Build effective email campaigns and automation.", "price": 1, "originalPrice": 249, "duration": "2 weeks", "level": "Beginner", "category": "Digital Marketing", "instructorName": "Rachel Green", "students": 1600, "rating": 4.5, "image": "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=250&fit=crop&auto=format"},
        
        // Mobile Development
        {"id": "16", "title": "React Native Complete", "description": "Build iOS and Android apps with React Native.", "price": 1, "originalPrice": 499, "duration": "5 weeks", "level": "Intermediate", "category": "Mobile Development", "instructorName": "Lisa Park", "students": 980, "rating": 4.8, "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&auto=format"},
        {"id": "17", "title": "Flutter Development", "description": "Cross-platform mobile apps with Flutter and Dart.", "price": 1, "originalPrice": 449, "duration": "4 weeks", "level": "Intermediate", "category": "Mobile Development", "instructorName": "Kevin Zhang", "students": 750, "rating": 4.7, "image": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop&auto=format"},
        {"id": "18", "title": "iOS Swift Programming", "description": "Native iOS development with Swift and Xcode.", "price": 1, "originalPrice": 549, "duration": "5 weeks", "level": "Advanced", "category": "Mobile Development", "instructorName": "Sarah Kim", "students": 600, "rating": 4.9, "image": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop&auto=format"},
        {"id": "19", "title": "Android Kotlin Development", "description": "Build native Android apps with Kotlin.", "price": 1, "originalPrice": 499, "duration": "4 weeks", "level": "Intermediate", "category": "Mobile Development", "instructorName": "Mike Johnson", "students": 850, "rating": 4.6, "image": "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400&h=250&fit=crop&auto=format"},
        {"id": "20", "title": "Mobile UI/UX Design", "description": "Design beautiful and intuitive mobile interfaces.", "price": 1, "originalPrice": 349, "duration": "3 weeks", "level": "Beginner", "category": "Mobile Development", "instructorName": "Amy Chen", "students": 1200, "rating": 4.8, "image": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop&auto=format"},
        
        // Cloud Computing
        {"id": "21", "title": "AWS Cloud Complete", "description": "Master Amazon Web Services and cloud architecture.", "price": 1, "originalPrice": 599, "duration": "6 weeks", "level": "Intermediate", "category": "Cloud Computing", "instructorName": "James Wilson", "students": 750, "rating": 4.6, "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&auto=format"},
        {"id": "22", "title": "Azure Cloud Fundamentals", "description": "Microsoft Azure services and cloud solutions.", "price": 1, "originalPrice": 499, "duration": "4 weeks", "level": "Beginner", "category": "Cloud Computing", "instructorName": "Linda Davis", "students": 650, "rating": 4.5, "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&auto=format"},
        {"id": "23", "title": "Google Cloud Platform", "description": "GCP services, deployment, and cloud architecture.", "price": 1, "originalPrice": 449, "duration": "4 weeks", "level": "Intermediate", "category": "Cloud Computing", "instructorName": "Chris Lee", "students": 580, "rating": 4.7, "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop&auto=format"},
        {"id": "24", "title": "Docker & Kubernetes", "description": "Containerization and orchestration mastery.", "price": 1, "originalPrice": 399, "duration": "3 weeks", "level": "Advanced", "category": "Cloud Computing", "instructorName": "Alex Rodriguez", "students": 720, "rating": 4.8, "image": "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop&auto=format"},
        {"id": "25", "title": "DevOps Engineering", "description": "CI/CD, automation, and infrastructure as code.", "price": 1, "originalPrice": 549, "duration": "5 weeks", "level": "Advanced", "category": "Cloud Computing", "instructorName": "Robert Taylor", "students": 450, "rating": 4.9, "image": "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=250&fit=crop&auto=format"},
        
        // Cybersecurity
        {"id": "26", "title": "Cybersecurity Complete", "description": "Ethical hacking, network security, and incident response.", "price": 1, "originalPrice": 549, "duration": "5 weeks", "level": "Beginner", "category": "Cybersecurity", "instructorName": "Robert Kumar", "students": 650, "rating": 4.7, "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop&auto=format"},
        {"id": "27", "title": "Ethical Hacking & Penetration Testing", "description": "Learn to think like a hacker to protect systems.", "price": 1, "originalPrice": 499, "duration": "4 weeks", "level": "Advanced", "category": "Cybersecurity", "instructorName": "Marcus Johnson", "students": 520, "rating": 4.8, "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop&auto=format"},
        {"id": "28", "title": "Network Security Fundamentals", "description": "Secure networks, firewalls, and intrusion detection.", "price": 1, "originalPrice": 399, "duration": "3 weeks", "level": "Intermediate", "category": "Cybersecurity", "instructorName": "Diana Smith", "students": 780, "rating": 4.6, "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&auto=format"},
        {"id": "29", "title": "Cryptography & Data Protection", "description": "Encryption, digital signatures, and data security.", "price": 1, "originalPrice": 449, "duration": "4 weeks", "level": "Advanced", "category": "Cybersecurity", "instructorName": "Dr. Alan White", "students": 420, "rating": 4.9, "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=250&fit=crop&auto=format"},
        {"id": "30", "title": "Incident Response & Forensics", "description": "Handle security breaches and digital investigations.", "price": 1, "originalPrice": 399, "duration": "3 weeks", "level": "Intermediate", "category": "Cybersecurity", "instructorName": "Jennifer Brown", "students": 350, "rating": 4.5, "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&auto=format"}
      ];
      setCourses(coursesData);
      localStorage.setItem('courses', JSON.stringify(coursesData));
    } catch (error) {
      console.error('Error setting courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleReviewCourse = (course) => {
    setSelectedCourse(course);
    setShowReviewModal(true);
  };

  const handleAddToCart = (course) => {
    const user = auth.currentUser;
    if (user) {
      const isAlreadyInCart = cart.some(item => item.id === course.id);
      if (!isAlreadyInCart) {
        const updatedCart = [...cart, course];
        setCart(updatedCart);
        localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
        alert('Course added to cart!');
      } else {
        alert('Course is already in your cart!');
      }
    }
    setShowReviewModal(false);
  };

  const handleBuyCourse = (course) => {
    navigate('/buy-course', { state: { course } });
    setShowReviewModal(false);
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  const removeFromCart = (courseId) => {
    const user = auth.currentUser;
    if (user) {
      const updatedCart = cart.filter(item => item.id !== courseId);
      setCart(updatedCart);
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    const totalAmount = cart.reduce((sum, course) => sum + course.price, 0);
    navigate('/buy-course', { state: { courses: cart, totalAmount } });
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'cart':
        return (
          <div className="tab-content">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button className="browse-btn" onClick={() => setActiveTab('browse')}>Browse Courses</button>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-items">
                  {cart.map(course => (
                    <div key={course.id} className="cart-item">
                      <div className="cart-item-info">
                        <h3>{course.title}</h3>
                        <p>by {course.instructorName}</p>
                        <div className="cart-item-details">
                          <span>📅 {course.duration}</span>
                          <span>📊 {course.level}</span>
                        </div>
                      </div>
                      <div className="cart-item-price">
                        <span className="cart-original-price">₹{course.originalPrice}</span>
                        <span className="cart-current-price">₹{course.price}</span>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(course.id)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="cart-total">
                    <h3>Total: ₹{cart.reduce((sum, course) => sum + course.price, 0)}</h3>
                    <p>You save: ₹{cart.reduce((sum, course) => sum + (course.originalPrice - course.price), 0)}</p>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        );
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
                    <div className="progress-fill" style={{width: '0%'}}></div>
                  </div>
                  <p>0% Complete</p>
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
                <p>Use the floating theme button at bottom-right corner</p>
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
        const categories = ['All', 'Web Development', 'Data Science', 'Digital Marketing', 'Mobile Development', 'Cloud Computing', 'Cybersecurity'];
        const filteredCourses = selectedCategory === 'All' ? courses : courses.filter(course => course.category === selectedCategory);
        
        return (
          <div className="tab-content">
            <div className="browse-layout">
              <div className="category-sidebar">
                <h3>Categories</h3>
                {categories.map(category => (
                  <button
                    key={category}
                    className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    {category !== 'All' && (
                      <span className="course-count">
                        ({courses.filter(c => c.category === category).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="courses-content">
                <h2>{selectedCategory === 'All' ? 'All Courses' : selectedCategory}</h2>
                <div className="courses-grid">
              {filteredCourses.length === 0 ? (
                <p className="no-courses">No courses available in this category.</p>
              ) : (
                filteredCourses.map(course => (
                  <div key={course.id} className="course-card-enhanced">
                    <div className="course-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                    <div className="course-header">
                      <div className="course-category">{course.category}</div>
                      <div className="course-rating">⭐ {course.rating}</div>
                    </div>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor">by {course.instructorName}</p>
                    <p className="course-description">{course.description}</p>
                    <div className="course-details">
                      <span className="course-duration">📅 {course.duration}</span>
                      <span className="course-level">📊 {course.level}</span>
                      <span className="course-students">👥 {course.students} students</span>
                    </div>
                    <div className="course-pricing">
                      <span className="original-price">₹{course.originalPrice}</span>
                      <span className="current-price">₹{course.price}</span>
                      <span className="discount">99% OFF</span>
                    </div>
                    <div className="course-actions">
                      <button 
                        className="review-btn"
                        onClick={() => handleReviewCourse(course)}
                      >
                        Review Course
                      </button>
                      <button 
                        className="buy-btn"
                        onClick={() => handleBuyCourse(course)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))
              )}
                </div>
              </div>
            </div>
            
            {showReviewModal && selectedCourse && (
              <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
                <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>Course Review</h2>
                    <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
                  </div>
                  <div className="modal-content">
                    <div className="course-preview">
                      <div className="preview-header">
                        <div className="preview-category">{selectedCourse.category}</div>
                        <div className="preview-rating">⭐ {selectedCourse.rating}</div>
                      </div>
                      <h3>{selectedCourse.title}</h3>
                      <p className="preview-instructor">Instructor: <strong>{selectedCourse.instructorName}</strong></p>
                      <div className="preview-details">
                        <div className="detail-item">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{selectedCourse.duration}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Level:</span>
                          <span className="detail-value">{selectedCourse.level}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Students Enrolled:</span>
                          <span className="detail-value">{selectedCourse.students}</span>
                        </div>
                      </div>
                      <div className="preview-description">
                        <h4>Course Description</h4>
                        <p>{selectedCourse.description}</p>
                      </div>
                      <div className="preview-pricing">
                        <span className="preview-original-price">₹{selectedCourse.originalPrice}</span>
                        <span className="preview-current-price">₹{selectedCourse.price}</span>
                        <span className="preview-discount">99% OFF - Limited Time!</span>
                      </div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="modal-cart-btn" onClick={() => handleAddToCart(selectedCourse)}>
                      🛒 Add to Cart
                    </button>
                    <button className="modal-buy-btn" onClick={() => handleBuyCourse(selectedCourse)}>
                      Buy Now - ₹{selectedCourse.price}
                    </button>
                    <button className="modal-cancel-btn" onClick={() => setShowReviewModal(false)}>
                      Maybe Later
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="student-dashboard">
      <ThemeToggle />
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
          <div className="cart-icon" onClick={() => setActiveTab('cart')}>
            🛒 Cart ({cart.length})
          </div>
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