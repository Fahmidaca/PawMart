import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Mock data - in real app, fetch from MongoDB based on user ID
  const mockAllListings = [
    {
      id: '1',
      name: 'Golden Retriever Puppy',
      category: 'Pets',
      price: 0,
      location: 'Dhaka',
      description: 'Friendly 2-month-old puppy available for adoption.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: user?.email || 'test@gmail.com',
      date: '2025-12-15',
      userId: user?.uid || 'user1'
    },
    {
      id: '2',
      name: 'Premium Dog Food',
      category: 'Food',
      price: 2500,
      location: 'Chattogram',
      description: 'High-quality dry dog food for adult dogs.',
      image: 'https://images.unsplash.com/photo-1589883661923-6471cb9b0b46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'other@gmail.com',
      date: '2025-12-10',
      userId: 'otheruser'
    },
    {
      id: '3',
      name: 'Interactive Cat Toy',
      category: 'Accessories',
      price: 800,
      location: 'Sylhet',
      description: 'Fun interactive toy for cats to play with.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: user?.email || 'test@gmail.com',
      date: '2025-12-12',
      userId: user?.uid || 'user1'
    }
  ];

  useEffect(() => {
    if (!user) {
      return;
    }

    // Load user's listings
    const loadListings = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter listings for current user
        const userListings = mockAllListings.filter(listing => listing.userId === user.uid);
        setListings(userListings);
      } catch (error) {
        toast.error('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [user]);

  const handleDelete = async (listingId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from local state
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      toast.success('Listing deleted successfully');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete listing');
    }
  };

  const handleUpdate = (listingId) => {
    // In a real app, this would open an update modal or navigate to edit page
    toast.info('Update functionality would open here');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to view your listings.</p>
          <Link to="/login" className="btn-primary-warm">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
              <p className="text-gray-600 mt-2">
                Manage your pet and product listings
              </p>
            </div>
            <Link 
              to="/add-listing"
              className="bg-warm-600 text-white px-6 py-3 rounded-lg hover:bg-warm-700 transition-colors duration-200 flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Listing
            </Link>
          </div>
        </div>

        {/* Listings Table */}
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any listings yet. Start by adding your first pet or product!
            </p>
            <Link 
              to="/add-listing"
              className="btn-primary-warm inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      {/* Listing Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img 
                              className="h-12 w-12 rounded-lg object-cover" 
                              src={listing.image} 
                              alt={listing.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {listing.name}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {listing.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          listing.category === 'Pets' 
                            ? 'bg-green-100 text-green-800' 
                            : listing.category === 'Food'
                            ? 'bg-yellow-100 text-yellow-800'
                            : listing.category === 'Accessories'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {listing.category}
                        </span>
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {listing.price === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          <span className="font-medium">৳{listing.price}</span>
                        )}
                      </td>
                      
                      {/* Location */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.location}
                      </td>
                      
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(listing.date).toLocaleDateString()}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(listing.id)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Update
                          </button>
                          
                          <button
                            onClick={() => setDeleteConfirm(listing.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this listing? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;