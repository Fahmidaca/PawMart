import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Filter, 
  Star, 
  Home, 
  Users, 
  Activity,
  Calendar,
  PawPrint,
  Search,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

const AIPetMatcher = () => {
  const [userProfile, setUserProfile] = useState({
    livingSpace: 'apartment',
    activityLevel: 'moderate',
    experience: 'beginner',
    familySize: 2,
    hasYard: false,
    timeAtHome: 'full-time',
    preferredSize: 'medium',
    agePreference: 'any',
    specialNeeds: false
  });

  const [availablePets, setAvailablePets] = useState([]);
  const [matches, setMatches] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    radius: 50,
    breed: '',
    age: '',
    size: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock pet data
  const mockPets = [
    {
      id: '1',
      name: 'Luna',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      size: 'Large',
      gender: 'Female',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
      description: 'Playful and loving, great with families',
      compatibility: 95,
      location: { city: 'Dhaka', distance: 2.3 },
      traits: ['Friendly', 'Active', 'Good with kids'],
      healthStatus: 'Excellent',
      adoptionFee: 15000
    },
    {
      id: '2',
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      age: '3 years',
      size: 'Medium',
      gender: 'Male',
      photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
      description: 'Calm and gentle, perfect for apartment living',
      compatibility: 88,
      location: { city: 'Dhaka', distance: 5.1 },
      traits: ['Calm', 'Indoor', 'Low maintenance'],
      healthStatus: 'Good',
      adoptionFee: 8000
    },
    {
      id: '3',
      name: 'Bruno',
      species: 'Dog',
      breed: 'Labrador',
      age: '1 year',
      size: 'Large',
      gender: 'Male',
      photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400',
      description: 'Energetic puppy, loves to play fetch',
      compatibility: 92,
      location: { city: 'Chittagong', distance: 15.7 },
      traits: ['Energetic', 'Trainable', 'Loyal'],
      healthStatus: 'Excellent',
      adoptionFee: 12000
    },
    {
      id: '4',
      name: 'Mittens',
      species: 'Cat',
      breed: 'Maine Coon',
      age: '4 years',
      size: 'Large',
      gender: 'Female',
      photo: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400',
      description: 'Majestic and affectionate, loves attention',
      compatibility: 85,
      location: { city: 'Sylhet', distance: 22.4 },
      traits: ['Affectionate', 'Majestic', 'Vocal'],
      healthStatus: 'Good',
      adoptionFee: 10000
    }
  ];

  useEffect(() => {
    setAvailablePets(mockPets);
    calculateMatches();
  }, [userProfile]);

  const calculateCompatibility = (pet) => {
    let score = 50; // Base score

    // Size compatibility
    if (userProfile.preferredSize === pet.size || userProfile.preferredSize === 'any') {
      score += 20;
    }

    // Living space compatibility
    if (userProfile.livingSpace === 'house' && pet.traits.includes('Active')) {
      score += 15;
    } else if (userProfile.livingSpace === 'apartment' && pet.traits.includes('Calm')) {
      score += 15;
    }

    // Activity level compatibility
    const activityMatch = {
      'low': ['Calm', 'Low maintenance'],
      'moderate': ['Friendly', 'Good with kids'],
      'high': ['Active', 'Energetic', 'Playful']
    };

    if (activityMatch[userProfile.activityLevel]?.some(trait => pet.traits.includes(trait))) {
      score += 15;
    }

    // Experience level compatibility
    if (userProfile.experience === 'beginner' && pet.traits.includes('Trainable')) {
      score += 10;
    }

    return Math.min(score, 100);
  };

  const calculateMatches = () => {
    const petMatches = availablePets.map(pet => ({
      ...pet,
      compatibility: calculateCompatibility(pet),
      matchReasons: generateMatchReasons(pet)
    })).sort((a, b) => b.compatibility - a.compatibility);

    setMatches(petMatches);
  };

  const generateMatchReasons = (pet) => {
    const reasons = [];
    
    if (userProfile.livingSpace === 'apartment' && pet.traits.includes('Calm')) {
      reasons.push('Perfect for apartment living');
    }
    if (userProfile.activityLevel === 'high' && pet.traits.includes('Active')) {
      reasons.push('Matches your active lifestyle');
    }
    if (userProfile.familySize > 2 && pet.traits.includes('Good with kids')) {
      reasons.push('Great with families');
    }
    if (userProfile.experience === 'beginner' && pet.traits.includes('Trainable')) {
      reasons.push('Easy to train for beginners');
    }

    return reasons;
  };

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          AI-Powered Pet Matching
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find your perfect companion with our intelligent matching system
        </p>
      </div>

      {/* User Profile Setup */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Your Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Living Space
            </label>
            <select
              value={userProfile.livingSpace}
              onChange={(e) => setUserProfile(prev => ({ ...prev, livingSpace: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Activity Level
            </label>
            <select
              value={userProfile.activityLevel}
              onChange={(e) => setUserProfile(prev => ({ ...prev, activityLevel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Low (Couch potato)</option>
              <option value="moderate">Moderate (Daily walks)</option>
              <option value="high">High (Very active)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Experience Level
            </label>
            <select
              value={userProfile.experience}
              onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="experienced">Experienced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Family Size
            </label>
            <select
              value={userProfile.familySize}
              onChange={(e) => setUserProfile(prev => ({ ...prev, familySize: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="1">Just me</option>
              <option value="2">Couple</option>
              <option value="3">Small family (3-4)</option>
              <option value="5">Large family (5+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preferred Size
            </label>
            <select
              value={userProfile.preferredSize}
              onChange={(e) => setUserProfile(prev => ({ ...prev, preferredSize: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="any">No preference</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time at Home
            </label>
            <select
              value={userProfile.timeAtHome}
              onChange={(e) => setUserProfile(prev => ({ ...prev, timeAtHome: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="remote">Work from home</option>
              <option value="variable">Variable schedule</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Filter className="h-5 w-5 text-green-500" />
            Search Filters
          </h3>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="City or area"
              value={searchFilters.location}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Distance (km)
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={searchFilters.radius}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{searchFilters.radius} km</span>
          </div>

          {showAdvanced && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Breed
                </label>
                <select
                  value={searchFilters.breed}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, breed: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any breed</option>
                  <option value="labrador">Labrador</option>
                  <option value="golden-retriever">Golden Retriever</option>
                  <option value="german-shepherd">German Shepherd</option>
                  <option value="persian">Persian</option>
                  <option value="maine-coon">Maine Coon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Age
                </label>
                <select
                  value={searchFilters.age}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any age</option>
                  <option value="puppy">Puppy/Kitten (&lt; 1 year)</option>
                  <option value="young">Young (1-3 years)</option>
                  <option value="adult">Adult (3-7 years)</option>
                  <option value="senior">Senior (7+ years)</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Matches */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Your Top Matches ({matches.length} pets)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.slice(0, 6).map((pet) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative">
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityColor(pet.compatibility)}`}>
                    {pet.compatibility}% Match
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                    {pet.name}
                  </h4>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {pet.location.distance} km
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {pet.breed} • {pet.age} • {pet.gender}
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  {pet.description}
                </p>

                {/* Match Reasons */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Why you're a great match:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {pet.matchReasons.map((reason, index) => (
                      <span
                        key={index}
                        className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Traits */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {pet.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Fee: ৳{pet.adoptionFee.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Details
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Request Info
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <PawPrint className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No matches found. Try adjusting your preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPetMatcher;