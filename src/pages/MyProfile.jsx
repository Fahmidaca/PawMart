import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoritesServices, setFavoritesServices] = useState([]);

  // Load user's favorites
  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem('warmpaws-favorites');
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites);
        setFavorites(favoriteIds);
        loadFavoriteServices(favoriteIds);
      }
    }
  }, [user]);

  // Load favorite services data
  const loadFavoriteServices = async (favoriteIds) => {
    try {
      const response = await fetch('/data/services.json');
      const allServices = await response.json();
      const favoriteServices = allServices.filter(service => 
        favoriteIds.includes(service.serviceId)
      );
      setFavoritesServices(favoriteServices);
    } catch (error) {
      console.error('Failed to load favorite services:', error);
    }
  };

  // Remove from favorites
  const removeFromFavorites = (serviceId) => {
    const newFavorites = favorites.filter(id => id !== serviceId);
    setFavorites(newFavorites);
    localStorage.setItem('warmpaws-favorites', JSON.stringify(newFavorites));
    setFavoritesServices(prev => prev.filter(service => service.serviceId !== serviceId));
    toast.success('Removed from favorites');
  };
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });
  const [photoMode, setPhotoMode] = useState('url'); // 'url' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Initialize photo mode when entering edit mode
  useEffect(() => {
    if (isEditing && user?.photoURL) {
      setPhotoMode('url');
      setFormData({ ...formData, photoURL: user.photoURL });
    }
  }, [isEditing, user?.photoURL]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoModeChange = (mode) => {
    setPhotoMode(mode);
    setSelectedFile(null);
    setPhotoPreview(null);
    if (mode === 'url') {
      setFormData({ ...formData, photoURL: user?.photoURL || '' });
    } else {
      setFormData({ ...formData, photoURL: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoURLChange = (e) => {
    setFormData({
      ...formData,
      photoURL: e.target.value
    });
    setPhotoPreview(null);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoURL = formData.photoURL;
      
      // If file upload mode and file is selected, convert to data URL
      if (photoMode === 'upload' && selectedFile) {
        finalPhotoURL = photoPreview;
      }

      await updateUserProfile(formData.displayName, finalPhotoURL);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || ''
    });
    setSelectedFile(null);
    setPhotoPreview(null);
    setPhotoMode(user?.photoURL ? 'url' : 'upload');
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setFormData({
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || ''
    });
    setSelectedFile(null);
    setPhotoPreview(null);
    setPhotoMode(user?.photoURL ? 'url' : 'upload');
    setIsEditing(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn-primary-warm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden" data-aos="fade-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-warm-500 to-warm-600 px-6 py-8">
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src={user.photoURL || '/images/default-avatar.svg'} 
                  alt={user.displayName || 'User'} 
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-avatar.svg';
                  }}
                />
                <div className="absolute -bottom-2 -right-2 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mt-4">
                {user.displayName || 'Pet Parent'}
              </h1>
              <p className="text-warm-100 mt-2">
                WarmPaws Member
              </p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            {!isEditing ? (
              <div className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Full Name
                    </h3>
                    <p className="text-lg text-gray-900">
                      {user.displayName || 'Not set'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Email Address
                    </h3>
                    <p className="text-lg text-gray-900">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-warm-50 rounded-lg">
                    <div className="text-2xl font-bold text-warm-600">0</div>
                    <div className="text-sm text-gray-600">Services Booked</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Reviews Written</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Favorite Services</div>
                  </div>
                </div>

                {/* Pet Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    About My Pets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl mb-2">🐕</div>
                      <p className="text-gray-600">No pets added yet</p>
                      <button className="text-warm-600 hover:text-warm-700 text-sm font-medium mt-1">
                        Add your first pet
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleStartEditing}
                    className="flex-1 bg-warm-600 hover:bg-warm-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Update Profile
                  </button>
                  
                  <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Account Settings
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Update Profile</h3>
                  <p className="text-gray-600">Keep your information up to date</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-warm-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Photo (Optional)
                    </label>
                    
                    {/* Photo Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => handlePhotoModeChange('url')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          photoMode === 'url'
                            ? 'bg-white text-warm-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePhotoModeChange('upload')}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                          photoMode === 'upload'
                            ? 'bg-white text-warm-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Upload
                      </button>
                    </div>

                    {photoMode === 'url' ? (
                      <div>
                        <input
                          id="photoURL"
                          name="photoURL"
                          type="url"
                          value={formData.photoURL}
                          onChange={handlePhotoURLChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-warm-500"
                          placeholder="Photo URL (Optional)"
                        />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.5 6.5c1.495 0 2.831.456 3.916 1.203A9.802 9.802 0 0 1 4.5 6.5Z"/>
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4.5v3a3 3 0 1 1-6 0v-3M12 1v3"/>
                              </svg>
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </div>
                            <input
                              id="photo-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                        
                        {/* Photo Preview */}
                        {photoPreview && (
                          <div className="flex items-center space-x-3">
                            <img
                              src={photoPreview}
                              alt="Preview"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 font-medium">
                                {selectedFile?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null);
                                setPhotoPreview(null);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Photo Preview for URL mode */}
                {photoMode === 'url' && formData.photoURL && (
                  <div className="text-center">
                    <img 
                      src={formData.photoURL} 
                      alt="Preview" 
                      className="h-24 w-24 rounded-full mx-auto border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-2">Preview of your profile photo</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-warm-600 hover:bg-warm-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="loading loading-spinner loading-sm mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500">No recent activity to show</p>
            <p className="text-sm text-gray-400">Your booked services and reviews will appear here</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">View Bookings</h4>
                <p className="text-sm text-gray-500">Check your upcoming appointments</p>
              </div>
            </div>
          </button>

          <button 
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left"
            onClick={() => document.getElementById('favorites-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Favorites ({favorites.length})</h4>
                <p className="text-sm text-gray-500">Your saved services and providers</p>
              </div>
            </div>
          </button>
        </div>

        {/* Favorites Section */}
        <div id="favorites-section" className="mt-8 bg-white rounded-lg shadow p-6" data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            My Favorite Services ({favorites.length})
          </h3>
          
          {favoritesServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritesServices.map((service, index) => (
                <div key={service.serviceId} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <img 
                      src={service.image} 
                      alt={service.serviceName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFromFavorites(service.serviceId)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove from favorites"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L10 13.414l2.293 2.293a1 1 0 001.414-1.414L12.414 12l1.293-1.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{service.serviceName}</h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-warm-600">${service.price}</span>
                    <Link 
                      to={`/service/${service.serviceId}`}
                      className="text-xs text-warm-600 hover:text-warm-700 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💖</div>
              <p className="text-gray-500">No favorite services yet</p>
              <p className="text-sm text-gray-400">Start adding services to your favorites by clicking the heart icon</p>
              <Link 
                to="/" 
                className="inline-block mt-4 btn-primary-warm text-sm"
              >
                Browse Services
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;