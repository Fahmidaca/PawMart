// Health Service for managing pet health data
// Using localStorage for demo purposes

const STORAGE_KEYS = {
  PETS: 'warmpaws_pets',
  HEALTH_RECORDS: 'warmpaws_health_records',
  VACCINATIONS: 'warmpaws_vaccinations'
};

// Mock data for demo
const mockPets = [
  {
    id: 'pet-1',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    gender: 'Male',
    age: 3,
    weight: 25,
    weightUnit: 'kg',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ownerId: 'demo-user',
    adoptionDate: '2023-01-15',
    weightRecords: [
      { id: 'w1', date: '2023-01-15', weight: 22, unit: 'kg', notes: 'Initial weight' },
      { id: 'w2', date: '2023-06-15', weight: 25, unit: 'kg', notes: 'Annual checkup' }
    ]
  }
];

const mockHealthRecords = [
  {
    id: 'record-1',
    petId: 'pet-1',
    type: 'checkup',
    title: 'Annual Checkup',
    description: 'Routine annual health examination. All vitals normal.',
    veterinarian: 'Dr. Sarah Ahmed',
    date: '2024-01-15',
    followUpDate: '2024-07-15'
  },
  {
    id: 'record-2',
    petId: 'pet-1',
    type: 'vaccination',
    title: 'Rabies Vaccine',
    description: 'Annual rabies vaccination administered.',
    veterinarian: 'Dr. Rahman Hassan',
    date: '2024-02-01'
  }
];

const mockVaccinations = [
  {
    id: 'vax-1',
    petId: 'pet-1',
    vaccineName: 'Rabies',
    scheduledDate: '2024-02-01',
    administeredDate: '2024-02-01',
    status: 'completed',
    nextDueDate: '2025-02-01'
  },
  {
    id: 'vax-2',
    petId: 'pet-1',
    vaccineName: 'DHPP',
    scheduledDate: '2024-08-01',
    status: 'scheduled'
  }
];

// Helper functions
const getStoredData = (key, defaultData = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
  } catch (error) {
    console.warn(`Error reading ${key} from localStorage:`, error);
    return defaultData;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Error saving ${key} to localStorage:`, error);
  }
};

// Initialize with mock data if empty
const initializeData = () => {
  if (getStoredData(STORAGE_KEYS.PETS).length === 0) {
    setStoredData(STORAGE_KEYS.PETS, mockPets);
  }
  if (getStoredData(STORAGE_KEYS.HEALTH_RECORDS).length === 0) {
    setStoredData(STORAGE_KEYS.HEALTH_RECORDS, mockHealthRecords);
  }
  if (getStoredData(STORAGE_KEYS.VACCINATIONS).length === 0) {
    setStoredData(STORAGE_KEYS.VACCINATIONS, mockVaccinations);
  }
};

// Initialize on module load
initializeData();

const HealthService = {
  // Pet Profile Management
  getPetProfiles: async (ownerId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const pets = getStoredData(STORAGE_KEYS.PETS);
      const userPets = pets.filter(pet => pet.ownerId === ownerId);

      return {
        success: true,
        pets: userPets
      };
    } catch (error) {
      console.error('Error fetching pet profiles:', error);
      return {
        success: false,
        message: 'Failed to fetch pet profiles'
      };
    }
  },

  createPetProfile: async (petData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const pets = getStoredData(STORAGE_KEYS.PETS);
      const newPet = {
        ...petData,
        id: `pet-${Date.now()}`,
        weightRecords: []
      };

      pets.push(newPet);
      setStoredData(STORAGE_KEYS.PETS, pets);

      return {
        success: true,
        pet: newPet
      };
    } catch (error) {
      console.error('Error creating pet profile:', error);
      return {
        success: false,
        message: 'Failed to create pet profile'
      };
    }
  },

  updatePetProfile: async (petId, updateData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const pets = getStoredData(STORAGE_KEYS.PETS);
      const petIndex = pets.findIndex(pet => pet.id === petId);

      if (petIndex === -1) {
        return {
          success: false,
          message: 'Pet not found'
        };
      }

      pets[petIndex] = { ...pets[petIndex], ...updateData };
      setStoredData(STORAGE_KEYS.PETS, pets);

      return {
        success: true,
        pet: pets[petIndex]
      };
    } catch (error) {
      console.error('Error updating pet profile:', error);
      return {
        success: false,
        message: 'Failed to update pet profile'
      };
    }
  },

  // Health Records Management
  getHealthRecords: async (petId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const records = getStoredData(STORAGE_KEYS.HEALTH_RECORDS);
      const petRecords = records.filter(record => record.petId === petId);

      return {
        success: true,
        records: petRecords
      };
    } catch (error) {
      console.error('Error fetching health records:', error);
      return {
        success: false,
        message: 'Failed to fetch health records'
      };
    }
  },

  addHealthRecord: async (petId, recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const records = getStoredData(STORAGE_KEYS.HEALTH_RECORDS);
      const newRecord = {
        ...recordData,
        id: `record-${Date.now()}`,
        petId
      };

      records.push(newRecord);
      setStoredData(STORAGE_KEYS.HEALTH_RECORDS, records);

      return {
        success: true,
        record: newRecord
      };
    } catch (error) {
      console.error('Error adding health record:', error);
      return {
        success: false,
        message: 'Failed to add health record'
      };
    }
  },

  deleteHealthRecord: async (recordId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const records = getStoredData(STORAGE_KEYS.HEALTH_RECORDS);
      const filteredRecords = records.filter(record => record.id !== recordId);

      setStoredData(STORAGE_KEYS.HEALTH_RECORDS, filteredRecords);

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting health record:', error);
      return {
        success: false,
        message: 'Failed to delete health record'
      };
    }
  },

  // Vaccination Management
  getVaccinations: async (petId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const vaccinations = getStoredData(STORAGE_KEYS.VACCINATIONS);
      const petVaccinations = vaccinations.filter(vax => vax.petId === petId);

      return {
        success: true,
        vaccinations: petVaccinations
      };
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      return {
        success: false,
        message: 'Failed to fetch vaccinations'
      };
    }
  },

  // Analytics
  getHealthAnalytics: async (petId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const records = getStoredData(STORAGE_KEYS.HEALTH_RECORDS);
      const vaccinations = getStoredData(STORAGE_KEYS.VACCINATIONS);

      const petRecords = records.filter(record => record.petId === petId);
      const petVaccinations = vaccinations.filter(vax => vax.petId === petId);

      const analytics = {
        healthScore: 85,
        totalRecords: petRecords.length,
        vaccinations: petVaccinations.filter(v => v.status === 'completed').length,
        checkups: petRecords.filter(r => r.type === 'checkup').length,
        illnesses: petRecords.filter(r => r.type === 'illness').length,
        lastCheckup: petRecords
          .filter(r => r.type === 'checkup')
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.date,
        upcomingVaccinations: petVaccinations.filter(v => v.status === 'scheduled').length
      };

      return {
        success: true,
        analytics
      };
    } catch (error) {
      console.error('Error fetching health analytics:', error);
      return {
        success: false,
        message: 'Failed to fetch health analytics'
      };
    }
  },

  // Export Data
  exportHealthData: async (petId) => {
    try {
      const [recordsResult, vaccinationsResult, analyticsResult] = await Promise.all([
        this.getHealthRecords(petId),
        this.getVaccinations(petId),
        this.getHealthAnalytics(petId)
      ]);

      if (!recordsResult.success || !vaccinationsResult.success || !analyticsResult.success) {
        return {
          success: false,
          message: 'Failed to gather export data'
        };
      }

      const exportData = {
        petId,
        exportedAt: new Date().toISOString(),
        records: recordsResult.records,
        vaccinations: vaccinationsResult.vaccinations,
        analytics: analyticsResult.analytics
      };

      return {
        success: true,
        data: exportData
      };
    } catch (error) {
      console.error('Error exporting health data:', error);
      return {
        success: false,
        message: 'Failed to export health data'
      };
    }
  }
};

export default HealthService;
