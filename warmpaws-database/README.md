# WarmPaws Database

MongoDB database models and configuration for the WarmPaws application.

## 📁 Structure

```
warmpaws-database/
├── models/           # MongoDB Mongoose models
│   ├── User.js       # User schema and model
│   ├── Service.js    # Service schema and model
│   ├── Listing.js    # Pet listing schema and model
│   └── Order.js      # Order schema and model
├── config/           # Database configuration
│   └── database.js   # MongoDB connection setup
├── scripts/          # Database utilities
│   └── seedDatabase.js # Sample data seeder
├── .env.example      # Environment variables template
├── package.json      # Database dependencies
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- MongoDB installed and running locally
- Node.js (v16 or higher)

### Setup

1. **Install dependencies:**
   ```bash
   cd warmpaws-database
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

3. **Seed database with sample data:**
   ```bash
   npm run seed
   ```

## 🗃️ Database Models

### User Model
- Email, password, name, role
- Profile information and verification status
- Password hashing with bcrypt

### Service Model
- Service details, pricing, and availability
- Provider information and ratings
- Categories and scheduling

### Listing Model
- Pet listings and supplies
- Owner information and contact details
- Images, specifications, and metadata

### Order Model
- Order tracking and status management
- Payment information and delivery details
- Reviews and ratings

## 📊 Sample Data

The seeder creates:
- **1 Admin user** (admin@warmpaws.com / admin123)
- **1 Service provider** (provider@warmpaws.com / provider123)  
- **5 Regular users** (user1@warmpaws.com to user5@warmpaws.com / user123)
- **5 Sample services** (various pet care services)
- **5 Sample listings** (pets and pet supplies)

## 🔧 Configuration

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/warmpaws
DB_NAME=warmpaws
NODE_ENV=development
```

### Connection Options
- Automatic reconnection
- Graceful shutdown handling
- Connection event logging
- Error handling

## 🏗️ Integration with Backend

The backend server imports these models to replace mock data with real database operations:

```javascript
// In backend routes
import User from '../../warmpaws-database/models/User.js';
import Service from '../../warmpaws-database/models/Service.js';
import Listing from '../../warmpaws-database/models/Listing.js';
import Order from '../../warmpaws-database/models/Order.js';
import connectDB from '../../warmpaws-database/config/database.js';
```

## 🔍 Database Features

- **Indexing** for fast searches
- **Text search** on service names and descriptions
- **Relationships** between users, services, and orders
- **Data validation** with Mongoose schemas
- **Automatic timestamps** (createdAt, updatedAt)

## 🛡️ Security

- Password hashing with bcrypt
- Input validation and sanitization
- Connection security
- Error handling without data exposure

---

**Ready for production deployment!** 🚀