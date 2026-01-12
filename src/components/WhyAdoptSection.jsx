import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const WhyAdoptSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6">
            <div className="bg-white px-6 py-2 rounded-full">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold">
                Why Adopt?
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Why Adopt from PawMart?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every pet deserves love and care. By adopting, you're giving a second chance to animals in need while enriching your own life with unconditional love.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl">
                  🐾
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Adopt a Pet Today
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Join thousands of happy families who have found their perfect companions through PawMart. Every adoption saves lives and creates lasting bonds.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
                  🏠
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    List Your Pet
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Have a pet that needs a loving home? List them on PawMart and connect with caring adopters in your community.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Link
                to="/listings"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Browse Available Pets</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-white/10 rounded-3xl"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/20 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/30 rounded-full animate-bounce"></div>

              <div className="relative z-10 text-center text-white">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6 inline-block"
                >
                  💡
                </motion.div>
                <h3 className="text-3xl font-bold mb-6">
                  Did You Know?
                </h3>
                <p className="text-lg mb-8 leading-relaxed opacity-95">
                  Every adoption saves two lives - the pet you adopt and the space it creates for another animal in need. Together, we can create a community where every pet has a loving home.
                </p>
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30">
                  <div className="text-5xl font-bold mb-2">2 Lives</div>
                  <div className="text-lg opacity-90">Saved per adoption</div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-teal-300 rounded-full animate-pulse"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyAdoptSection;