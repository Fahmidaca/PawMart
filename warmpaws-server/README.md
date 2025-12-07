# WarmPaws Backend Server

A Node.js/Express backend server for the WarmPaws pet services application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Environment Setup
1. Copy `.env` file and configure your environment variables
2. Update JWT_SECRET with a strong secret key for production

### Running the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order

## 🛠️ Technology Stack

- **Framework**: Express.js
- **Database**: MongoDB (configurable)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Validator.js
- **File Upload**: Multer

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization

## 📁 Project Structure

```
warmpaws-server/
├── routes/           # API route handlers
│   ├── auth.js       # Authentication routes
│   ├── services.js   # Services management
│   ├── listings.js   # Listings management
│   └── orders.js     # Orders management
├── uploads/          # File upload directory
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
├── server.js         # Main server file
└── README.md         # This file
```

## 🌐 CORS Configuration

The server is configured to accept requests from:
- `http://localhost:5173` (development)
- Configurable via `CLIENT_URL` environment variable

## 🔧 Environment Variables

```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment
CLIENT_URL=http://localhost:5173  # Frontend URL
JWT_SECRET=your-secret-key   # JWT signing secret
```

## 📝 Example API Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get Services
```bash
curl http://localhost:5000/api/services
```

## 🚨 Important Notes

- This is a development server with mock data
- For production, configure MongoDB connection
- Update JWT_SECRET with a strong secret key
- Configure proper CORS origins for production
- Add proper error handling and logging
- Implement rate limiting based on your needs

## 🔄 Development

The server includes hot reloading in development mode using nodemon. Changes to files will automatically restart the server.

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Server logs are output to console
- Error handling middleware included

---

**Happy Coding! 🐾**