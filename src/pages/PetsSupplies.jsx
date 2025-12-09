import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PetsSupplies = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Pets',
    'Food', 
    'Accessories',
    'Care Products'
  ];

  // Category mapping to match Home page logic
  const getCategoryServices = (category) => {
    switch (category) {
      case 'Pets':
        return listings.filter(service => service.originalCategory === 'Pet Adoption');
      case 'Food':
        return listings.filter(service => service.originalCategory === 'Pet Food');
      case 'Accessories':
        return listings.filter(service => 
          ['Pet Accessories', 'Pet Toys', 'Pet Furniture', 'Pet Clothing'].includes(service.originalCategory)
        );
      case 'Care Products':
        return listings.filter(service => 
          ['Veterinary', 'Grooming', 'Cat Care'].includes(service.originalCategory)
        );
      default:
        return listings;
    }
  };

  // Get category count for display
  const getCategoryCount = (category) => {
    return getCategoryServices(category).length;
  };

  // Load listings from API (MongoDB) with fallback to static JSON
  useEffect(() => {
    const loadListings = async () => {
      try {
        console.log('Loading listings from API...');
        const response = await fetch('http://localhost:5000/api/listings');
        
        if (response.ok) {
          const data = await response.json();
          const apiListings = data.listings || data;
          
          // Transform API data to match listing format
          const transformedListings = apiListings.map(listing => ({
            id: listing._id || listing.id,
            name: listing.name || listing.serviceName,
            category: listing.category === 'Pet Adoption' || listing.category === 'Pets' ? 'Pets' :
                     listing.category === 'Pet Food' || listing.category === 'Food' ? 'Food' :
                     ['Pet Accessories', 'Pet Toys', 'Pet Furniture', 'Pet Clothing', 'Accessories'].includes(listing.category) ? 'Accessories' :
                     ['Veterinary', 'Grooming', 'Cat Care', 'Care Products'].includes(listing.category) ? 'Care Products' :
                     listing.category,
            originalCategory: listing.category,
            price: listing.price || 0,
            rating: listing.rating || 4.5,
            location: listing.location || 'Dhaka',
            description: listing.description,
            image: listing.image,
            email: listing.email || listing.providerEmail,
            date: listing.date || new Date().toISOString().split('T')[0],
            type: listing.type || (listing.price === 0 ? 'adoption' : 'product')
          }));
          
          console.log('Loaded from API:', transformedListings.length, 'listings');
          setListings(transformedListings);
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.log('API failed, falling back to static JSON...');
        // Fallback to static JSON
        try {
          const response = await fetch('/data/services.json');
          const data = await response.json();
          
          const transformedListings = data.map(service => ({
            id: service.serviceId,
            name: service.serviceName,
            category: service.category === 'Pet Adoption' ? 'Pets' :
                     service.category === 'Pet Food' ? 'Food' :
                     ['Pet Accessories', 'Pet Toys', 'Pet Furniture', 'Pet Clothing'].includes(service.category) ? 'Accessories' :
                     ['Veterinary', 'Grooming', 'Cat Care'].includes(service.category) ? 'Care Products' :
                     service.category,
            originalCategory: service.category,
            price: service.price,
            rating: service.rating,
            location: service.providerName.split(' ')[0] + ' City',
            description: service.description,
            image: service.image,
            email: service.providerEmail,
            date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            type: service.type
          }));
          
          console.log('Loaded from fallback:', transformedListings.length, 'listings');
          setListings(transformedListings);
        } catch (fallbackError) {
          console.error('Error loading services:', fallbackError);
          toast.error('Failed to load listings');
        }
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory === 'All' ? '' : urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    // Filter listings based on category and search term
    let filtered = listings;

    console.log('Filtering listings:', { total: listings.length, selectedCategory, searchTerm });

    // Apply category filter using the same logic as Home page
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = getCategoryServices(selectedCategory);
      console.log('After category filter:', filtered.length, 'items');
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length, 'items');
    }

    console.log('Final filtered listings:', filtered.length);
    setFilteredListings(filtered);
  }, [listings, selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === 'All' ? '' : category);
  };

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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pets & Supplies
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing pets for adoption and quality pet supplies from trusted sellers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory || 'All'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
              >
                <option value="All">All ({listings.length})</option>
                <option value="Pets">Pets ({getCategoryCount('Pets')})</option>
                <option value="Food">Food ({getCategoryCount('Food')})</option>
                <option value="Accessories">Accessories ({getCategoryCount('Accessories')})</option>
                <option value="Care Products">Care Products ({getCategoryCount('Care Products')})</option>
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredListings.length} of {listings.length} listings
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600">
              {selectedCategory || searchTerm 
                ? 'Try adjusting your search or filter criteria' 
                : 'No listings available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <div 
                key={listing.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={listing.image} 
                    alt={listing.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listing.category === 'Pets' 
                        ? 'bg-green-100 text-green-800' 
                        : listing.category === 'Food'
                        ? 'bg-yellow-100 text-yellow-800'
                        : listing.category === 'Accessories'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {listing.originalCategory || listing.category}
                    </span>
                    <div className="text-sm text-gray-500">{listing.location}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                    {listing.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      {listing.price === 0 ? (
                        <span className="text-lg font-bold text-green-600">Free for Adoption</span>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-warm-600">৳{listing.price}</span>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1">{listing.rating}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={user ? `/service/${listing.id}` : '/login'}
                      className="btn-primary-warm text-sm"
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to view details');
                        }
                      }}
                    >
                      {listing.type === 'adoption' ? 'Adopt Now' : 'View Details'}
                    </Link>
                  </div>
                  
                  {/* Date */}
                  {listing.date && (
                    <div className="mt-3 text-sm text-gray-500">
                      Available from: {new Date(listing.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsSupplies;