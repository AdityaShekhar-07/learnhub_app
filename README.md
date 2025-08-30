# LearnHub - Online Learning Platform

A modern, responsive online learning platform built with React and Firebase.

## 🚀 Features

- **User Authentication**: Secure login/signup with Firebase Auth
- **Course Browsing**: Browse 30+ courses across 6 categories
- **Advanced Filtering**: Filter by category, difficulty level, and price
- **Shopping Cart**: Add courses to cart and checkout
- **Payment Integration**: Secure payment processing with promo codes
- **User Dashboard**: Track progress, certificates, and profile management
- **Dark/Light Theme**: Toggle between themes with persistent settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, CSS3
- **Backend**: Firebase (Auth, Firestore)
- **Deployment**: Vercel
- **Styling**: Custom CSS with modern design patterns

## 📱 Course Categories

1. **Web Development** - React, Node.js, JavaScript, HTML/CSS
2. **Data Science** - Python, Machine Learning, Data Visualization
3. **Digital Marketing** - SEO, Social Media, Email Marketing
4. **Mobile Development** - React Native, Flutter, iOS, Android
5. **Cloud Computing** - AWS, Azure, Google Cloud, DevOps
6. **Cybersecurity** - Ethical Hacking, Network Security, Cryptography

## 🎯 Key Features

### Student Dashboard
- Browse and filter courses
- Shopping cart functionality
- Course progress tracking
- Certificate management
- Profile customization

### Course Management
- Detailed course previews
- Instructor information
- Course contents (videos, notes, projects, certificates)
- Pricing with discount system

### Payment System
- Secure checkout process
- Promo code support ("FIRSTFREE" for free courses)
- Multiple payment options
- Order confirmation

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/learnhub.git
cd learnhub
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Copy your Firebase config

4. Create environment file
```bash
# Create .env file in root directory
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Start development server
```bash
npm run dev
```

## 📦 Deployment

### Deploy to Vercel

1. Install Vercel CLI
```bash
npm i -g vercel
```

2. Deploy
```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 🎨 Design Features

- **Modern UI**: Clean, professional interface inspired by Google's Material Design
- **Color Scheme**: Blue, red, yellow, black, white palette with green for payments
- **Responsive Grid**: 3-column course layout on desktop
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: High contrast colors and keyboard navigation

## 🔧 Environment Variables

Required environment variables for Firebase:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email support@learnhub.com or create an issue on GitHub.

---

Built with ❤️ using React and Firebase