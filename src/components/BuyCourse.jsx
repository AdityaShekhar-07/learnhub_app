import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import ThemeToggle from './ThemeToggle.jsx';
import './BuyCourse.css';

function BuyCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  const [loading, setLoading] = useState(false);

  if (!course) {
    navigate('/student-dashboard');
    return null;
  }

  const basePrice = parseFloat(course.price);
  const gst = basePrice * 0.18; // 18% GST
  const totalPrice = basePrice + gst;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login to purchase');
        return;
      }

      // Create purchase record
      const purchaseRef = doc(collection(db, 'purchases'));
      await setDoc(purchaseRef, {
        userId: user.uid,
        courseId: course.id,
        courseName: course.title,
        instructorName: course.instructorName,
        basePrice: basePrice,
        gst: gst,
        totalPrice: totalPrice,
        purchaseDate: new Date(),
        paymentStatus: 'pending'
      });

      // For now, simulate successful payment
      alert('Course purchased successfully!');
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buy-course">
      <ThemeToggle />
      <div className="buy-container">
        <button className="back-btn" onClick={() => navigate('/student-dashboard')}>
          ← Back to Courses
        </button>
        
        <div className="course-summary">
          <h2>Course Purchase</h2>
          <div className="course-info">
            <h3>{course.title}</h3>
            <p>Instructor: {course.instructorName}</p>
            <p>{course.description}</p>
          </div>
        </div>

        <div className="price-breakdown">
          <h3>Price Breakdown</h3>
          <div className="price-row">
            <span>Course Price:</span>
            <span>₹{basePrice.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>GST (18%):</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span>Total Amount:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-section">
          <h3>Payment Details</h3>
          <p className="payment-note">
            Secure payment processing will be integrated with Razorpay
          </p>
          <button 
            className="purchase-btn" 
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyCourse;