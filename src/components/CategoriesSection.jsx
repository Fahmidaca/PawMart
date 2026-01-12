import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const CategoriesSection = ({ services }) => {
  // Generate categories from services data with real counts - memoized for performance
  const categoryStats = useMemo(() => {
    const stats = {};
    services.forEach(service => {
      if (!stats[service.category]) {
        stats[service.category] = 0;
      }
      stats[service.category]++;
    });
    return stats;
  }, [services]);

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

  return (
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
  );
};

export default CategoriesSection;