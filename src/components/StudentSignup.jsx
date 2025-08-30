import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './Auth.css';

function StudentSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      users[userCredential.user.uid] = {
        name,
        email,
        role: 'student',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify(users));
      navigate('/student-dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Student Sign Up</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? 
          <span onClick={() => navigate('/student-signin')}> Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default StudentSignup;