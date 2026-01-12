import { motion } from 'framer-motion';

const PetHeroesSection = () => {
  const heroes = [
    {
      name: 'Sarah Ahmed',
      location: 'Dhaka',
      story: 'Adopted Max, a golden retriever, and they\'ve been inseparable companions for 2 years.',
      petName: 'Max',
      petType: 'Golden Retriever',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-amber-400 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      name: 'Rahman Family',
      location: 'Chattogram',
      story: 'Gave Luna the Persian cat a loving home where she thrives and brings joy daily.',
      petName: 'Luna',
      petType: 'Persian Cat',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-rose-400 to-pink-500',
      bgGradient: 'from-rose-50 to-pink-50'
    },
    {
      name: 'Dr. Fatema',
      location: 'Sylhet',
      story: 'Rescued Buddy from a shelter and now he\'s the office mascot bringing smiles to everyone.',
      petName: 'Buddy',
      petType: 'Mixed Breed',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-rose-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-200/40 to-orange-200/40 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-tr from-pink-200/40 to-rose-200/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-6">
            <div className="bg-white px-6 py-2 rounded-full">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 font-semibold">
                Success Stories
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Meet Our Pet Heroes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear inspiring stories from families who found their perfect companions through PawMart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {heroes.map((hero, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`bg-gradient-to-br ${hero.bgGradient} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm relative group overflow-hidden`}
            >
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${hero.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>

              {/* Decorative top border */}
              <div className={`h-1 bg-gradient-to-r ${hero.gradient} rounded-t-3xl`}></div>

              <div className="p-8 relative z-10">
                <div className="flex items-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${hero.gradient} flex items-center justify-center text-white text-2xl mr-4 shadow-lg`}
                  >
                    👤
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">{hero.name}</h3>
                    <p className="text-sm text-gray-600 font-medium flex items-center">
                      <span className="mr-1">📍</span>
                      {hero.location}
                    </p>
                  </div>
                </div>

                <motion.blockquote
                  className="text-gray-700 mb-6 italic leading-relaxed text-lg relative"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="absolute -top-2 -left-2 text-4xl text-gray-300">"</span>
                  {hero.story}
                  <span className="absolute -bottom-4 -right-2 text-4xl text-gray-300">"</span>
                </motion.blockquote>

                <motion.div
                  className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    className="text-4xl mr-4"
                  >
                    🐾
                  </motion.div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{hero.petName}</div>
                    <div className="text-sm text-gray-600 font-medium">{hero.petType}</div>
                  </div>
                </motion.div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-white/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetHeroesSection;