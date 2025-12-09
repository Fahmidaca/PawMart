import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { Tooltip } from 'react-tooltip';

const AnimatedHero = ({ user }) => {
  const [text] = useTypewriter({
    words: [
      'Find Your Furry Friend',
      'Adopt Love & Care',
      'Keep Pets Warm & Safe',
      'Expert Pet Services'
    ],
    loop: {},
    typeSpeed: 80,
    deleteSpeed: 50,
    delaySpeed: 2000,
  });

  const tooltipContent = {
    'Find Your Furry Friend': 'Browse our selection of adorable pets waiting for loving homes',
    'Adopt Love & Care': 'Give a pet a second chance at happiness',
    'Keep Pets Warm & Safe': 'Professional winter care services for your beloved pets',
    'Expert Pet Services': 'Connect with trusted veterinarians and pet care specialists'
  };

  return (
    <div className="text-center text-white px-4 max-w-4xl">
      <h1 
        className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <span
          data-tooltip-id="hero-tooltip"
          data-tooltip-content={tooltipContent[text] || 'WarmPaws - Your trusted pet care platform'}
          data-tooltip-place="bottom"
          className="cursor-help"
        >
          {text}
        </span>
        <Cursor cursorColor="#f1761a" />
      </h1>
      
      <p 
        className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Connect with local pet owners, discover amazing pets for adoption, and access trusted pet care services
      </p>
      
      <div 
        className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <button 
          className="btn-primary-warm text-lg px-8 py-3 animate-bounce-slow"
          data-tooltip-id="browse-tooltip"
          data-tooltip-content="Explore our marketplace of pets and supplies"
          onClick={() => {
            if (!user) {
              alert('Please login to access our services');
            }
          }}
        >
          <a href={user ? "/pets-supplies" : "/login"}>
            Browse Pets & Supplies
          </a>
        </button>
        
        <button 
          className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-warm-600 transition-colors duration-200"
          data-tooltip-id="services-tooltip"
          data-tooltip-content="View our professional pet care services"
        >
          <a href="/services">
            Our Services
          </a>
        </button>
      </div>
      
      {/* Global Tooltip Styles */}
      <Tooltip
        id="hero-tooltip"
        style={{
          backgroundColor: '#363636',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          maxWidth: '250px',
          textAlign: 'center',
          zIndex: 9999,
        }}
      />
      
      <Tooltip
        id="browse-tooltip"
        style={{
          backgroundColor: '#363636',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          maxWidth: '250px',
          textAlign: 'center',
          zIndex: 9999,
        }}
      />
      
      <Tooltip
        id="services-tooltip"
        style={{
          backgroundColor: '#363636',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '14px',
          maxWidth: '250px',
          textAlign: 'center',
          zIndex: 9999,
        }}
      />
    </div>
  );
};

export default AnimatedHero;