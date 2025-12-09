import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Load services from JSON file
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/data/services.json');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // Handle URL parameters for season filtering
  useEffect(() => {
    const season = searchParams.get('season');
    if (season) {
      setSelectedSeason(season);
    }
  }, [searchParams]);

  // Get unique categories
  const categories = ['All', ...new Set(services.map(service => service.category))];

  // Filter services by category
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

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
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PawMart Services & Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing pet adoption opportunities, quality supplies, grooming services, veterinary care, and everything your furry friend needs.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8" data-aos="fade-up">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-warm-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-warm-50 hover:text-warm-600 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-warm-600">{filteredServices.length}</span> services
            {selectedSeason !== 'all' && (
              <span> for <span className="font-semibold">{seasons.find(s => s.value === selectedSeason)?.label}</span></span>
            )}
            {selectedCategory !== 'All' && (
              <span> in <span className="font-semibold">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <div 
              key={service.serviceId} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative">
                <img 
                  src={service.image} 
                  alt={service.serviceName}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    service.type === 'adoption' 
                      ? 'bg-green-100 text-green-800' 
                      : service.type === 'product'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {service.type === 'adoption' ? '🐕 Free Adoption' :
                     service.type === 'product' ? '🛍️ For Sale' :
                     '🛠️ Service'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-warm-600 bg-warm-100 px-2 py-1 rounded">
                    {service.category}
                  </span>
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.serviceName}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-warm-600">৳{service.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/service</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.slotsAvailable} slots available
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link 
                    to={user ? `/service/${service.serviceId}` : '/login'}
                    className="flex-1 btn-primary-warm text-sm text-center"
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to view service details');
                      }
                    }}
                  >
                    {service.type === 'adoption' ? 'Adopt Now' : 'View Details'}
                  </Link>
                  {user && (
                    <button className="px-4 py-2 border border-warm-600 text-warm-600 rounded-lg hover:bg-warm-50 transition-colors duration-200">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="mt-3 text-sm text-gray-500">
                  <span>By {service.providerName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No services message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-4">
              Try selecting a different season or category, or check back later for new services.
            </p>
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSeason('all');
                setSearchParams({});
              }}
              className="btn-primary-warm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Weather Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-3">❄️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Winter Care</h3>
            <p className="text-gray-600 text-sm">Keep pets warm and safe during cold weather</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-3">☀️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Summer Cooling</h3>
            <p className="text-gray-600 text-sm">Beat the heat with cooling solutions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-3">🌧️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rainy Day Fun</h3>
            <p className="text-gray-600 text-sm">Indoor activities for wet weather</p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-3">🚨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Care</h3>
            <p className="text-gray-600 text-sm">24/7 support for weather-related emergencies</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-warm-600 to-warm-700 rounded-lg" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need a Custom All-Weather Care Solution?
          </h2>
          <p className="text-warm-100 mb-6 max-w-2xl mx-auto">
            Can't find exactly what you're looking for? Our team of veterinary experts can create a personalized care plan for your pet's specific needs in any weather condition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to={user ? "/profile" : "/signup"}
              className="bg-white text-warm-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
            >
              Contact Our Experts
            </Link>
            <Link 
              to="/add-listing"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-warm-600 transition-colors duration-200"
            >
              List Your Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;