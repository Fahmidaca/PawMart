import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-warm-500 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">PawMart</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-warm-600 bg-warm-50' 
                  : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/pets-supplies"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/pets-supplies') 
                  ? 'text-warm-600 bg-warm-50' 
                  : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
              }`}
            >
              Pets & Supplies
            </Link>
            
            <Link
              to="/services"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/services') 
                  ? 'text-warm-600 bg-warm-50' 
                  : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
              }`}
            >
              Services
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/add-listing"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/add-listing') 
                      ? 'text-warm-600 bg-warm-50' 
                      : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                  }`}
                >
                  Add Listing
                </Link>
                
                <Link
                  to="/my-listings"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/my-listings') 
                      ? 'text-warm-600 bg-warm-50' 
                      : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                  }`}
                >
                  My Listings
                </Link>
                
                <Link
                  to="/my-orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/my-orders') 
                      ? 'text-warm-600 bg-warm-50' 
                      : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                  }`}
                >
                  My Orders
                </Link>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-warm-600 hover:bg-warm-50 transition-colors duration-200"
                  >
                    <img 
                      src={user.photoURL || '/images/default-avatar.svg'} 
                      alt={user.displayName || 'User'} 
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/default-avatar.svg';
                      }}
                    />
                    <span>{user.displayName || 'User'}</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.displayName || 'User'}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-warm-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-warm-600 hover:bg-warm-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-warm-600 focus:outline-none focus:text-warm-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-warm-600 bg-warm-50' 
                    : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/pets-supplies"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/pets-supplies') 
                    ? 'text-warm-600 bg-warm-50' 
                    : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                }`}
              >
                Pets & Supplies
              </Link>
              
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/services') 
                    ? 'text-warm-600 bg-warm-50' 
                    : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                }`}
              >
                Services
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/add-listing"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/add-listing') 
                        ? 'text-warm-600 bg-warm-50' 
                        : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                    }`}
                  >
                    Add Listing
                  </Link>
                  
                  <Link
                    to="/my-listings"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/my-listings') 
                        ? 'text-warm-600 bg-warm-50' 
                        : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                    }`}
                  >
                    My Listings
                  </Link>
                  
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/my-orders') 
                        ? 'text-warm-600 bg-warm-50' 
                        : 'text-gray-700 hover:text-warm-600 hover:bg-warm-50'
                    }`}
                  >
                    My Orders
                  </Link>
                  
                  <div className="px-3 py-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={user.photoURL || '/images/default-avatar.svg'} 
                        alt={user.displayName || 'User'} 
                        className="h-6 w-6 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/default-avatar.svg';
                        }}
                      />
                      <span>{user.displayName || 'User'}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{user.email}</div>
                  </div>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-warm-600 hover:bg-warm-50 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-warm-600 hover:bg-warm-50 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-warm-600 hover:bg-warm-700 text-white transition-colors duration-200"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;