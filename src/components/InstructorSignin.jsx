import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './Auth.css';

function InstructorSignin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userRole = users[userCredential.user.uid]?.role;
      
      if (userRole === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        await signOut(auth);
        alert('This account is not registered as an instructor. Please use student login.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <form className="auth-form" onSubmit={handleSignin}>
        <h2>Instructor Sign In</h2>
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
        <button type="submit">Sign In</button>
        <p>
          Don't have an account? 
          <span onClick={() => navigate('/instructor-signup')}> Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default InstructorSignin;