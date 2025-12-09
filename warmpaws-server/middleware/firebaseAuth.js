import firebaseAdmin from '../config/firebaseAdmin.js';

// Middleware to verify Firebase ID tokens
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required. Format: Bearer <token>'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!firebaseAdmin) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Admin SDK not configured'
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    // Add user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
      provider: decodedToken.firebase.sign_in_provider
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Optional middleware - doesn't fail if no token provided
export const optionalFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    if (!firebaseAdmin) {
      req.user = null;
      return next();
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
      provider: decodedToken.firebase.sign_in_provider
    };

    next();
  } catch (error) {
    // If token verification fails, set user to null and continue
    req.user = null;
    next();
  }
};

export default {
  verifyFirebaseToken,
  optionalFirebaseAuth
};