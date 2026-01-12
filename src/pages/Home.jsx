import { useState, useEffect, Suspense, lazy, memo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { listingsAPI } from '../services/api';

// Lazy load all sections for better performance
const HeroSection = lazy(() => import('../components/HeroSection'));
const CategoriesSection = lazy(() => import('../components/CategoriesSection'));
const RecentListingsSection = lazy(() => import('../components/RecentListingsSection'));
const CoreValuesSection = lazy(() => import('../components/CoreValuesSection'));
const WhyAdoptSection = lazy(() => import('../components/WhyAdoptSection'));
const PetExpertsSection = lazy(() => import('../components/PetExpertsSection'));
const PetHeroesSection = lazy(() => import('../components/PetHeroesSection'));

// Loading component for sections
const SectionLoading = () => (
  <div className="flex items-center justify-center py-16">
    <div className="loading loading-spinner loading-lg text-warm-500"></div>
  </div>
);

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load listings from API (MongoDB) with caching
  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await listingsAPI.getAll({ limit: 6 });
        setServices(data.listings || data);
      } catch (error) {
        console.warn('API failed, using fallback data:', error.message);
        // Fallback to static JSON if API fails
        try {
          const fallbackResponse = await fetch('/data/services.json');
          const fallbackData = await fallbackResponse.json();
          setServices(fallbackData);
          toast.info('Using offline data - some features may be limited');
        } catch (fallbackError) {
          console.error('Fallback data also failed:', fallbackError);
          toast.error('Unable to load listings. Please check your connection.');
          // Provide minimal fallback data
          setServices([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <HeroSection />
      </Suspense>

      {/* Category Section - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <CategoriesSection services={services} />
      </Suspense>

      {/* Recent Listings - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <RecentListingsSection services={services} />
      </Suspense>

      {/* Core Values Section - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <CoreValuesSection />
      </Suspense>

      {/* Why Adopt Section - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <WhyAdoptSection />
      </Suspense>

      {/* Pet Experts Section - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <PetExpertsSection />
      </Suspense>

      {/* Pet Heroes Section - Lazy loaded */}
      <Suspense fallback={<SectionLoading />}>
        <PetHeroesSection />
      </Suspense>
    </div>
  );
};

export default memo(Home);