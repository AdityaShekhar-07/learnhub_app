import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Page1 from './components/Page1.jsx';
import SigninOptions from './components/SigninOptions.jsx';
import StudentSignin from './components/StudentSignin.jsx';
import StudentSignup from './components/StudentSignup.jsx';
import InstructorSignin from './components/InstructorSignin.jsx';
import InstructorSignup from './components/InstructorSignup.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import BuyCourse from './components/BuyCourse.jsx';
import InstructorDashboard from './components/InstructorDashboard.jsx';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/signin-options" element={<SigninOptions />} />
          <Route path="/student-signin" element={<StudentSignin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/instructor-signin" element={<InstructorSignin />} />
          <Route path="/instructor-signup" element={<InstructorSignup />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/buy-course" element={<BuyCourse />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;