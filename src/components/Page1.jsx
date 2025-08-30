import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './Page1.css';

function Page1() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <ThemeToggle />
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="website-name">LearnHub</h1>
          <p className="tagline">Empowering Education Through Technology</p>
          <p className="description">
            Connect with expert instructors, discover amazing courses, and unlock your potential. 
            Join thousands of learners transforming their careers with cutting-edge skills.
          </p>
          <button 
            className="get-started-btn"
            onClick={() => navigate('/signin-options')}
          >
            Start Learning Today
          </button>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">📚 1000+ Courses</div>
          <div className="floating-card card-2">👨‍🏫 Expert Instructors</div>
          <div className="floating-card card-3">🎓 Learn Anywhere</div>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Why Choose LearnHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Learning</h3>
            <p>Accelerate your skills with our structured learning paths and interactive content.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Expert Content</h3>
            <p>Learn from industry professionals with real-world experience and proven expertise.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Flexible Schedule</h3>
            <p>Study at your own pace, anytime, anywhere. Perfect for busy professionals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page1;