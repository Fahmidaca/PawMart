import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState({
    buyerName: user?.displayName || '',
    email: user?.email || '',
    productId: id,
    productName: '',
    quantity: 1,
    price: 0,
    address: '',
    date: '',
    phone: '',
    additionalNotes: ''
  });
  const [orderLoading, setOrderLoading] = useState(false);

  // Mock listing data (in real app, fetch from MongoDB)
  const mockListings = {
    '1': {
      id: '1',
      name: 'Golden Retriever Puppy',
      category: 'Pets',
      price: 0,
      location: 'Dhaka',
      description: 'Friendly 2-month-old puppy available for adoption. This adorable Golden Retriever puppy is looking for a loving home. He is vaccinated, dewormed, and ready to join your family. Perfect with children and other pets.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      email: 'owner1@gmail.com',
      date: '2025-12-15',
      ownerName: 'Mr. Rahman'
    },
    '2': {
      id: '2',
      name: 'Premium Dog Food',
      category: 'Food',
      price: 2500,
      location: 'Chattogram',
      description: 'High-quality dry dog food for adult dogs. Made with premium ingredients including real chicken and brown rice. Rich in protein and essential nutrients to keep your dog healthy and energetic.',
      image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      email: 'shop1@gmail.com',
      date: '2025-12-10',
      ownerName: 'Pet Store Pro'
    },
    '3': {
      id: '3',
      name: 'Interactive Cat Toy',
      category: 'Accessories',
      price: 800,
      location: 'Sylhet',
      description: 'Fun interactive toy for cats to play with. Features LED lights and moving parts to keep your feline friend entertained for hours. Made with safe, non-toxic materials.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      email: 'shop2@gmail.com',
      date: '2025-12-12',
      ownerName: 'Cat Lover Shop'
    },
    '4': {
      id: '4',
      name: 'Pet Shampoo',
      category: 'Care Products',
      price: 450,
      location: 'Dhaka',
      description: 'Gentle shampoo for sensitive pet skin. Hypoallergenic formula with natural ingredients. Perfect for pets with allergies or sensitive skin conditions.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      email: 'shop3@gmail.com',
      date: '2025-12-08',
      ownerName: 'Pet Care Center'
    },
    '5': {
      id: '5',
      name: 'Persian Cat',
      category: 'Pets',
      price: 0,
      location: 'Rajshahi',
      description: 'Beautiful Persian cat looking for a loving home. 3 years old, fully vaccinated and spayed. Very calm and gentle personality, perfect for apartment living.',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      email: 'owner2@gmail.com',
      date: '2025-12-20',
      ownerName: 'Ms. Khan'
    },
    '6': {
      id: '6',
      name: 'Dog Leash',
      category: 'Accessories',
      price: 350,
      location: 'Khulna',
      description: 'Durable leash for medium to large dogs. Made with high-quality nylon material. 6 feet length with comfortable handle grip.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      email: 'shop4@gmail.com',
      date: '2025-12-14',
      ownerName: 'Pet Supplies Plus'
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load listing details from API
    const loadListing = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/${id}`);
        const result = await response.json();
        
        if (result.success) {
          const listingData = result.data;
          setListing(listingData);
          setOrderData(prev => ({
            ...prev,
            productName: listingData.name,
            price: listingData.price,
            quantity: listingData.category === 'Pets' ? 1 : 1
          }));
        } else {
          toast.error('Listing not found');
          navigate('/pets-supplies');
          return;
        }
      } catch (error) {
        console.error('Error loading listing:', error);
        toast.error('Failed to load listing details');
        navigate('/pets-supplies');
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id, user, navigate]);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!orderData.buyerName || !orderData.address || !orderData.phone || !orderData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setOrderLoading(true);
    
    try {
      // Create order via API
      const orderInfo = {
        buyerName: orderData.buyerName,
        email: orderData.email,
        productId: listing.id,
        productName: listing.name,
        quantity: orderData.quantity,
        price: listing.price,
        address: orderData.address,
        phone: orderData.phone,
        date: orderData.date,
        additionalNotes: orderData.additionalNotes,
        userId: user?.uid || null
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderInfo)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Order placed successfully! The ${listing.category === 'Pets' ? 'adoption request' : 'order'} has been submitted.`);
        setShowOrderModal(false);
      } else {
        toast.error('Failed to place order. Please try again.');
      }
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/pets-supplies"
          className="inline-flex items-center text-warm-600 hover:text-warm-700 mb-6"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pets & Supplies
        </Link>

        {/* Listing Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-w-16 aspect-h-12">
              <img 
                src={listing.image} 
                alt={listing.name}
                className="w-full h-96 lg:h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                }}
              />
            </div>
            
            {/* Content */}
            <div className="p-8">
              {/* Category and Location */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
                <div className="text-sm text-gray-500 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {listing.location}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.name}
              </h1>
              
              {/* Price */}
              <div className="mb-6">
                {listing.price === 0 ? (
                  <span className="text-3xl font-bold text-green-600">Free for Adoption</span>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-warm-600">৳{listing.price}</span>
                  </div>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Owner Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-600">Owner: {listing.ownerName}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">Email: {listing.email}</span>
                  </div>
                  {listing.date && (
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">Available from: {new Date(listing.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <button 
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-warm-600 text-white py-3 px-6 rounded-lg hover:bg-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:ring-offset-2 transition-colors duration-200 text-lg font-semibold"
              >
                {listing.category === 'Pets' ? '🐾 Adopt Now' : '🛒 Order Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="px-6 py-4 bg-warm-600 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {listing.category === 'Pets' ? 'Adoption Request' : 'Place Order'}
              </h2>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
              {/* Product Info (readonly) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product/Listing Name
                  </label>
                  <input
                    type="text"
                    value={orderData.productName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={orderData.price === 0 ? 'Free' : `৳${orderData.price}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Buyer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buyer Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={orderData.buyerName}
                    onChange={handleOrderChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={orderData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Quantity and Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={orderData.quantity}
                    onChange={handleOrderChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pick-up Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={orderData.date}
                    onChange={handleOrderChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={orderData.address}
                  onChange={handleOrderChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500"
                  placeholder="Enter your address"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={orderData.phone}
                  onChange={handleOrderChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={orderData.additionalNotes}
                  onChange={handleOrderChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500"
                  placeholder="Any additional information..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="w-full bg-warm-600 text-white py-3 px-4 rounded-md hover:bg-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {orderLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading loading-spinner loading-sm mr-2"></div>
                      {listing.category === 'Pets' ? 'Submitting Adoption Request...' : 'Placing Order...'}
                    </div>
                  ) : (
                    `${listing.category === 'Pets' ? 'Submit Adoption Request' : 'Place Order'}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetails;