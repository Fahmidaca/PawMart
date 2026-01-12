import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const RecentListingsSection = ({ services }) => {
  const { user } = useAuth();

  // Recent services data (from loaded services) - map to expected format
  const recentServices = services.slice(0, 6).map(service => ({
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    price: service.price,
    location: service.location,
    description: service.description,
    image: service.image,
    email: service.email,
    date: service.date,
    providerName: service.ownerName,
    rating: service.rating || 4.5,
    type: service.price === 0 ? 'adoption' : 'product'
  }));

  return (
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
                  loading="lazy"
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
  );
};

export default RecentListingsSection;