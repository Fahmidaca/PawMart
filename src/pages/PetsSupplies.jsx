import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PetsSupplies = () => {
  const { user } = useAuth();
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

  // Mock data for demonstration
  const mockListings = [
    {
      id: '1',
      name: 'Golden Retriever Puppy',
      category: 'Pets',
      price: 0,
      location: 'Dhaka',
      description: 'Friendly 2-month-old puppy available for adoption.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'owner1@gmail.com',
      date: '2025-12-15'
    },
    {
      id: '2',
      name: 'Premium Dog Food',
      category: 'Food',
      price: 2500,
      location: 'Chattogram',
      description: 'High-quality dry dog food for adult dogs.',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'shop1@gmail.com',
      date: '2025-12-10'
    },
    {
      id: '3',
      name: 'Interactive Cat Toy',
      category: 'Accessories',
      price: 800,
      location: 'Sylhet',
      description: 'Fun interactive toy for cats to play with.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'shop2@gmail.com',
      date: '2025-12-12'
    },
    {
      id: '4',
      name: 'Pet Shampoo',
      category: 'Care Products',
      price: 450,
      location: 'Dhaka',
      description: 'Gentle shampoo for sensitive pet skin.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'shop3@gmail.com',
      date: '2025-12-08'
    },
    {
      id: '5',
      name: 'Persian Cat',
      category: 'Pets',
      price: 0,
      location: 'Rajshahi',
      description: 'Beautiful Persian cat looking for a loving home.',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'owner2@gmail.com',
      date: '2025-12-20'
    },
    {
      id: '6',
      name: 'Dog Leash',
      category: 'Accessories',
      price: 350,
      location: 'Khulna',
      description: 'Durable leash for medium to large dogs.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email: 'shop4@gmail.com',
      date: '2025-12-14'
    }
  ];

  useEffect(() => {
    // Load listings from API
    const loadListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings');
        const result = await response.json();
        
        if (result.success) {
          setListings(result.data);
          setFilteredListings(result.data);
        } else {
          toast.error('Failed to load listings');
        }
      } catch (error) {
        console.error('Error loading listings:', error);
        toast.error('Failed to load listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  useEffect(() => {
    // Filter listings based on category and search term
    let filtered = listings;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
            <div className="md:w-48">
              <select
                value={selectedCategory || 'All'}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
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
                      {listing.category}
                    </span>
                    <div className="text-sm text-gray-500">{listing.location}</div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
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
                        </div>
                      )}
                    </div>
                    
                    <Link 
                      to={user ? `/listing/${listing.id}` : '/login'}
                      className="btn-primary-warm text-sm"
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to view details');
                        }
                      }}
                    >
                      See Details
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