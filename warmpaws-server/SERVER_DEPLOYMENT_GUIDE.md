# WarmPaws Server Deployment Guide

## ✅ Complete Server Implementation with Firebase Admin SDK

This guide covers the deployment of the WarmPaws backend server with Firebase Admin SDK authentication and protected API routes.

### 🔥 **Firebase Admin SDK Features Implemented**

1. **Server-Side Token Verification**
   - Firebase ID token verification middleware
   - Automatic user information extraction
   - Support for expired/revoked token handling

2. **Protected API Routes**
   - All POST, PUT, DELETE operations require authentication
   - Owner-based permission checks
   - Admin-only access control

3. **Enhanced Security**
   - CORS configuration
   - Rate limiting
   - Helmet security headers
   - Input validation

### 🚀 **Deployment Options**

#### Option 1: Railway (Recommended)

1. **Connect Repository**
   ```bash
   # Push server to GitHub
   git init
   git add .
   git commit -m "Implement Firebase Admin SDK with protected routes"
   git remote add origin <your-server-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Visit [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables (see below)

3. **Environment Variables for Railway**
   ```env
   PORT=5000
   NODE_ENV=production
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   FIREBASE_PROJECT_ID=your-project-id
   CLIENT_URL=https://your-frontend-url.netlify.app
   ```

#### Option 2: Render

1. **Create Web Service on Render**
   - Connect GitHub repository
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables

#### Option 3: Heroku

1. **Deploy to Heroku**
   ```bash
   heroku create warmpaws-server
   git push heroku main
   heroku config:set FIREBASE_SERVICE_ACCOUNT="..."
   heroku config:set FIREBASE_PROJECT_ID="..."
   ```

### 📋 **API Endpoints Documentation**

#### Public Endpoints (No Authentication Required)
```http
GET /                    # API information
GET /api/health          # Health check
GET /api/services        # Get all services
GET /api/services/:id    # Get service by ID
GET /api/listings        # Get all listings (with filters)
GET /api/listings/:id    # Get listing by ID
```

#### Protected Endpoints (Firebase Authentication Required)
```http
POST /api/listings       # Create new listing
PUT /api/listings/:id    # Update own listing
DELETE /api/listings/:id # Delete own listing
```

#### Authentication Headers
```http
Authorization: Bearer <firebase-id-token>
```

### 🔐 **Firebase Admin SDK Setup**

1. **Create Service Account**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key (JSON file)
   - Copy the JSON content to `FIREBASE_SERVICE_ACCOUNT` environment variable

2. **Environment Variables**
   ```env
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/...","universe_domain":"googleapis.com"}
   FIREBASE_PROJECT_ID=your-project-id
   ```

### 🛡️ **Security Features**

1. **Token Verification Middleware**
   - Verifies Firebase ID tokens
   - Extracts user information (uid, email, name)
   - Handles expired/revoked tokens

2. **Ownership Checks**
   - Only allows users to modify their own listings
   - Compares authenticated user email with resource owner email

3. **Admin Access Control**
   - Configurable admin email list
   - Protected admin-only endpoints

### 📊 **Testing the Deployment**

1. **Health Check**
   ```bash
   curl https://your-server-url.railway.app/api/health
   ```

2. **Public Endpoints**
   ```bash
   curl https://your-server-url.railway.app/api/listings
   ```

3. **Protected Endpoints** (requires Firebase token)
   ```bash
   curl -X POST https://your-server-url.railway.app/api/listings \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Listing","category":"Pets","location":"Dhaka","description":"Test"}'
   ```

### 🔧 **Local Development**

1. **Install Dependencies**
   ```bash
   cd warmpaws-server
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### 📈 **Production Checklist**

- [ ] Firebase Admin SDK configured with service account
- [ ] Environment variables set in deployment platform
- [ ] CORS origins configured for frontend URL
- [ ] Rate limiting configured appropriately
- [ ] Health check endpoint working
- [ ] Protected endpoints tested with valid tokens
- [ ] Owner-based permissions verified

### 🌐 **Expected Response Format**

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Description of the operation",
  "data": {...} // Response data
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

### 🚨 **Troubleshooting**

1. **Firebase Admin SDK Not Initialized**
   - Check `FIREBASE_SERVICE_ACCOUNT` environment variable
   - Verify JSON format is valid
   - Ensure `FIREBASE_PROJECT_ID` is set

2. **Token Verification Fails**
   - Ensure Authorization header format: `Bearer <token>`
   - Check if token is expired
   - Verify Firebase project configuration

3. **CORS Errors**
   - Update `CLIENT_URL` environment variable
   - Check frontend URL matches exactly

The server is now production-ready with comprehensive Firebase Admin SDK integration!