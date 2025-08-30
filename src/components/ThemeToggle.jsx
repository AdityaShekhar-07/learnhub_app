import { useTheme } from '../context/ThemeContext.jsx';
import './ThemeToggle.css';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {isDark ? '🌑' : '☀️'}
    </button>
  );
}

export default ThemeToggle;