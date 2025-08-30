import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import './Auth.css';

function StudentSignin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      const userRole = users[userCredential.user.uid]?.role;
      
      if (userRole === 'student') {
        navigate('/student-dashboard');
      } else if (userRole === 'instructor') {
        await signOut(auth);
        alert('This email address is registered as an instructor. Try a different address.');
      } else {
        await signOut(auth);
        alert('Account not found. Please sign up first.');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <ThemeToggle />
      <form className="auth-form" onSubmit={handleSignin}>
        <h2>Student Sign In</h2>
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
          <span onClick={() => navigate('/student-signup')}> Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default StudentSignin;