import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import database connection
import connectDB from './database/config/database.js';

// Import routes
import servicesRoutes from './routes/services.js';
import listingsRoutes from './routes/listings.js';
import ordersRoutes from './routes/orders.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// API Routes
app.use('/api/services', servicesRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);

// Root route - API information page
app.get('/', (req, res) => {
  res.json({
    name: 'WarmPaws API Server',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to the WarmPaws Backend API',
    documentation: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      services: {
        all: 'GET /api/services',
        byId: 'GET /api/services/:id',
        create: 'POST /api/services',
        update: 'PUT /api/services/:id',
        delete: 'DELETE /api/services/:id'
      },
      listings: {
        all: 'GET /api/listings',
        byId: 'GET /api/listings/:id',
        create: 'POST /api/listings',
        update: 'PUT /api/listings/:id',
        delete: 'DELETE /api/listings/:id'
      },
      orders: {
        all: 'GET /api/orders',
        byId: 'GET /api/orders/:id',
        create: 'POST /api/orders',
        update: 'PUT /api/orders/:id',
        delete: 'DELETE /api/orders/:id'
      }
    },
    frontend: 'http://localhost:5173',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'WarmPaws Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 WarmPaws Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;