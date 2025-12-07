import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { authAPI, setAuthToken, getToken } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return auth !== null;
};

// Dynamic import of Firebase auth functions
const getFirebaseAuth = async () => {
  if (!isFirebaseConfigured()) return null;
  
  const { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
  } = await import('firebase/auth');
  
  return {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Demo mode user data
  const demoUser = {
    uid: 'demo-user-123',
    email: 'demo@warmpaws.com',
    displayName: 'Demo User',
    photoURL: null
  };

  // Register new user
  const register = async (email, password, displayName, photoURL) => {
    try {
      // Try backend API first
      const response = await authAPI.register({
        email,
        password,
        name: displayName
      });
      
      if (response.success) {
        const { token, user } = response.data;
        setAuthToken(token);
        setUser({
          uid: user.id,
          email: user.email,
          displayName: user.name,
          photoURL: photoURL || null
        });
        setIsDemoMode(false);
        return { user };
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (apiError) {
      console.warn('Backend API failed, falling back to Firebase:', apiError.message);
      
      // Fallback to Firebase if backend fails
      if (!isFirebaseConfigured()) {
        // Demo mode - simulate successful registration
        setUser({ ...demoUser, email, displayName, photoURL });
        setIsDemoMode(true);
        return { user: { email, displayName } };
      }

      try {
        const firebaseAuth = await getFirebaseAuth();
        if (!firebaseAuth) throw new Error('Firebase not configured');
        
        const result = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
        
        // Update user profile
        await firebaseAuth.updateProfile(result.user, {
          displayName: displayName,
          photoURL: photoURL
        });
        
        return result;
      } catch (firebaseError) {
        throw firebaseError;
      }
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // Try backend API first
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const { token, user } = response.data;
        setAuthToken(token);
        setUser({
          uid: user.id,
          email: user.email,
          displayName: user.name,
          photoURL: null
        });
        setIsDemoMode(false);
        return { user };
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (apiError) {
      console.warn('Backend API failed, falling back to Firebase:', apiError.message);
      
      // Fallback to Firebase if backend fails
      if (!isFirebaseConfigured()) {
        // Demo mode - accept any credentials
        setUser({ ...demoUser, email });
        setIsDemoMode(true);
        return { user: { email } };
      }

      try {
        const firebaseAuth = await getFirebaseAuth();
        if (!firebaseAuth) throw new Error('Firebase not configured');
        
        const result = await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
        return result;
      } catch (firebaseError) {
        throw firebaseError;
      }
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured()) {
      // Demo mode - simulate Google login
      setUser(demoUser);
      setIsDemoMode(true);
      return { user: demoUser };
    }

    try {
      const firebaseAuth = await getFirebaseAuth();
      if (!firebaseAuth) throw new Error('Firebase not configured');
      
      const provider = new firebaseAuth.GoogleAuthProvider();
      const result = await firebaseAuth.signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      // Handle specific Firebase auth errors gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup - don't show error, just return silently
        console.log('Google sign-in popup was closed by user');
        return null;
      }
      if (error.code === 'auth/popup-blocked') {
        // Popup was blocked by browser - user can try again
        console.log('Google sign-in popup was blocked by browser');
        return null;
      }
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Try backend API first
      await authAPI.logout();
      setAuthToken(null);
      setUser(null);
      setIsDemoMode(false);
    } catch (apiError) {
      console.warn('Backend API logout failed, using local logout:', apiError.message);
      
      // Local logout
      setAuthToken(null);
      setUser(null);
      setIsDemoMode(false);
      
      // Also try Firebase logout if available
      if (isFirebaseConfigured()) {
        try {
          const firebaseAuth = await getFirebaseAuth();
          if (firebaseAuth) {
            await firebaseAuth.signOut(auth);
          }
        } catch (firebaseError) {
          console.warn('Firebase logout also failed:', firebaseError.message);
        }
      }
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    if (!isFirebaseConfigured()) {
      // Demo mode - simulate success
      return Promise.resolve();
    }

    try {
      const firebaseAuth = await getFirebaseAuth();
      if (!firebaseAuth) throw new Error('Firebase not configured');
      
      await firebaseAuth.sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName, photoURL) => {
    if (!isFirebaseConfigured()) {
      // Demo mode - just update local state
      setUser(prev => prev ? { ...prev, displayName, photoURL } : null);
      return;
    }

    try {
      const firebaseAuth = await getFirebaseAuth();
      if (!firebaseAuth) throw new Error('Firebase not configured');
      
      await firebaseAuth.updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: photoURL
      });
    } catch (error) {
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const checkAuthState = async () => {
      const token = getToken();
      
      if (token) {
        try {
          // Try to get profile from backend API
          const response = await authAPI.getProfile();
          if (response.success) {
            const userData = response.data;
            setUser({
              uid: userData.id,
              email: userData.email,
              displayName: userData.name,
              photoURL: null
            });
            setIsDemoMode(false);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.warn('Backend API auth check failed:', apiError.message);
          // Token might be invalid, clear it
          setAuthToken(null);
        }
      }

      // Fallback to Firebase if available
      if (isFirebaseConfigured()) {
        const setupAuth = async () => {
          const firebaseAuth = await getFirebaseAuth();
          if (!firebaseAuth) {
            // Demo mode - enable demo user for testing
            setIsDemoMode(true);
            setLoading(false);
            return;
          }

          const unsubscribe = firebaseAuth.onAuthStateChanged(auth, (user) => {
            if (user) {
              setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
              });
              setIsDemoMode(false);
            } else {
              setUser(null);
              // Only enable demo mode if no Firebase user and no backend token
              if (!token) {
                setIsDemoMode(true);
              }
            }
            setLoading(false);
          });

          return unsubscribe;
        };

        setupAuth();
      } else {
        // Demo mode - enable demo user for testing
        setIsDemoMode(true);
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const value = {
    user,
    loading,
    isDemoMode,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};