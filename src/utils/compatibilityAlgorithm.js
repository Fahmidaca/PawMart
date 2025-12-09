// AI-Powered Pet-Human Compatibility Algorithm
class CompatibilityAlgorithm {
  constructor() {
    this.weights = {
      species: 0.25,
      breed: 0.20,
      age: 0.15,
      size: 0.12,
      energy: 0.10,
      training: 0.08,
      familyFriendly: 0.05,
      goodWithKids: 0.03,
      goodWithPets: 0.02
    };

    this.breedCompatibility = this.initializeBreedCompatibility();
    this.lifestyleCompatibility = this.initializeLifestyleCompatibility();
    this.healthCompatibility = this.initializeHealthCompatibility();
  }

  // Calculate overall compatibility score (0-100)
  calculateScore(pet, userPreferences) {
    let totalScore = 0;
    let totalWeight = 0;

    // Species compatibility
    const speciesScore = this.calculateSpeciesCompatibility(pet, userPreferences);
    totalScore += speciesScore * this.weights.species;
    totalWeight += this.weights.species;

    // Breed compatibility
    const breedScore = this.calculateBreedCompatibility(pet, userPreferences);
    totalScore += breedScore * this.weights.breed;
    totalWeight += this.weights.breed;

    // Age compatibility
    const ageScore = this.calculateAgeCompatibility(pet, userPreferences);
    totalScore += ageScore * this.weights.age;
    totalWeight += this.weights.age;

    // Size compatibility
    const sizeScore = this.calculateSizeCompatibility(pet, userPreferences);
    totalScore += sizeScore * this.weights.size;
    totalWeight += this.weights.size;

    // Energy level compatibility
    const energyScore = this.calculateEnergyCompatibility(pet, userPreferences);
    totalScore += energyScore * this.weights.energy;
    totalWeight += this.weights.energy;

    // Training needs compatibility
    const trainingScore = this.calculateTrainingCompatibility(pet, userPreferences);
    totalScore += trainingScore * this.weights.training;
    totalWeight += this.weights.training;

    // Family compatibility
    const familyScore = this.calculateFamilyCompatibility(pet, userPreferences);
    totalScore += familyScore * this.weights.familyFriendly;
    totalWeight += this.weights.familyFriendly;

    // Kids compatibility
    const kidsScore = this.calculateKidsCompatibility(pet, userPreferences);
    totalScore += kidsScore * this.weights.goodWithKids;
    totalWeight += this.weights.goodWithKids;

    // Other pets compatibility
    const petsScore = this.calculatePetsCompatibility(pet, userPreferences);
    totalScore += petsScore * this.weights.goodWithPets;
    totalWeight += this.weights.goodWithPets;

    return Math.round((totalScore / totalWeight) * 100);
  }

  // Calculate species compatibility
  calculateSpeciesCompatibility(pet, preferences) {
    if (!preferences.species || preferences.species === 'Any') return 100;
    return pet.species === preferences.species ? 100 : 30;
  }

  // Calculate breed compatibility
  calculateBreedCompatibility(pet, preferences) {
    if (!preferences.breed || preferences.breed === 'Any') return 100;
    
    // Exact breed match
    if (pet.breed === preferences.breed) return 100;
    
    // Check breed group compatibility
    const petBreedGroup = this.getBreedGroup(pet.breed);
    const preferredBreedGroup = this.getBreedGroup(preferences.breed);
    
    if (petBreedGroup === preferredBreedGroup) return 85;
    
    // Check breed compatibility matrix
    return this.breedCompatibility[pet.breed]?.[preferences.breed] || 50;
  }

  // Calculate age compatibility
  calculateAgeCompatibility(pet, preferences) {
    if (!preferences.ageRange) return 100;
    
    const { min = 0, max = 15 } = preferences.ageRange;
    const petAge = pet.age || 0;
    
    if (petAge >= min && petAge <= max) return 100;
    
    // Calculate penalty for being outside preferred range
    const distance = Math.min(
      Math.abs(petAge - min),
      Math.abs(petAge - max)
    );
    
    return Math.max(0, 100 - (distance * 10));
  }

  // Calculate size compatibility
  calculateSizeCompatibility(pet, preferences) {
    if (!preferences.size || preferences.size === 'Any') return 100;
    return pet.size === preferences.size ? 100 : 60;
  }

  // Calculate energy level compatibility
  calculateEnergyCompatibility(pet, preferences) {
    if (!preferences.energy || preferences.energy === 'Any') return 100;
    
    const energyCompatibility = {
      'Low': { 'Low': 100, 'Moderate': 70, 'High': 30 },
      'Moderate': { 'Low': 70, 'Moderate': 100, 'High': 80 },
      'High': { 'Low': 30, 'Moderate': 80, 'High': 100 }
    };
    
    return energyCompatibility[pet.energy]?.[preferences.energy] || 50;
  }

  // Calculate training compatibility
  calculateTrainingCompatibility(pet, preferences) {
    if (!preferences.training || preferences.training === 'Any') return 100;
    
    const trainingCompatibility = {
      'Easy': { 'Easy': 100, 'Moderate': 85, 'Difficult': 40 },
      'Moderate': { 'Easy': 85, 'Moderate': 100, 'Difficult': 70 },
      'Difficult': { 'Easy': 40, 'Moderate': 70, 'Difficult': 100 }
    };
    
    return trainingCompatibility[pet.trainingLevel]?.[preferences.training] || 50;
  }

  // Calculate family compatibility
  calculateFamilyCompatibility(pet, preferences) {
    if (!preferences.familyFriendly) return 100;
    return pet.familyFriendly ? 100 : 20;
  }

  // Calculate kids compatibility
  calculateKidsCompatibility(pet, preferences) {
    if (!preferences.goodWithKids) return 100;
    return pet.goodWithKids ? 100 : 25;
  }

  // Calculate other pets compatibility
  calculatePetsCompatibility(pet, preferences) {
    if (!preferences.goodWithPets) return 100;
    return pet.goodWithPets ? 100 : 30;
  }

  // Get detailed match reasons
  getMatchReasons(pet, preferences) {
    const reasons = [];
    const scores = {
      species: this.calculateSpeciesCompatibility(pet, preferences),
      breed: this.calculateBreedCompatibility(pet, preferences),
      age: this.calculateAgeCompatibility(pet, preferences),
      size: this.calculateSizeCompatibility(pet, preferences),
      energy: this.calculateEnergyCompatibility(pet, preferences),
      training: this.calculateTrainingCompatibility(pet, preferences),
      family: this.calculateFamilyCompatibility(pet, preferences),
      kids: this.calculateKidsCompatibility(pet, preferences),
      pets: this.calculatePetsCompatibility(pet, preferences)
    };

    // Generate reasons based on high scores
    if (scores.species === 100) {
      reasons.push(`Perfect ${pet.species} match for your preferences`);
    }
    
    if (scores.breed === 100) {
      reasons.push(`Exact breed match: ${pet.breed}`);
    } else if (scores.breed >= 80) {
      reasons.push(`Compatible breed group with ${pet.breed}`);
    }
    
    if (scores.age === 100) {
      reasons.push(`Perfect age match (${pet.age} years)`);
    }
    
    if (scores.energy >= 80) {
      reasons.push(`Energy level matches your lifestyle`);
    }
    
    if (scores.family === 100) {
      reasons.push(`Excellent for family environments`);
    }
    
    if (scores.kids === 100) {
      reasons.push(`Great with children`);
    }
    
    if (scores.pets === 100) {
      reasons.push(`Gets along well with other pets`);
    }

    return reasons;
  }

  // Calculate lifestyle compatibility
  calculateLifestyleCompatibility(pet, lifestyle) {
    const { activity, space, experience } = lifestyle;
    let score = 100;

    // Activity level matching
    const activityMatch = this.lifestyleCompatibility.activity[pet.energy]?.[activity];
    if (activityMatch) {
      score *= activityMatch;
    }

    // Space requirements matching
    const spaceMatch = this.lifestyleCompatibility.space[pet.size]?.[space];
    if (spaceMatch) {
      score *= spaceMatch;
    }

    // Experience level matching
    const experienceMatch = this.lifestyleCompatibility.experience[pet.trainingLevel]?.[experience];
    if (experienceMatch) {
      score *= experienceMatch;
    }

    return Math.round(score);
  }

  // Calculate health compatibility
  calculateHealthCompatibility(pet, healthRequirements) {
    let score = 100;

    // Vaccination status
    if (healthRequirements.vaccinated && !pet.vaccinated) {
      score -= 30;
    }

    // Medical history
    if (healthRequirements.noMedicalHistory && pet.medicalHistory?.length > 0) {
      score -= 20;
    }

    // Special needs
    if (healthRequirements.noSpecialNeeds && pet.specialNeeds) {
      score -= 25;
    }

    return Math.max(0, score);
  }

  // Get breed group for compatibility matching
  getBreedGroup(breed) {
    const breedGroups = {
      // Working Dogs
      'German Shepherd': 'Working',
      'Rottweiler': 'Working',
      'Doberman': 'Working',
      'Boxer': 'Working',
      'Great Dane': 'Working',
      
      // Sporting Dogs
      'Labrador Retriever': 'Sporting',
      'Golden Retriever': 'Sporting',
      'Border Collie': 'Sporting',
      'Australian Shepherd': 'Sporting',
      'Pointer': 'Sporting',
      
      // Toy Dogs
      'Chihuahua': 'Toy',
      'Pomeranian': 'Toy',
      'Yorkshire Terrier': 'Toy',
      'Maltese': 'Toy',
      'Toy Poodle': 'Toy',
      
      // Hounds
      'Beagle': 'Hound',
      'Basset Hound': 'Hound',
      'Bloodhound': 'Hound',
      'Greyhound': 'Hound',
      'Dachshund': 'Hound',
      
      // Non-Sporting Dogs
      'Bulldog': 'Non-Sporting',
      'Poodle': 'Non-Sporting',
      'Dalmatian': 'Non-Sporting',
      'Shih Tzu': 'Non-Sporting',
      'Boston Terrier': 'Non-Sporting',
      
      // Terriers
      'Pit Bull Terrier': 'Terrier',
      'Staffordshire Terrier': 'Terrier',
      'Jack Russell Terrier': 'Terrier',
      'West Highland White Terrier': 'Terrier',
      'Scottish Terrier': 'Terrier'
    };

    return breedGroups[breed] || 'Mixed';
  }

  // Initialize breed compatibility matrix
  initializeBreedCompatibility() {
    return {
      // High compatibility pairs
      'Labrador Retriever': { 'Golden Retriever': 90, 'Border Collie': 85 },
      'Golden Retriever': { 'Labrador Retriever': 90, 'Border Collie': 80 },
      'Border Collie': { 'Australian Shepherd': 95, 'Labrador Retriever': 85 },
      'German Shepherd': { 'Belgian Malinois': 90, 'Dutch Shepherd': 85 },
      
      // Moderate compatibility pairs
      'Bulldog': { 'Boston Terrier': 80, 'French Bulldog': 85 },
      'Poodle': { 'Labrador Retriever': 75, 'Golden Retriever': 75 },
      
      // Low compatibility pairs
      'Chihuahua': { 'German Shepherd': 30, 'Rottweiler': 25 },
      'Greyhound': { 'Border Collie': 45, 'Australian Shepherd': 40 }
    };
  }

  // Initialize lifestyle compatibility matrix
  initializeLifestyleCompatibility() {
    return {
      activity: {
        'Low': { 'sedentary': 1.0, 'moderate': 0.7, 'active': 0.3 },
        'Moderate': { 'sedentary': 0.7, 'moderate': 1.0, 'active': 0.8 },
        'High': { 'sedentary': 0.3, 'moderate': 0.8, 'active': 1.0 }
      },
      space: {
        'Small': { 'apartment': 1.0, 'house': 0.8, 'farm': 0.6 },
        'Medium': { 'apartment': 0.8, 'house': 1.0, 'farm': 0.9 },
        'Large': { 'apartment': 0.3, 'house': 0.9, 'farm': 1.0 }
      },
      experience: {
        'Beginner': { 'beginner': 1.0, 'intermediate': 0.8, 'expert': 0.6 },
        'Intermediate': { 'beginner': 0.8, 'intermediate': 1.0, 'expert': 0.9 },
        'Expert': { 'beginner': 0.6, 'intermediate': 0.9, 'expert': 1.0 }
      }
    };
  }

  // Initialize health compatibility factors
  initializeHealthCompatibility() {
    return {
      vaccinationWeight: 0.4,
      medicalHistoryWeight: 0.3,
      specialNeedsWeight: 0.3,
      
      // Breed-specific health predispositions
      healthPredispositions: {
        'German Shepherd': ['hip_dysplasia', 'elbow_dysplasia'],
        'Labrador Retriever': ['hip_dysplasia', 'obesity'],
        'Bulldog': ['breathing_problems', 'heat_sensitivity'],
        'Dachshund': ['back_problems', 'intervertebral_disc_disease'],
        'Golden Retriever': ['hip_dysplasia', 'cancer_risk']
      }
    };
  }

  // Calculate composite compatibility with multiple factors
  calculateCompositeCompatibility(pet, preferences, lifestyle, healthRequirements) {
    const baseScore = this.calculateScore(pet, preferences);
    const lifestyleScore = this.calculateLifestyleCompatibility(pet, lifestyle);
    const healthScore = this.calculateHealthCompatibility(pet, healthRequirements);

    // Weighted average of all compatibility scores
    const compositeScore = (
      baseScore * 0.5 +      // 50% base compatibility
      lifestyleScore * 0.3 + // 30% lifestyle compatibility
      healthScore * 0.2      // 20% health compatibility
    );

    return Math.round(compositeScore);
  }

  // Get AI-powered match insights
  getMatchInsights(pet, preferences) {
    const score = this.calculateScore(pet, preferences);
    const reasons = this.getMatchReasons(pet, preferences);
    
    let insight = '';
    if (score >= 90) {
      insight = 'Exceptional match! This pet aligns perfectly with your preferences.';
    } else if (score >= 80) {
      insight = 'Excellent match with strong compatibility across multiple factors.';
    } else if (score >= 70) {
      insight = 'Good match with solid compatibility in key areas.';
    } else if (score >= 60) {
      insight = 'Decent match with some compatibility considerations.';
    } else {
      insight = 'Limited compatibility. Consider other factors in your decision.';
    }

    return {
      score,
      insight,
      reasons,
      recommendations: this.getRecommendations(pet, preferences, score)
    };
  }

  // Get personalized recommendations
  getRecommendations(pet, preferences, score) {
    const recommendations = [];

    if (score < 80) {
      // Provide specific recommendations for improvement
      if (pet.energy && preferences.energy && pet.energy !== preferences.energy) {
        recommendations.push(`Consider the energy level mismatch: ${pet.energy} vs preferred ${preferences.energy}`);
      }
      
      if (pet.trainingLevel && preferences.training && pet.trainingLevel !== preferences.training) {
        recommendations.push(`Training difficulty: ${pet.trainingLevel} vs preferred ${preferences.training}`);
      }
    }

    // Always provide positive reinforcement for high matches
    if (score >= 85) {
      recommendations.push('This pet would likely thrive in your environment');
      recommendations.push('Strong candidate for long-term companionship');
    }

    return recommendations;
  }

  // Batch compatibility calculation for multiple pets
  calculateBatchCompatibility(pets, preferences) {
    return pets.map(pet => ({
      ...pet,
      compatibilityScore: this.calculateScore(pet, preferences),
      matchInsights: this.getMatchInsights(pet, preferences)
    })).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
}

export const compatibilityAlgorithm = new CompatibilityAlgorithm();