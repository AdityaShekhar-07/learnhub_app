import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './Auth.css';

function StudentSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Save user data
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[userCredential.user.uid] = {
        name: formData.name,
        email: formData.email,
        role: 'student',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify(users));
      
      // Save profile data
      const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
      profiles[userCredential.user.uid] = {
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        profilePhoto: ''
      };
      localStorage.setItem('profiles', JSON.stringify(profiles));
      
      navigate('/student-dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Student Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
        
        <div className="form-row">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <button type="submit">Create Account</button>
        <p>
          Already have an account? 
          <span onClick={() => navigate('/student-signin')}> Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default StudentSignup;