import { motion } from 'framer-motion';

const PetExpertsSection = () => {
  const experts = [
    {
      name: 'Dr. Sarah Ahmed',
      title: 'Veterinary Medicine',
      location: 'Dhaka',
      rating: 4.9,
      experience: '15+ years',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Health Checkups', 'Vaccinations', 'Surgery'],
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50'
    },
    {
      name: 'Dr. Rahman Hassan',
      title: 'Pet Surgery',
      location: 'Chattogram',
      rating: 4.8,
      experience: '12+ years',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Emergency Care', 'Surgery', 'Critical Care'],
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50'
    },
    {
      name: 'Dr. Fatema Khatun',
      title: 'Pet Nutrition & Wellness',
      location: 'Sylhet',
      rating: 4.9,
      experience: '10+ years',
      image: 'https://images.unsplash.com/photo-1594824804732-ca8db723f8fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Nutrition', 'Wellness', 'Dietary Planning'],
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50'
    },
    {
      name: 'Dr. Karim Mahmud',
      title: 'Pet Behavior & Training',
      location: 'Rajshahi',
      rating: 4.7,
      experience: '8+ years',
      image: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      specialties: ['Behavior Training', 'Socialization', 'Mental Health'],
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-50 to-violet-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-pink-200/20 to-red-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
            <div className="bg-white px-6 py-2 rounded-full">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold">
                Our Experts
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Meet Our Pet Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional veterinarians and specialists providing expert care for all your pet needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experts.map((expert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`bg-gradient-to-br ${expert.bgGradient} rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm relative group`}
            >
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${expert.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>

              <div className="p-6 relative z-10">
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${expert.gradient} flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}
                  >
                    🩺
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{expert.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{expert.title}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 bg-white/50 rounded-lg px-3 py-2">
                    <span className="mr-2 text-lg">📍</span>
                    <span className="font-medium">{expert.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-white/50 rounded-lg px-3 py-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">⭐</span>
                      <span className="font-bold text-yellow-600">{expert.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2 text-lg">💼</span>
                      <span className="font-medium">{expert.experience}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Specializes In:</h4>
                  <div className="flex flex-wrap gap-2">
                    {expert.specialties.map((specialty, idx) => (
                      <motion.span
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        className={`text-xs bg-gradient-to-r ${expert.gradient} text-white px-3 py-1.5 rounded-full font-medium shadow-sm`}
                      >
                        {specialty}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full bg-gradient-to-r ${expert.gradient} text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-sm`}
                >
                  Book Consultation
                </motion.button>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetExpertsSection;