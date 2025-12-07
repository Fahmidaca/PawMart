import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    name: user?.displayName || '',
    email: user?.email || ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setService(result.data);
        } else {
          toast.error('Service not found');
          navigate('/services');
          return;
        }
      } catch (error) {
        console.error('Error loading service:', error);
        toast.error('Failed to load service details');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Create order via API
    try {
      const orderData = {
        buyerName: bookingForm.name,
        email: bookingForm.email,
        productId: service.serviceId.toString(),
        productName: service.serviceName,
        price: service.price,
        quantity: 1,
        address: 'TBD', // You can add address field to the form
        phone: 'TBD', // You can add phone field to the form
        userId: user?.uid || null
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Service booked successfully! You will receive a confirmation email shortly.');
        
        // Clear the form
        setBookingForm({
          name: user?.displayName || '',
          email: user?.email || ''
        });
      } else {
        toast.error('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary-warm"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Image */}
          <div className="aspect-w-16 aspect-h-9">
            <img 
              src={service.image} 
              alt={service.serviceName}
              className="w-full h-96 lg:h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div data-aos="fade-up">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-warm-600 bg-warm-100 px-3 py-1 rounded-full">
                  {service.category}
                </span>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-lg font-medium text-gray-900 ml-1">{service.rating}</span>
                  <span className="text-gray-500 ml-1">(based on reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {service.serviceName}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {service.description}
              </p>

              <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-warm-600">${service.price}</span>
                    <span className="text-gray-500 ml-1">/service</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Professional service guarantee</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Available Slots</p>
                  <p className="text-2xl font-bold text-green-600">{service.slotsAvailable}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Provider</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-warm-500 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{service.providerName}</p>
                    <p className="text-sm text-gray-500">{service.providerEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Book This Service
            </h2>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={bookingForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-warm-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={bookingForm.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-warm-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="bg-warm-50 border border-warm-200 rounded-lg p-4">
                <h4 className="font-medium text-warm-800 mb-2">Booking Summary</h4>
                <div className="text-sm text-warm-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{service.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <span className="font-medium">{service.providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">${service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Slots:</span>
                    <span className="font-medium">{service.slotsAvailable}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || service.slotsAvailable === 0}
                className="w-full bg-warm-600 hover:bg-warm-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : service.slotsAvailable === 0 ? 'No Slots Available' : 'Book Now'}
              </button>

              {service.slotsAvailable === 0 && (
                <p className="text-center text-red-600 text-sm">
                  This service is currently fully booked. Please check back later.
                </p>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Your booking will be confirmed via email. No payment required for demo purposes.</p>
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center" data-aos="fade-up">
            Similar Services You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* This would be populated with related services in a real app */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🐕</div>
              <h4 className="font-semibold text-gray-900 mb-2">Premium Dog Walking</h4>
              <p className="text-gray-600 text-sm mb-4">Professional walking services for all weather conditions</p>
              <p className="text-warm-600 font-bold">$18 - $25</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h4 className="font-semibold text-gray-900 mb-2">Indoor Pet Exercise</h4>
              <p className="text-gray-600 text-sm mb-4">Keep your pets active when it's too cold outside</p>
              <p className="text-warm-600 font-bold">$15 - $20</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Pet Photography</h4>
              <p className="text-gray-600 text-sm mb-4">Capture memories of your pet in winter settings</p>
              <p className="text-warm-600 font-bold">$35 - $50</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;