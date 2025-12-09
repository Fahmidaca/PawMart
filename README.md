# 🐾 PawMart - Pet Adoption & Supply Portal

A comprehensive full-stack pet adoption and supply marketplace built with React, Node.js, and Firebase.

## 🚀 Live Demo

- **Frontend**: [https://poetic-blancmange-cfdeec.netlify.app](https://poetic-blancmange-cfdeec.netlify.app)
- **Backend**: Coming Soon

## 📋 Features

### 🏠 Pet Adoption Portal
- Browse pets available for adoption
- Advanced search and filtering
- Pet profiles with detailed information
- Adoption application system

### 🛒 Supply Marketplace
- Pet food and nutrition products
- Accessories (toys, collars, leashes)
- Care products (grooming, health)
- Seller marketplace

### 🏥 Health & Medical
- Pet health dashboard
- Vaccination scheduling
- Medical consultation booking
- Health record tracking

### 👥 Community
- Connect with pet owners
- Success stories
- Expert advice
- Community forums

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- **Firebase Auth** - Authentication service
- **Swiper** - Image sliders and carousels
- **AOS** - Scroll animations
- **Framer Motion** - Advanced animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin** - Firebase Admin SDK
- **MongoDB** - NoSQL database
- **Nodemailer** - Email service
- **Twilio** - SMS notifications

### Database
- **Firebase Firestore** - NoSQL document database
- **MongoDB** - Alternative database option
- **Firebase Storage** - File storage

## 📁 Project Structure

```
PawMart/
├── 📁 frontend/                 # React Frontend Application
│   ├── 📁 src/                  # Source code
│   ├── 📁 public/               # Static assets
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js          # Vite configuration
│
├── 📁 warmpaws-server/          # Express.js Backend API
│   ├── 📁 routes/              # API routes
│   ├── 📁 middleware/          # Authentication & authorization
│   ├── 📁 services/            # Business logic services
│   ├── 📁 database/            # Database configuration
│   ├── server.js               # Main server file
│   └── package.json            # Backend dependencies
│
├── 📁 warmpaws-database/        # Database Schema & Scripts
│   ├── 📁 models/              # Database models
│   ├── 📁 scripts/             # Database initialization scripts
│   ├── 📁 config/              # Database configuration
│   └── README.md               # Database documentation
│
└── 📄 README.md                # Main project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Fahmidaca/PawMart.git
cd PawMart
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure Firebase**
Edit `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

5. **Start development server**
```bash
npm run dev
```

6. **Open browser**
Visit `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory**
```bash
cd warmpaws-server
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure backend**
Edit `.env` with your Firebase Admin credentials:
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
MONGODB_URI=mongodb://localhost:27017/pawmart
JWT_SECRET=your_jwt_secret
```

5. **Start backend server**
```bash
npm run dev
```

## 🔧 Development

### Frontend Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Backend Commands
```bash
npm run dev        # Start development server
npm start          # Start production server
npm run test       # Run tests
```

## 🗄️ Database Setup

### Firebase Firestore
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Set up security rules
4. Configure authentication providers

### MongoDB (Optional)
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `pawmart`
3. Configure connection string in backend `.env`

## 🚀 Deployment

### Frontend Deployment (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in Netlify dashboard

### Backend Deployment Options
- **Heroku**: Connect repository and deploy
- **Railway**: Connect repository and deploy
- **Render**: Connect repository and deploy
- **DigitalOcean**: Use App Platform

## 🔐 Environment Variables

### Frontend (.env.local)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Backend (.env)
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
MONGODB_URI=mongodb://localhost:27017/pawmart
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## 📊 Features Implemented

### ✅ Core Features
- [x] User Authentication (Email/Password)
- [x] Pet Adoption Portal
- [x] Supply Marketplace
- [x] Health Dashboard
- [x] Medical Consultation
- [x] Community Features
- [x] Responsive Design
- [x] Multi-language Support (EN/BN)
- [x] Dark/Light Theme

### 🔄 In Progress
- [ ] Google Sign-In (requires domain authorization)
- [ ] Real-time Chat
- [ ] Video Consultations
- [ ] Payment Integration

### 📅 Planned
- [ ] Mobile App (React Native)
- [ ] Admin Dashboard
- [ ] Advanced Analytics
- [ ] Social Media Integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React application and UI/UX
- **Backend Developer**: API development and database management
- **DevOps Engineer**: Deployment and infrastructure
- **UI/UX Designer**: User interface and experience design

## 📞 Support

For support, email support@pawmart.com or create an issue on GitHub.

## 🙏 Acknowledgments

- Firebase for authentication and database services
- Netlify for frontend hosting
- Tailwind CSS for styling framework
- React community for amazing libraries and tools
