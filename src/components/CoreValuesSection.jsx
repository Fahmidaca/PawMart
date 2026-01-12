import { motion } from 'framer-motion';

const CoreValuesSection = () => {
  const values = [
    {
      icon: '🏠',
      title: 'Save a Life',
      description: 'Your adoption helps reduce shelter overpopulation and gives a pet a second chance at happiness. Every adoption creates space for another animal in need.',
      stat: '2 Lives Saved',
      statDesc: 'The pet you adopt + the space created for another',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: '💝',
      title: 'Unconditional Love',
      description: 'Adopted pets often show incredible gratitude and form deep, lasting bonds with their new families. Experience the joy of a love that knows no bounds.',
      stat: '100% Loyal',
      statDesc: 'Dogs\' unconditional love is scientifically proven',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      icon: '🌍',
      title: 'Support Community',
      description: 'Help local pet owners, support responsible breeding practices, and strengthen the bonds within your community through shared love for animals.',
      stat: 'Growing',
      statDesc: 'Join thousands of caring pet lovers in our community',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-warm-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-warm-500 to-purple-500 rounded-full mb-4">
            <div className="bg-white px-6 py-2 rounded-full">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-600 to-purple-600 font-semibold">
                Our Values
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Our Core Values
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The principles that drive everything we do at WarmPaws
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 }
              }}
              className={`bg-gradient-to-br ${value.bgGradient} rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 border border-white/50 backdrop-blur-sm relative group overflow-hidden`}
            >
              {/* Animated background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>

              {/* Floating icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative z-10"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${value.gradient} text-white text-4xl mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {value.icon}
                </div>
              </motion.div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {value.description}
                </p>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent mb-2`}>
                    {value.stat}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {value.statDesc}
                  </div>
                </div>
              </div>

              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-white/30 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/40 rounded-full"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;