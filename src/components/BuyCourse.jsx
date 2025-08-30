import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import ThemeToggle from './ThemeToggle.jsx';
import './BuyCourse.css';

function BuyCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course, courses, totalAmount } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [discount, setDiscount] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  const isCartCheckout = courses && courses.length > 0;
  const itemsToProcess = isCartCheckout ? courses : [course];
  
  if (!course && !isCartCheckout) {
    navigate('/student-dashboard');
    return null;
  }
  
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const profiles = JSON.parse(localStorage.getItem('profiles') || '{}');
        const userData = users[user.uid] || {};
        const userProfile = profiles[user.uid] || {};
        
        setAddress({
          fullName: userData.name || '',
          email: user.email || '',
          phone: userProfile.phone || '',
          addressLine1: '',
          addressLine2: '',
          city: userProfile.city || '',
          state: userProfile.state || '',
          pincode: ''
        });
      }
    };
    loadUserData();
  }, []);

  const calculateTotal = () => {
    const basePrice = isCartCheckout ? totalAmount : parseFloat(course.price);
    const discountAmount = basePrice * (discount / 100);
    const discountedPrice = basePrice - discountAmount;
    const gst = discountedPrice * 0.18;
    return { basePrice, discountAmount, discountedPrice, gst, totalPrice: discountedPrice + gst };
  };
  
  const { basePrice, discountAmount, discountedPrice, gst, totalPrice } = calculateTotal();
  
  const handlePromoCode = () => {
    setPromoMessage('');
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      return;
    }
    
    // For demo purposes, all promo codes are unavailable
    setPromoMessage('Promo code is currently unavailable');
    setDiscount(0);
  };

  const generateUPIQR = () => {
    if (!upiId.trim()) {
      alert('Please enter UPI ID first');
      return;
    }
    setShowQR(true);
  };

  const simulatePayment = () => {
    setLoading(true);
    setPaymentStatus('');
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        setPaymentStatus('success');
        setTimeout(() => {
          completePayment();
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setLoading(false);
      }
    }, 3000);
  };

  const completePayment = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login to purchase');
        return;
      }

      // Save purchases to localStorage
      const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
      
      itemsToProcess.forEach(item => {
        purchases.push({
          id: Date.now() + Math.random(),
          userId: user.uid,
          courseId: item.id,
          courseName: item.title,
          instructorName: item.instructorName,
          basePrice: item.price,
          purchaseDate: new Date(),
          paymentStatus: 'completed',
          paymentMethod: paymentMethod,
          upiId: paymentMethod === 'upi' ? upiId : undefined,
          address: address
        });
      });
      
      localStorage.setItem('purchases', JSON.stringify(purchases));
      
      // Clear cart if it was a cart checkout
      if (isCartCheckout) {
        localStorage.setItem(`cart_${user.uid}`, JSON.stringify([]));
      }

      setTimeout(() => {
        navigate('/student-dashboard');
      }, 1000);
    } catch (error) {
      console.error('Purchase error:', error);
      setPaymentStatus('failed');
      setLoading(false);
    }
  };

  const handleAddressSubmit = () => {
    if (!address.fullName || !address.email || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      alert('Please fill all required fields');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    
    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        alert('Please enter your UPI ID');
        return;
      }
      if (!showQR) {
        alert('Please generate QR code first');
        return;
      }
      simulatePayment();
      return;
    }
    
    // For non-UPI payments, complete directly
    setLoading(true);
    await completePayment();
  };

  return (
    <div className="buy-course">
      <ThemeToggle />
      <div className="buy-container">
        <button className="back-btn" onClick={() => navigate('/student-dashboard')}>
          ← Back to Dashboard
        </button>
        
        <div className="checkout-header">
          <h2>{isCartCheckout ? 'Checkout' : 'Course Purchase'}</h2>
          <div className="step-indicator">
            <div className={step >= 1 ? 'step active' : 'step'}>1. Address</div>
            <div className={step >= 2 ? 'step active' : 'step'}>2. Payment</div>
          </div>
        </div>

        {step === 1 && (
          <div className="address-section">
            <h3>Billing Address</h3>
            <div className="address-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={address.fullName}
                  onChange={(e) => setAddress({...address, fullName: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={address.email}
                  onChange={(e) => setAddress({...address, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Address Line 1 *"
                value={address.addressLine1}
                onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                value={address.addressLine2}
                onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
              />
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City *"
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="State *"
                  value={address.state}
                  onChange={(e) => setAddress({...address, state: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="PIN Code *"
                  value={address.pincode}
                  onChange={(e) => setAddress({...address, pincode: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="order-summary">
              <h3>Order Summary</h3>
              {itemsToProcess.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.title}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div className="promo-section">
                <h4>Have a Promo Code?</h4>
                <div className="promo-input">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button className="apply-promo-btn" onClick={handlePromoCode}>
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <div className="promo-message">
                    {promoMessage}
                  </div>
                )}
              </div>
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal:</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="price-row discount">
                    <span>Discount ({discount}%):</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="price-row">
                  <span>GST (18%):</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button className="continue-btn" onClick={handleAddressSubmit}>
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="payment-section">
            <h3>Select Payment Method</h3>
            <div className="payment-methods">
              <div className="payment-option">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  value="card"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="card">
                  <div className="payment-icon">💳</div>
                  <div>
                    <h4>Debit/Credit Card</h4>
                    <p>Visa, Mastercard, RuPay</p>
                  </div>
                </label>
              </div>
              
              <div className="payment-option">
                <input
                  type="radio"
                  id="netbanking"
                  name="payment"
                  value="netbanking"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="netbanking">
                  <div className="payment-icon">🏦</div>
                  <div>
                    <h4>Net Banking</h4>
                    <p>All major banks supported</p>
                  </div>
                </label>
              </div>
              
              <div className="payment-option">
                <input
                  type="radio"
                  id="upi"
                  name="payment"
                  value="upi"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="upi">
                  <div className="payment-icon">📱</div>
                  <div>
                    <h4>UPI</h4>
                    <p>PhonePe, Google Pay, Paytm</p>
                  </div>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'upi' && (
              <div className="upi-details">
                <h4>UPI Payment</h4>
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g., yourname@paytm)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="upi-input"
                />
                <button className="generate-qr-btn" onClick={generateUPIQR}>
                  Generate QR Code
                </button>
                
                {showQR && (
                  <div className="qr-section">
                    <h5>Scan QR Code to Pay</h5>
                    <div className="qr-code">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=LearnHub&am=${totalPrice.toFixed(2)}&cu=INR`}
                        alt="UPI QR Code"
                      />
                    </div>
                    <p className="qr-note">Scan with any UPI app to pay ₹{totalPrice.toFixed(2)}</p>
                    <button className="simulate-payment-btn" onClick={simulatePayment}>
                      Simulate Payment
                    </button>
                  </div>
                )}
                
                {paymentStatus === 'success' && (
                  <div className="payment-message success">
                    ✅ Payment Successful! Redirecting...
                  </div>
                )}
                
                {paymentStatus === 'failed' && (
                  <div className="payment-message failed">
                    ❌ Payment Failed! Try Again
                    <button className="retry-btn" onClick={() => setPaymentStatus('')}>
                      Retry Payment
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="payment-summary">
              <div className="summary-row">
                <span>Total Amount:</span>
                <span className="amount">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="checkout-actions">
              <button className="back-step-btn" onClick={() => setStep(1)}>
                ← Back to Address
              </button>
              <button 
                className="pay-btn" 
                onClick={handlePaymentSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyCourse;