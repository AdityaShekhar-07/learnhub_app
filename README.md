# LearnHub - Online Learning Platform

A modern, responsive online learning platform built with React and Firebase, featuring separate dashboards for students and instructors.

## Features

### Student Features
- Browse and purchase courses
- Track learning progress
- View certificates
- Manage profile with personal details
- Dark/Light theme toggle
- Responsive design

### Instructor Features
- Create and manage courses
- View student enrollments
- Track course analytics
- Course management dashboard

### General Features
- Firebase Authentication
- Local storage for course data
- Theme persistence
- Role-based access control
- Modern UI with glassmorphism effects

## Tech Stack

- **Frontend**: React 18, Vite
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore + Local Storage
- **Styling**: CSS3 with custom animations
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AdityaShekhar-07/learnhub_app.git
cd learnhub_app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

```
learnhub_app/
├── public/
│   ├── courses.json
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth.css
│   │   ├── BuyCourse.jsx
│   │   ├── BuyCourse.css
│   │   ├── CourseCard.jsx
│   │   ├── CourseCard.css
│   │   ├── InstructorDashboard.jsx
│   │   ├── InstructorDashboard.css
│   │   ├── InstructorSignin.jsx
│   │   ├── InstructorSignup.jsx
│   │   ├── Page1.jsx
│   │   ├── Page1.css
│   │   ├── SigninOptions.jsx
│   │   ├── SigninOptions.css
│   │   ├── StudentDashboard.jsx
│   │   ├── StudentDashboard.css
│   │   ├── StudentSignin.jsx
│   │   ├── StudentSignup.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── ThemeToggle.css
│   ├── context/
│   │   └── ThemeContext.jsx
│   ├── utils/
│   │   └── courseStorage.js
│   ├── App.jsx
│   ├── firebase.js
│   └── main.jsx
├── .env
├── package.json
└── README.md
```

## Usage

### For Students
1. Sign up/Sign in as a student
2. Browse available courses
3. Purchase courses
4. Track progress in "My Progress"
5. View certificates in "My Certificates"
6. Update profile information

### For Instructors
1. Sign up/Sign in as an instructor
2. Create new courses
3. View enrolled students
4. Manage course content
5. Track course performance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Aditya Shekhar - [@AdityaShekhar-07](https://github.com/AdityaShekhar-07)

Project Link: [https://github.com/AdityaShekhar-07/learnhub_app](https://github.com/AdityaShekhar-07/learnhub_app)