import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './SigninOptions.css';

function SigninOptions() {
  const navigate = useNavigate();

  return (
    <div className="signin-options">
      <ThemeToggle />
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
      <div className="options-container">
        <h2>Choose Your Role</h2>
        <div className="options">
          <div className="option-card" onClick={() => navigate('/student-signin')}>
            <h3>Student</h3>
            <p>Browse and purchase courses</p>
          </div>
          <div className="option-card" onClick={() => navigate('/instructor-signin')}>
            <h3>Instructor</h3>
            <p>Create and sell courses</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SigninOptions;