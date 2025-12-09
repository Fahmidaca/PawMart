import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAt,
  endAt
} from 'firebase/firestore';
import { compatibilityAlgorithm } from '../utils/compatibilityAlgorithm';

class MatchingService {
  constructor() {
    this.listingsRef = collection(db, 'listings');
    this.userPreferencesRef = collection(db, 'userPreferences');
    this.petMatchesRef = collection(db, 'petMatches');
    this.compatibilityScoresRef = collection(db, 'compatibilityScores');
  }

  // Advanced Pet Search with AI Matching
  async findMatchingPets(userPreferences, filters = {}) {
    try {
      let baseQuery = this.listingsRef;
      let queryConstraints = [];

      // Apply basic filters
      if (filters.species) {
        queryConstraints.push(where('species', '==', filters.species));
      }
      if (filters.breed) {
        queryConstraints.push(where('breed', '==', filters.breed));
      }
      if (filters.ageRange) {
        const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
        queryConstraints.push(where('age', '>=', minAge));
        queryConstraints.push(where('age', '<=', maxAge));
      }
      if (filters.gender) {
        queryConstraints.push(where('gender', '==', filters.gender));
      }
      if (filters.size) {
        queryConstraints.push(where('size', '==', filters.size));
      }
      if (filters.location) {
        queryConstraints.push(where('location', '>=', filters.location.city));
        queryConstraints.push(where('location', '<=', filters.location.city + '\uf8ff'));
      }

      // Apply status filter for available pets
      queryConstraints.push(where('status', '==', 'available'));

      // Execute base query
      let q = query(baseQuery, ...queryConstraints, orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const pets = [];
      querySnapshot.forEach((doc) => {
        pets.push({ id: doc.id, ...doc.data() });
      });

      // Apply AI-powered compatibility scoring
      const scoredPets = await this.calculateCompatibilityScores(pets, userPreferences);
      
      // Sort by compatibility score
      scoredPets.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

      return { 
        success: true, 
        pets: scoredPets.slice(0, 20), // Return top 20 matches
        totalMatches: pets.length 
      };
    } catch (error) {
      console.error('Error finding matching pets:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate AI Compatibility Scores
  async calculateCompatibilityScores(pets, userPreferences) {
    return pets.map(pet => ({
      ...pet,
      compatibilityScore: compatibilityAlgorithm.calculateScore(pet, userPreferences),
      matchReasons: compatibilityAlgorithm.getMatchReasons(pet, userPreferences)
    }));
  }

  // Get Personalized Recommendations
  async getPersonalizedRecommendations(userId, limitCount = 10) {
    try {
      // Get user preferences
      const userPrefsDoc = await getDoc(doc(this.userPreferencesRef, userId));
      const userPreferences = userPrefsDoc.exists() ? userPrefsDoc.data() : this.getDefaultPreferences();

      // Get recent user activity (pets viewed, favorited, etc.)
      const userActivity = await this.getUserActivity(userId);
      
      // Generate recommendations based on activity
      const recommendations = await this.generateActivityBasedRecommendations(userActivity, userPreferences);
      
      // Save recommendations to database
      await this.saveRecommendations(userId, recommendations);

      return { 
        success: true, 
        recommendations: recommendations.slice(0, limitCount) 
      };
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate Activity-Based Recommendations
  async generateActivityBasedRecommendations(userActivity, userPreferences) {
    const { viewedPets, favoritedPets, adoptedPets } = userActivity;
    
    // Analyze patterns in user behavior
    const preferences = this.analyzeUserPatterns(userActivity, userPreferences);
    
    // Find similar pets based on patterns
    const similarPets = await this.findSimilarPets(preferences, viewedPets, favoritedPets);
    
    return similarPets;
  }

  // Analyze User Behavioral Patterns
  analyzeUserPatterns(userActivity, userPreferences) {
    const patterns = {
      preferredSpecies: [],
      preferredBreeds: [],
      preferredAgeRange: [],
      preferredSizes: [],
      lifestyleCompatibility: []
    };

    // Analyze favorited pets
    userActivity.favoritedPets?.forEach(pet => {
      patterns.preferredSpecies.push(pet.species);
      patterns.preferredBreeds.push(pet.breed);
      patterns.preferredAgeRange.push(pet.age);
      patterns.preferredSizes.push(pet.size);
    });

    // Analyze adopted pets
    userActivity.adoptedPets?.forEach(pet => {
      patterns.preferredSpecies.push(pet.species);
      patterns.preferredBreeds.push(pet.breed);
      patterns.preferredAgeRange.push(pet.age);
      patterns.preferredSizes.push(pet.size);
    });

    // Return most common preferences
    return {
      species: this.getMostCommon(patterns.preferredSpecies) || userPreferences.preferredSpecies,
      breed: this.getMostCommon(patterns.preferredBreeds) || userPreferences.preferredBreed,
      ageRange: this.calculatePreferredAgeRange(patterns.preferredAgeRange),
      size: this.getMostCommon(patterns.preferredSizes) || userPreferences.preferredSize,
      lifestyle: userPreferences.lifestyle
    };
  }

  // Find Similar Pets Based on Preferences
  async findSimilarPets(preferences, viewedPets, favoritedPets) {
    const similarPetIds = new Set();
    
    // Get IDs of pets user has interacted with
    [...viewedPets, ...favoritedPets].forEach(pet => {
      similarPetIds.add(pet.id);
    });

    // Find pets with similar characteristics
    const queryConstraints = [
      where('status', '==', 'available'),
      where('species', '==', preferences.species)
    ];

    let q = query(this.listingsRef, ...queryConstraints, orderBy('createdAt', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    const similarPets = [];

    querySnapshot.forEach((doc) => {
      const pet = { id: doc.id, ...doc.data() };
      if (!similarPetIds.has(pet.id)) {
        const score = this.calculateSimilarityScore(pet, preferences);
        if (score > 0.7) { // High similarity threshold
          similarPets.push({
            ...pet,
            similarityScore: score,
            reason: 'Similar to your previous interests'
          });
        }
      }
    });

    return similarPets.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Calculate Similarity Score
  calculateSimilarityScore(pet, preferences) {
    let score = 0;
    let factors = 0;

    // Species match (40% weight)
    if (pet.species === preferences.species) {
      score += 0.4;
    }
    factors++;

    // Breed similarity (25% weight)
    if (pet.breed === preferences.breed) {
      score += 0.25;
    }
    factors++;

    // Size preference (20% weight)
    if (pet.size === preferences.size) {
      score += 0.2;
    }
    factors++;

    // Age range compatibility (15% weight)
    if (pet.age >= preferences.ageRange.min && pet.age <= preferences.ageRange.max) {
      score += 0.15;
    }
    factors++;

    return score / factors;
  }

  // Quick Match Presets
  async getQuickMatchPresets() {
    return {
      success: true,
      presets: [
        {
          id: 'first-time-owner',
          name: 'First-Time Pet Owner',
          description: 'Friendly, easy-to-care-for pets perfect for beginners',
          preferences: {
            species: 'Dog',
            ageRange: { min: 1, max: 3 },
            size: 'Medium',
            energy: 'Moderate',
            training: 'Easy'
          }
        },
        {
          id: 'apartment-living',
          name: 'Apartment Living',
          description: 'Low-maintenance pets suitable for small spaces',
          preferences: {
            species: 'Cat',
            ageRange: { min: 1, max: 5 },
            size: 'Small',
            energy: 'Low',
            space: 'Indoor'
          }
        },
        {
          id: 'active-family',
          name: 'Active Family',
          description: 'Energetic pets for families who love outdoor activities',
          preferences: {
            species: 'Dog',
            ageRange: { min: 1, max: 2 },
            size: 'Large',
            energy: 'High',
            familyFriendly: true
          }
        },
        {
          id: 'senior-companion',
          name: 'Senior Companion',
          description: 'Calm, gentle pets perfect for older adults',
          preferences: {
            species: 'Cat',
            ageRange: { min: 5, max: 10 },
            size: 'Medium',
            energy: 'Low',
            temperament: 'Gentle'
          }
        },
        {
          id: 'hypoallergenic',
          name: 'Hypoallergenic',
          description: 'Pets with minimal shedding for allergy sufferers',
          preferences: {
            species: 'Dog',
            breed: ['Poodle', 'Bichon Frise', 'Portuguese Water Dog'],
            shedding: 'Low'
          }
        }
      ]
    };
  }

  // Apply Quick Match Preset
  async applyQuickMatchPreset(userId, presetId) {
    try {
      const { presets } = await this.getQuickMatchPresets();
      const preset = presets.find(p => p.id === presetId);
      
      if (!preset) {
        return { success: false, error: 'Preset not found' };
      }

      // Update user preferences with preset
      await updateDoc(doc(this.userPreferencesRef, userId), {
        quickMatchPreset: presetId,
        preferences: preset.preferences,
        updatedAt: new Date()
      });

      // Generate matches based on preset
      const matches = await this.findMatchingPets(preset.preferences);
      
      return { success: true, matches: matches.pets, preset };
    } catch (error) {
      console.error('Error applying quick match preset:', error);
      return { success: false, error: error.message.message };
    }
  }

  // Geographic Search
  async searchByLocation(location, radius = 50, preferences = {}) {
    try {
      // This would typically use a geolocation service like Google Maps API
      // For now, we'll use a simple city-based search
      
      let queryConstraints = [
        where('status', '==', 'available'),
        where('location.city', '>=', location.city),
        where('location.city', '<=', location.city + '\uf8ff')
      ];

      let q = query(this.listingsRef, ...queryConstraints, orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      const pets = [];
      
      querySnapshot.forEach((doc) => {
        pets.push({ id: doc.id, ...doc.data() });
      });

      // Apply preferences and scoring
      const scoredPets = await this.calculateCompatibilityScores(pets, preferences);
      
      return { 
        success: true, 
        pets: scoredPets.slice(0, 20),
        location: location.city 
      };
    } catch (error) {
      console.error('Error searching by location:', error);
      return { success: false, error: error.message };
    }
  }

  // Save User Interaction for Learning
  async recordUserInteraction(userId, petId, interactionType) {
    try {
      const interaction = {
        userId,
        petId,
        type: interactionType, // 'view', 'favorite', 'contact', 'adopt'
        timestamp: new Date(),
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      };

      await addDoc(collection(db, 'userInteractions'), interaction);
      
      return { success: true };
    } catch (error) {
      console.error('Error recording user interaction:', error);
      return { success: false, error: error.message };
    }
  }

  // Get User Activity
  async getUserActivity(userId) {
    try {
      const interactionsRef = collection(db, 'userInteractions');
      const q = query(
        interactionsRef, 
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(q);
      const interactions = [];
      querySnapshot.forEach((doc) => {
        interactions.push({ id: doc.id, ...doc.data() });
      });

      return {
        viewedPets: interactions.filter(i => i.type === 'view'),
        favoritedPets: interactions.filter(i => i.type === 'favorite'),
        contactedPets: interactions.filter(i => i.type === 'contact'),
        adoptedPets: interactions.filter(i => i.type === 'adopt')
      };
    } catch (error) {
      console.error('Error getting user activity:', error);
      return { success: false, error: error.message };
    }
  }

  // Save Recommendations
  async saveRecommendations(userId, recommendations) {
    try {
      const recommendationData = {
        userId,
        recommendations: recommendations.map(pet => ({
          petId: pet.id,
          score: pet.similarityScore || pet.compatibilityScore,
          reason: pet.reason,
          createdAt: new Date()
        })),
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };

      await addDoc(this.petMatchesRef, recommendationData);
      return { success: true };
    } catch (error) {
      console.error('Error saving recommendations:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper Methods
  getDefaultPreferences() {
    return {
      species: '',
      breed: '',
      ageRange: { min: 0, max: 15 },
      size: '',
      gender: '',
      energy: '',
      training: '',
      familyFriendly: false,
      goodWithKids: false,
      goodWithPets: false,
      shedding: '',
      location: { city: '', radius: 50 },
      lifestyle: {
        activity: 'moderate',
        space: 'medium',
        experience: 'beginner'
      }
    };
  }

  getMostCommon(array) {
    if (!array || array.length === 0) return null;
    const frequency = {};
    array.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  calculatePreferredAgeRange(ages) {
    if (!ages || ages.length === 0) return { min: 0, max: 15 };
    
    const sortedAges = ages.sort((a, b) => a - b);
    const median = sortedAges[Math.floor(sortedAges.length / 2)];
    
    return {
      min: Math.max(0, median - 2),
      max: median + 3
    };
  }

  // Advanced Filtering
  async applyAdvancedFilters(pets, filters) {
    let filteredPets = [...pets];

    // Special needs filtering
    if (filters.specialNeeds) {
      filteredPets = filteredPets.filter(pet => 
        pet.specialNeeds === filters.specialNeeds
      );
    }

    // Medical history filtering
    if (filters.medicalHistory) {
      filteredPets = filteredPets.filter(pet => {
        const hasMedicalHistory = pet.medicalHistory && pet.medicalHistory.length > 0;
        return filters.medicalHistory === 'any' ? hasMedicalHistory : !hasMedicalHistory;
      });
    }

    // Vaccination status filtering
    if (filters.vaccinationStatus) {
      filteredPets = filteredPets.filter(pet => 
        pet.vaccinationStatus === filters.vaccinationStatus
      );
    }

    // Training level filtering
    if (filters.trainingLevel) {
      filteredPets = filteredPets.filter(pet => 
        pet.trainingLevel === filters.trainingLevel
      );
    }

    return filteredPets;
  }

  // Get Match Analytics
  async getMatchAnalytics(userId, timeRange = '30days') {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));

      const interactionsRef = collection(db, 'userInteractions');
      const q = query(
        interactionsRef,
        where('userId', '==', userId),
        where('timestamp', '>=', cutoffDate)
      );
      
      const querySnapshot = await getDocs(q);
      const interactions = [];
      querySnapshot.forEach((doc) => {
        interactions.push({ id: doc.id, ...doc.data() });
      });

      const analytics = {
        totalViews: interactions.filter(i => i.type === 'view').length,
        totalFavorites: interactions.filter(i => i.type === 'favorite').length,
        totalContacts: interactions.filter(i => i.type === 'contact').length,
        totalAdoptions: interactions.filter(i => i.type === 'adopt').length,
        conversionRate: this.calculateConversionRate(interactions),
        topViewedSpecies: this.getTopViewed(interactions, 'species'),
        topViewedBreeds: this.getTopViewed(interactions, 'breed')
      };

      return { success: true, analytics };
    } catch (error) {
      console.error('Error getting match analytics:', error);
      return { success: false, error: error.message };
    }
  }

  calculateConversionRate(interactions) {
    const views = interactions.filter(i => i.type === 'view').length;
    const adoptions = interactions.filter(i => i.type === 'adopt').length;
    return views > 0 ? (adoptions / views) * 100 : 0;
  }

  getTopViewed(interactions, field) {
    const fieldCounts = {};
    interactions.forEach(interaction => {
      if (interaction[field]) {
        fieldCounts[interaction[field]] = (fieldCounts[interaction[field]] || 0) + 1;
      }
    });
    return Object.entries(fieldCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([key, count]) => ({ [field]: key, count }));
  }
}

export default new MatchingService();