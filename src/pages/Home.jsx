import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useAuth } from '../contexts/AuthContext';
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

  // Load services from JSON
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/data/services.json');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
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

  // Winter tips data
  const winterTips = [
    {
      id: 1,
      title: 'Dress for Success',
      description: 'Keep your pets warm with appropriate winter clothing. Small dogs and short-haired breeds especially benefit from winter coats.',
      icon: '🧥'
    },
    {
      id: 2,
      title: 'Paw Protection',
      description: 'Check your pet\'s paws regularly for ice, salt, and other winter hazards. Consider using pet-safe ice melts.',
      icon: '🐾'
    },
    {
      id: 3,
      title: 'Indoor Exercise',
      description: 'Maintain your pet\'s exercise routine with indoor activities when temperatures drop below freezing.',
      icon: '🏠'
    },
    {
      id: 4,
      title: 'Hydration Matters',
      description: 'Ensure your pet has access to fresh water. Dehydration can occur in cold weather too!',
      icon: '💧'
    }
  ];

  // Expert vets data
  const experts = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Winter Pet Care Specialist',
      experience: '12 years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Expert in cold-weather pet health and winter safety protocols.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Emergency Veterinary Medicine',
      experience: '8 years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Specializes in treating hypothermia and winter-related pet emergencies.'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialization: 'Pet Nutrition & Wellness',
      experience: '10 years',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Helps pets maintain optimal health through proper winter nutrition.'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialization: 'Pet Behaviorist',
      experience: '15 years',
      image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      description: 'Understands how cold weather affects pet behavior and mental health.'
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
                  <div className="text-center text-white px-4 max-w-4xl">
                    <h1 
                      className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in"
                      data-aos="fade-up"
                      data-aos-delay="200"
                    >
                      {slide.title}
                    </h1>
                    <p 
                      className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in"
                      data-aos="fade-up"
                      data-aos-delay="400"
                    >
                      {slide.subtitle}
                    </p>
                    <button 
                      className="btn-primary-warm text-lg px-8 py-3 animate-bounce-slow"
                      data-aos="fade-up"
                      data-aos-delay="600"
                      onClick={() => {
                        if (!user) {
                          toast.error('Please login to access our services');
                        }
                      }}
                    >
                      <Link to={user ? "#services" : "/login"}>
                        {slide.cta}
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Popular Winter Care Services */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Winter Care Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most trusted winter pet care services to keep your furry friends warm and healthy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <div 
                key={service.serviceId} 
                className="card-warm p-6 hover:scale-105 transition-transform duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="aspect-w-16 aspect-h-9 mb-4 relative">
                  <img 
                    src={service.image} 
                    alt={service.serviceName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(service.serviceId)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      isFavorite(service.serviceId)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title={isFavorite(service.serviceId) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg 
                      className={`h-5 w-5 ${
                        isFavorite(service.serviceId) ? 'fill-current' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </button>
                </div>
                
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
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-warm-600">${service.price}</span>
                    <span className="text-gray-500 text-sm ml-1">/service</span>
                  </div>
                  <Link 
                    to={user ? `/service/${service.serviceId}` : '/login'}
                    className="btn-primary-warm text-sm"
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to view service details');
                      }
                    }}
                  >
                    View Details
                  </Link>
                </div>
                
                <div className="mt-3 text-sm text-gray-500">
                  <span>By {service.providerName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Expert Vets */}
      <section id="experts" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Expert Vets
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our team of experienced veterinarians specializes in winter pet care and emergency medicine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experts.map((expert, index) => (
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
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-warm-600 font-medium mb-1">
                    {expert.specialization}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    {expert.experience} experience
                  </p>
                  <p className="text-gray-600 text-sm">
                    {expert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact & Prevention Section */}
      <section className="py-16 bg-warm-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              24/7 Emergency Pet Care
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Winter emergencies can happen anytime. Our emergency care team is available around the clock to help your pet when they need it most.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-2">🚨</div>
                <h3 className="text-lg font-semibold mb-2">Hypothermia Treatment</h3>
                <p>Immediate care for pets showing signs of cold-related distress</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🐾</div>
                <h3 className="text-lg font-semibold mb-2">Paw Injuries</h3>
                <p>Treatment for cuts, frostbite, and ice-related paw damage</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🏥</div>
                <h3 className="text-lg font-semibold mb-2">Urgent Care</h3>
                <p>Round-the-clock emergency consultations and treatments</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <a 
                href="tel:+15551234567" 
                className="bg-white text-warm-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Emergency: (555) 123-4567
              </a>
              <Link 
                to="/safety-guide" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-warm-600 transition-colors duration-200"
              >
                Complete Safety Guide
              </Link>
            </div>
            
            <div className="bg-warm-500 bg-opacity-50 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-3">🛡️ Prevention is Better Than Cure</h3>
              <p className="text-lg">
                While we're here for emergencies, following our comprehensive winter safety checklist below can help prevent many winter-related pet health issues before they become serious.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Winter Prevention & Safety Tips */}
      <section id="safety-guide" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Winter Prevention & Safety Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Following these essential preventive measures can help keep your pets safe, warm, and healthy during the cold season, reducing the need for emergency care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {winterTips.map((tip, index) => (
              <div 
                key={tip.id}
                className="text-center p-6 rounded-lg hover:bg-warm-50 transition-colors duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-6xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Safety Tips */}
          <div className="bg-warm-50 rounded-lg p-8" data-aos="fade-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Additional Winter Safety Reminders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">❄️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Keep Pets Indoors</h4>
                    <p className="text-gray-600 text-sm">Limit outdoor time during extreme cold. Bring pets inside when temperatures drop below freezing.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🧤</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Check for Frostbite</h4>
                    <p className="text-gray-600 text-sm">Monitor ears, tail, and paws for signs of frostbite. Seek immediate vet care if suspected.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🚗</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Car Safety</h4>
                    <p className="text-gray-600 text-sm">Never leave pets in cold cars. Warm up vehicles before letting pets inside.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🧂</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Avoid Salt & Chemicals</h4>
                    <p className="text-gray-600 text-sm">Use pet-safe ice melts. Wash paws after walks to remove harmful substances.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-3">🏠</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Supplies</h4>
                    <p className="text-gray-600 text-sm">Keep emergency contact numbers and basic first aid supplies readily available.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-2xl mr-3">⏰</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Monitor Closely</h4>
                    <p className="text-gray-600 text-sm">Watch for signs of cold stress: shivering, lethargy, pale gums, or difficulty breathing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;