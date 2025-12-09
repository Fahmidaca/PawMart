import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AddListing = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    location: '',
    description: '',
    image: '',
    date: '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Pets',
    'Food',
    'Accessories',
    'Care Products'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-set price to 0 if category is 'Pets'
      ...(name === 'category' && value === 'Pets' ? { price: '0' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to add a listing');
      return;
    }

    // Validation
    if (!formData.name || !formData.category || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.category === 'Pets' && formData.price !== '0') {
      toast.error('Pets for adoption should have price 0');
      return;
    }

    setLoading(true);
    
    try {
      // Save to MongoDB via API
      const listingData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        date: formData.date || new Date().toISOString().split('T')[0],
        email: user.email,
        userId: user.uid
      };

      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData)
      });

      if (response.ok) {
        toast.success('Listing added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          category: '',
          price: '',
          location: '',
          description: '',
          image: '',
          date: '',
          email: user.email
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add listing');
      }
      
    } catch (error) {
      console.error('Error adding listing:', error);
      toast.error(error.message || 'Failed to add listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-warm-600 text-white">
            <h1 className="text-2xl font-bold">Add New Listing</h1>
            <p className="text-warm-100">Create a new pet or product listing</p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            {/* Product/Pet Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product/Pet Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                placeholder="Enter product or pet name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price *
                {formData.category === 'Pets' && (
                  <span className="text-sm text-gray-500 ml-2">(Pets should be free for adoption)</span>
                )}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                placeholder="Enter price (0 for adoption)"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                placeholder="Enter location"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                placeholder="Describe your pet or product"
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Date (Pick Up) */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date (Pick Up)
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                readOnly
              />
              <p className="text-sm text-gray-500 mt-1">This will be your contact email for the listing</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-warm-600 text-white py-3 px-4 rounded-md hover:bg-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Adding Listing...
                  </div>
                ) : (
                  'Add Listing'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;