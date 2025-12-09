import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useAuth } from '../contexts/AuthContext';
import AnimatedHero from '../components/AnimatedHero';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('warmpaws-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('warmpaws-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite service
  const toggleFavorite = (serviceId) => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    setFavorites(prev => {
      const isFavorite = prev.includes(serviceId);
      const newFavorites = isFavorite 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
      
      toast.success(
        isFavorite ? 'Removed from favorites' : 'Added to favorites',
        { duration: 2000 }
      );
      
      return newFavorites;
    });
  };

  // Check if service is favorite
  const isFavorite = (serviceId) => favorites.includes(serviceId);

  // Load listings from API (MongoDB)
  useEffect(() => {
    const loadListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/listings?limit=6');
        if (response.ok) {
          const data = await response.json();
          setServices(data.listings || data);
        } else {
          // Fallback to static JSON if API fails
          const fallbackResponse = await fetch('/data/services.json');
          const fallbackData = await fallbackResponse.json();
          setServices(fallbackData);
        }
      } catch (error) {
        // Fallback to static JSON if API fails
        try {
          const fallbackResponse = await fetch('/data/services.json');
          const fallbackData = await fallbackResponse.json();
          setServices(fallbackData);
        } catch (fallbackError) {
          toast.error('Failed to load listings');
        }
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  // Hero slider data for PawMart
  const heroSlides = [
    {
      id: 1,
      title: 'Find Your Furry Friend Today!',
      subtitle: 'Adopt loving pets or discover amazing pet products on PawMart',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      cta: 'Browse Pets & Supplies'
    },
    {
      id: 2,
      title: 'Adopt, Don\'t Shop — Give a Pet a Home',
      subtitle: 'Every pet deserves love and care. Find your perfect companion today',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      cta: 'Adopt Now'
    },
    {
      id: 3,
      title: 'Because Every Pet Deserves Love and Care',
      subtitle: 'Connect with local pet owners and trusted sellers for all your pet needs',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      cta: 'Explore Now'
    }
  ];

  // Generate categories from services data with real counts
  const getCategoryStats = () => {
    const categoryStats = {};
    services.forEach(service => {
      if (!categoryStats[service.category]) {
        categoryStats[service.category] = 0;
      }
      categoryStats[service.category]++;
    });
    return categoryStats;
  };

  const categoryStats = getCategoryStats();

  // Category data for PawMart (matching assignment requirements)
  const categories = [
    {
      id: 1,
      name: 'Pets',
      description: 'Adopt loving pets looking for forever homes',
      icon: '🐶',
      count: `${categoryStats['Pets'] || categoryStats['Pet Adoption'] || 0} Pets Available`,
      link: '/pets-supplies?category=Pets',
      color: 'bg-green-500'
    },
    {
      id: 2,
      name: 'Food',
      description: 'Quality pet food and nutritional products',
      icon: '🍖',
      count: `${categoryStats['Food'] || categoryStats['Pet Food'] || 0} Products`,
      link: '/pets-supplies?category=Food',
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      name: 'Accessories',
      description: 'Toys, collars, leashes and pet accessories',
      icon: '🧸',
      count: `${(categoryStats['Accessories'] || 0) + (categoryStats['Pet Accessories'] || 0) + (categoryStats['Pet Toys'] || 0)} Items`,
      link: '/pets-supplies?category=Accessories',
      color: 'bg-blue-500'
    },
    {
      id: 4,
      name: 'Care Products',
      description: 'Grooming supplies and health care products',
      icon: '💊',
      count: `${(categoryStats['Care Products'] || 0) + (categoryStats['Veterinary'] || 0) + (categoryStats['Grooming'] || 0)} Products`,
      link: '/pets-supplies?category=Care Products',
      color: 'bg-purple-500'
    }
  ];

  // Recent services data (from loaded services)
  const recentServices = services.slice(0, 6);

  // Pet Experts data
  const petExperts = [
    {
      id: 1,
      name: 'Dr. Sarah Ahmed',
      specialization: 'Veterinary Medicine',
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '15+ years',
      rating: 4.9,
      description: 'Specializes in pet health, vaccinations, and preventive care for all types of pets.',
      services: 'Health Checkups, Vaccinations, Surgery'
    },
    {
      id: 2,
      name: 'Dr. Rahman Hassan',
      specialization: 'Pet Surgery',
      location: 'Chattogram',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '12+ years',
      rating: 4.8,
      description: 'Expert in pet surgery and emergency medical care with state-of-the-art facilities.',
      services: 'Emergency Care, Surgery, Critical Care'
    },
    {
      id: 3,
      name: 'Dr. Fatema Khatun',
      specialization: 'Pet Nutrition & Wellness',
      location: 'Sylhet',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '10+ years',
      rating: 4.9,
      description: 'Nutrition specialist focusing on dietary needs and wellness programs for optimal pet health.',
      services: 'Nutrition, Wellness, Dietary Planning'
    },
    {
      id: 4,
      name: 'Dr. Karim Mahmud',
      specialization: 'Pet Behavior & Training',
      location: 'Rajshahi',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '8+ years',
      rating: 4.7,
      description: 'Behavioral expert helping pets with training, social issues, and mental health support.',
      services: 'Behavior Training, Socialization, Mental Health'
    }
  ];

  // Pet Heroes data
  const petHeroes = [
    {
      id: 1,
      name: 'Sarah Ahmed',
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      story: 'Adopted Max, a golden retriever, and they\'ve been inseparable companions for 2 years.',
      petName: 'Max',
      petType: 'Golden Retriever'
    },
    {
      id: 2,
      name: 'Rahman Family',
      location: 'Chattogram',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      story: 'Gave Luna the Persian cat a loving home where she thrives and brings joy daily.',
      petName: 'Luna',
      petType: 'Persian Cat'
    },
    {
      id: 3,
      name: 'Dr. Fatema',
      location: 'Sylhet',
      image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      story: 'Rescued Buddy from a shelter and now he\'s the office mascot bringing smiles to everyone.',
      petName: 'Buddy',
      petType: 'Mixed Breed'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="h-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div 
                className="relative h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedHero user={user} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Category Section */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing pets for adoption and quality pet supplies from trusted local sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={category.id}
                to={category.link}
                className="group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="text-sm font-medium text-warm-600">
                      {category.count}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section id="recent-listings" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out the latest pets and products available for adoption and purchase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentServices.map((service, index) => (
              <div 
                key={service.serviceId}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={service.image} 
                    alt={service.serviceName}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.category === 'Pet Adoption' 
                        ? 'bg-green-100 text-green-800' 
                        : service.category === 'Pet Food'
                        ? 'bg-yellow-100 text-yellow-800'
                        : service.category === 'Pet Accessories' || service.category === 'Pet Toys' || service.category === 'Pet Furniture' || service.category === 'Pet Clothing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {service.category}
                    </span>
                    <div className="text-sm text-gray-500">{service.providerName}</div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.serviceName}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {service.price === 0 ? (
                        <span className="text-lg font-bold text-green-600">Free for Adoption</span>
                      ) : (
                        <span className="text-2xl font-bold text-warm-600">৳{service.price}</span>
                      )}
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{service.rating}</span>
                      </div>
                    </div>
                    
                    <Link 
                      to={user ? `/service/${service.serviceId}` : '/login'}
                      className="btn-primary-warm text-sm"
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to view details');
                        }
                      }}
                    >
                      {service.type === 'adoption' ? 'Adopt Now' : 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12" data-aos="fade-up">
            <Link 
              to="/services"
              className="btn-primary-warm text-lg px-8 py-3"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gradient-to-br from-warm-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that drive everything we do at WarmPaws
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Save a Life Card */}
            <div 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Save a Life</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Your adoption helps reduce shelter overpopulation and gives a pet a second chance at happiness. Every adoption creates space for another animal in need.
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">2 Lives Saved</div>
                  <div className="text-sm text-green-700">The pet you adopt + the space created for another</div>
                </div>
              </div>
            </div>

            {/* Unconditional Love Card */}
            <div 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💝</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Unconditional Love</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Adopted pets often show incredible gratitude and form deep, lasting bonds with their new families. Experience the joy of a love that knows no bounds.
                </p>
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-pink-600 mb-1">100% Loyal</div>
                  <div className="text-sm text-pink-700">Dogs' unconditional love is scientifically proven</div>
                </div>
              </div>
            </div>

            {/* Support Community Card */}
            <div 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Community</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Help local pet owners, support responsible breeding practices, and strengthen the bonds within your community through shared love for animals.
                </p>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">Growing</div>
                  <div className="text-sm text-blue-700">Join thousands of caring pet lovers in our community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Adopt from PawMart */}
      <section className="py-16 bg-warm-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Adopt from PawMart?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Every pet deserves love and care. By adopting, you're giving a second chance to animals in need while enriching your own life with unconditional love.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Link 
                to="/pets-supplies?category=Pets" 
                className="bg-white text-warm-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Adopt a Pet Today
              </Link>
              <Link 
                to="/add-listing" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-warm-600 transition-colors duration-200"
              >
                List Your Pet
              </Link>
            </div>
            
            <div className="bg-warm-500 bg-opacity-50 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-3">💡 Did You Know?</h3>
              <p className="text-lg">
                Every adoption saves two lives - the pet you adopt and the space it creates for another animal in need. Together, we can create a community where every pet has a loving home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Pet Experts */}
      <section id="pet-experts" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Pet Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional veterinarians and specialists providing expert care for all your pet needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {petExperts.map((expert, index) => (
              <div 
                key={expert.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="aspect-square">
                  <img 
                    src={expert.image} 
                    alt={expert.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-warm-600 font-medium text-sm mb-1">
                    {expert.specialization}
                  </p>
                  <p className="text-gray-500 text-sm mb-2">
                    📍 {expert.location} • ⭐ {expert.rating} • 💼 {expert.experience}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {expert.description}
                  </p>
                  <div className="bg-warm-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">🏥</span>
                      <div>
                        <p className="text-xs font-medium text-gray-900">Specializes In:</p>
                        <p className="text-xs text-gray-600">{expert.services}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12" data-aos="fade-up">
            <Link 
              to="/medical-consultation"
              className="btn-primary-warm text-lg px-8 py-3"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Pet Heroes */}
      <section id="pet-heroes" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Pet Heroes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear inspiring stories from families who found their perfect companions through PawMart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {petHeroes.map((hero, index) => (
              <div 
                key={hero.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="aspect-square">
                  <img 
                    src={hero.image} 
                    alt={hero.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {hero.name}
                  </h3>
                  <p className="text-warm-600 font-medium mb-1">
                    {hero.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    "{hero.story}"
                  </p>
                  <div className="bg-warm-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🐾</span>
                      <div>
                        <p className="font-semibold text-gray-900">{hero.petName}</p>
                        <p className="text-sm text-gray-600">{hero.petType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;