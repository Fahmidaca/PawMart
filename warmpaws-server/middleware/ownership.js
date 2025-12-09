// Middleware to check if the authenticated user owns the resource
export const checkOwnership = (resourceField = 'email') => {
  return (req, res, next) => {
    try {
      // This middleware should be used after verifyFirebaseToken
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get the resource from request (could be in req.body, req.params, or req.resource)
      const resource = req.resource || req.body || {};
      const resourceOwnerEmail = resource[resourceField];

      // If no owner field found, allow access (for admin operations)
      if (!resourceOwnerEmail) {
        return next();
      }

      // Check if the authenticated user's email matches the resource owner's email
      if (req.user.email !== resourceOwnerEmail) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only modify your own resources.'
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource ownership'
      });
    }
  };
};

// Middleware to set resource in request for ownership checking
export const setResource = (getResourceFn) => {
  return async (req, res, next) => {
    try {
      const resource = await getResourceFn(req);
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Resource loading error:', error.message);
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }
  };
};

// Middleware for admin-only access
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user has admin privileges (you can customize this logic)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  if (!adminEmails.includes(req.user.email)) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

export default {
  checkOwnership,
  setResource,
  requireAdmin
};