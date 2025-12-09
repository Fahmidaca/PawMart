import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { format, addDays, isAfter, isBefore } from 'date-fns';

// Demo data for when Firebase is not configured
const demoData = {
  pets: [],
  healthRecords: [],
  vaccinations: []
};

class HealthService {
  constructor() {
    this.isDemoMode = !db;
    if (!this.isDemoMode) {
      this.healthRecordsRef = collection(db, 'healthRecords');
      this.petProfilesRef = collection(db, 'petProfiles');
      this.vaccinationsRef = collection(db, 'vaccinations');
      this.appointmentsRef = collection(db, 'appointments');
    }
  }

  // Pet Profile Management
  async createPetProfile(petData) {
    if (this.isDemoMode) {
      const newPet = {
        id: `demo-pet-${Date.now()}`,
        ...petData,
        createdAt: new Date(),
        updatedAt: new Date(),
        healthScore: 100,
        lastCheckup: null,
        nextVaccination: null
      };
      demoData.pets.push(newPet);
      return { success: true, id: newPet.id };
    }

    try {
      const docRef = await addDoc(this.petProfilesRef, {
        ...petData,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: petData.ownerId,
        healthScore: 100,
        lastCheckup: null,
        nextVaccination: null
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating pet profile:', error);
      return { success: false, error: error.message };
    }
  }

  async getPetProfiles(userId) {
    if (this.isDemoMode) {
      const userPets = demoData.pets.filter(pet => pet.ownerId === userId);
      return { success: true, pets: userPets };
    }

    try {
      const q = query(this.petProfilesRef, where('ownerId', '==', userId));
      const querySnapshot = await getDocs(q);
      const pets = [];
      querySnapshot.forEach((doc) => {
        pets.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, pets };
    } catch (error) {
      console.error('Error fetching pet profiles:', error);
      return { success: false, error: error.message, pets: [] };
    }
  }

  async updatePetProfile(petId, updateData) {
    if (this.isDemoMode) {
      const petIndex = demoData.pets.findIndex(p => p.id === petId);
      if (petIndex !== -1) {
        demoData.pets[petIndex] = { ...demoData.pets[petIndex], ...updateData, updatedAt: new Date() };
      }
      return { success: true };
    }

    try {
      const petRef = doc(db, 'petProfiles', petId);
      await updateDoc(petRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating pet profile:', error);
      return { success: false, error: error.message };
    }
  }

  // Health Records Management
  async addHealthRecord(petId, recordData) {
    const healthRecord = {
      id: this.isDemoMode ? `demo-record-${Date.now()}` : null,
      petId,
      type: recordData.type,
      title: recordData.title,
      description: recordData.description,
      veterinarian: recordData.veterinarian,
      date: recordData.date || new Date(),
      attachments: recordData.attachments || [],
      medications: recordData.medications || [],
      followUpDate: recordData.followUpDate || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.isDemoMode) {
      demoData.healthRecords.push(healthRecord);
      return { success: true, id: healthRecord.id };
    }

    try {
      const docRef = await addDoc(this.healthRecordsRef, healthRecord);
      
      await this.updatePetProfile(petId, { 
        lastCheckup: healthRecord.date 
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding health record:', error);
      return { success: false, error: error.message };
    }
  }

  async getHealthRecords(petId) {
    if (this.isDemoMode) {
      const records = demoData.healthRecords
        .filter(r => r.petId === petId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      return { success: true, records };
    }

    try {
      const q = query(
        this.healthRecordsRef, 
        where('petId', '==', petId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const records = [];
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, records };
    } catch (error) {
      console.error('Error fetching health records:', error);
      return { success: false, error: error.message, records: [] };
    }
  }

  async updateHealthRecord(recordId, updateData) {
    if (this.isDemoMode) {
      const recordIndex = demoData.healthRecords.findIndex(r => r.id === recordId);
      if (recordIndex !== -1) {
        demoData.healthRecords[recordIndex] = { ...demoData.healthRecords[recordIndex], ...updateData, updatedAt: new Date() };
      }
      return { success: true };
    }

    try {
      const recordRef = doc(db, 'healthRecords', recordId);
      await updateDoc(recordRef, {
        ...updateData,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating health record:', error);
      return { success: false, error: error.message };
    }
  }

  // Vaccination Management
  async scheduleVaccination(petId, vaccinationData) {
    const vaccination = {
      id: this.isDemoMode ? `demo-vax-${Date.now()}` : null,
      petId,
      vaccineName: vaccinationData.vaccineName,
      scheduledDate: vaccinationData.scheduledDate,
      completedDate: null,
      veterinarian: vaccinationData.veterinarian || '',
      notes: vaccinationData.notes || '',
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (this.isDemoMode) {
      demoData.vaccinations.push(vaccination);
      return { success: true, id: vaccination.id };
    }

    try {
      const docRef = await addDoc(this.vaccinationsRef, vaccination);
      
      await this.updatePetProfile(petId, { 
        nextVaccination: vaccination.scheduledDate 
      });

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error scheduling vaccination:', error);
      return { success: false, error: error.message };
    }
  }

  async getVaccinations(petId) {
    if (this.isDemoMode) {
      const vaccinations = demoData.vaccinations
        .filter(v => v.petId === petId)
        .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
      return { success: true, vaccinations };
    }

    try {
      const q = query(
        this.vaccinationsRef, 
        where('petId', '==', petId),
        orderBy('scheduledDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const vaccinations = [];
      querySnapshot.forEach((doc) => {
        vaccinations.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, vaccinations };
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      return { success: false, error: error.message, vaccinations: [] };
    }
  }

  async completeVaccination(vaccinationId, completionData) {
    if (this.isDemoMode) {
      const vaxIndex = demoData.vaccinations.findIndex(v => v.id === vaccinationId);
      if (vaxIndex !== -1) {
        demoData.vaccinations[vaxIndex] = {
          ...demoData.vaccinations[vaxIndex],
          status: 'completed',
          completedDate: completionData.completedDate || new Date(),
          veterinarian: completionData.veterinarian || '',
          notes: completionData.notes || '',
          updatedAt: new Date()
        };
      }
      return { success: true };
    }

    try {
      const vaccinationRef = doc(db, 'vaccinations', vaccinationId);
      await updateDoc(vaccinationRef, {
        status: 'completed',
        completedDate: completionData.completedDate || new Date(),
        veterinarian: completionData.veterinarian || '',
        notes: completionData.notes || '',
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Error completing vaccination:', error);
      return { success: false, error: error.message };
    }
  }

  // Upcoming Appointments
  async getUpcomingAppointments(petId) {
    if (this.isDemoMode) {
      const now = new Date();
      const appointments = demoData.vaccinations
        .filter(v => v.petId === petId && new Date(v.scheduledDate) >= now)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      return { success: true, appointments };
    }

    try {
      const q = query(
        this.vaccinationsRef,
        where('petId', '==', petId),
        where('scheduledDate', '>=', new Date()),
        orderBy('scheduledDate', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, appointments };
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      return { success: false, error: error.message, appointments: [] };
    }
  }

  // Overdue Vaccinations
  async getOverdueVaccinations(petId) {
    if (this.isDemoMode) {
      const now = new Date();
      const overdue = demoData.vaccinations
        .filter(v => v.petId === petId && new Date(v.scheduledDate) < now && v.status === 'scheduled');
      return { success: true, overdue };
    }

    try {
      const q = query(
        this.vaccinationsRef,
        where('petId', '==', petId),
        where('scheduledDate', '<', new Date()),
        where('status', '==', 'scheduled')
      );
      const querySnapshot = await getDocs(q);
      const overdue = [];
      querySnapshot.forEach((doc) => {
        overdue.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, overdue };
    } catch (error) {
      console.error('Error fetching overdue vaccinations:', error);
      return { success: false, error: error.message, overdue: [] };
    }
  }

  // Health Score Calculation
  calculateHealthScore(pet, healthRecords) {
    let score = 100;
    
    const overdueVaccinations = healthRecords.filter(record => 
      record.type === 'vaccination' && 
      record.status === 'overdue'
    );
    score -= overdueVaccinations.length * 10;

    const sixMonthsAgo = addDays(new Date(), -180);
    const recentCheckups = healthRecords.filter(record => 
      record.type === 'checkup' && 
      isAfter(new Date(record.date), sixMonthsAgo)
    );
    if (recentCheckups.length === 0) {
      score -= 15;
    }

    const recentIllnesses = healthRecords.filter(record => 
      record.type === 'illness' && 
      isAfter(new Date(record.date), sixMonthsAgo)
    );
    score -= recentIllnesses.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  // Health Analytics
  async getHealthAnalytics(petId, timeRange = '6months') {
    try {
      const { records } = await this.getHealthRecords(petId);
      
      const cutoffDate = timeRange === '1year' ? 
        addDays(new Date(), -365) : 
        addDays(new Date(), -180);

      const recentRecords = (records || []).filter(record => 
        isAfter(new Date(record.date), cutoffDate)
      );

      const analytics = {
        totalRecords: recentRecords.length,
        vaccinations: recentRecords.filter(r => r.type === 'vaccination').length,
        checkups: recentRecords.filter(r => r.type === 'checkup').length,
        illnesses: recentRecords.filter(r => r.type === 'illness').length,
        medications: recentRecords.filter(r => r.type === 'medication').length,
        healthScore: this.calculateHealthScore(null, recentRecords),
        trends: this.analyzeHealthTrends(recentRecords)
      };

      return { success: true, analytics };
    } catch (error) {
      console.error('Error generating health analytics:', error);
      return { 
        success: true, 
        analytics: {
          totalRecords: 0,
          vaccinations: 0,
          checkups: 0,
          illnesses: 0,
          medications: 0,
          healthScore: 100,
          trends: { vaccinations: [], healthIssues: [], medications: [] }
        }
      };
    }
  }

  analyzeHealthTrends(records) {
    const trends = {
      vaccinations: [],
      healthIssues: [],
      medications: []
    };

    (records || []).forEach(record => {
      const date = format(new Date(record.date), 'MMM yyyy');
      
      if (record.type === 'vaccination') {
        trends.vaccinations.push({ date, count: 1 });
      } else if (record.type === 'illness') {
        trends.healthIssues.push({ date, count: 1 });
      } else if (record.type === 'medication') {
        trends.medications.push({ date, count: 1 });
      }
    });

    return trends;
  }

  // Bulk Operations
  async deleteHealthRecord(recordId) {
    if (this.isDemoMode) {
      demoData.healthRecords = demoData.healthRecords.filter(r => r.id !== recordId);
      return { success: true };
    }

    try {
      await deleteDoc(doc(db, 'healthRecords', recordId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting health record:', error);
      return { success: false, error: error.message };
    }
  }

  async exportHealthData(petId) {
    try {
      const { records } = await this.getHealthRecords(petId);
      const { vaccinations } = await this.getVaccinations(petId);
      
      const exportData = {
        petId,
        exportedAt: new Date(),
        healthRecords: records || [],
        vaccinations: vaccinations || [],
        summary: {
          totalRecords: (records || []).length,
          lastCheckup: (records || []).find(r => r.type === 'checkup')?.date || null,
          nextVaccination: (vaccinations || []).find(v => v.status === 'scheduled')?.scheduledDate || null
        }
      };

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Error exporting health data:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new HealthService();
