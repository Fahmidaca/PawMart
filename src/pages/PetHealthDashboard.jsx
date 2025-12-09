import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Heart, 
  Activity, 
  Calendar, 
  Stethoscope, 
  AlertCircle,
  ChevronRight,
  FileText,
  Download,
  RefreshCw,
  PawPrint,
  TrendingUp,
  Clock,
  CheckCircle,
  Bell,
  Filter,
  Pill
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import HealthService from '../services/healthService';
import HealthChart from '../components/HealthChart';
import HealthRecordCard from '../components/HealthRecordCard';
import VaccinationScheduler from '../components/VaccinationScheduler';
import AddPetModal from '../components/AddPetModal';
import PDFReportGenerator from '../components/PDFReportGenerator';
import WeightTrackingChart from '../components/WeightTrackingChart';
import NotificationCenter from '../components/NotificationCenter';
import MedicalTimeline from '../components/MedicalTimeline';
import MedicationManager from '../components/MedicationManager';
import toast from 'react-hot-toast';

const PetHealthDashboard = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [recordFilter, setRecordFilter] = useState('all');

  // Fetch user's pets
  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  // Fetch health data when pet is selected
  useEffect(() => {
    if (selectedPet) {
      fetchHealthData(selectedPet.id);
    }
  }, [selectedPet]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const result = await HealthService.getPetProfiles(user.uid);
      if (result.success) {
        setPets(result.pets);
        if (result.pets.length > 0 && !selectedPet) {
          setSelectedPet(result.pets[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthData = async (petId) => {
    try {
      const [recordsResult, vaccinationsResult, analyticsResult] = await Promise.all([
        HealthService.getHealthRecords(petId),
        HealthService.getVaccinations(petId),
        HealthService.getHealthAnalytics(petId)
      ]);

      if (recordsResult.success) {
        setHealthRecords(recordsResult.records);
      }
      if (vaccinationsResult.success) {
        setVaccinations(vaccinationsResult.vaccinations);
      }
      if (analyticsResult.success) {
        setAnalytics(analyticsResult.analytics);
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
      toast.error('Failed to load health data');
    }
  };

  const handleAddPet = async (petData) => {
    try {
      const result = await HealthService.createPetProfile({
        ...petData,
        ownerId: user.uid
      });
      
      if (result.success) {
        toast.success('Pet added successfully!');
        setShowAddPetModal(false);
        fetchPets();
      } else {
        toast.error('Failed to add pet');
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('Failed to add pet');
    }
  };

  const handleAddHealthRecord = async (recordData) => {
    try {
      const result = await HealthService.addHealthRecord(selectedPet.id, recordData);
      if (result.success) {
        toast.success('Health record added!');
        setShowAddRecordModal(false);
        fetchHealthData(selectedPet.id);
      } else {
        toast.error('Failed to add health record');
      }
    } catch (error) {
      console.error('Error adding health record:', error);
      toast.error('Failed to add health record');
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const result = await HealthService.deleteHealthRecord(recordId);
        if (result.success) {
          toast.success('Record deleted!');
          fetchHealthData(selectedPet.id);
        } else {
          toast.error('Failed to delete record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        toast.error('Failed to delete record');
      }
    }
  };

  const handleExportData = async () => {
    try {
      const result = await HealthService.exportHealthData(selectedPet.id);
      if (result.success) {
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedPet.name}_health_data.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Health data exported!');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const getFilteredRecords = () => {
    if (recordFilter === 'all') return healthRecords;
    return healthRecords.filter(record => record.type === recordFilter);
  };

  const getUpcomingReminders = () => {
    const upcoming = [];
    const today = new Date();
    const nextWeek = addDays(today, 7);

    // Check vaccinations
    vaccinations.forEach(vax => {
      if (vax.status !== 'completed') {
        const scheduledDate = new Date(vax.scheduledDate);
        if (scheduledDate <= nextWeek) {
          upcoming.push({
            type: 'vaccination',
            title: vax.vaccineName,
            date: scheduledDate,
            isOverdue: scheduledDate < today
          });
        }
      }
    });

    // Check follow-up dates from health records
    healthRecords.forEach(record => {
      if (record.followUpDate) {
        const followUpDate = new Date(record.followUpDate);
        if (followUpDate <= nextWeek && followUpDate >= today) {
          upcoming.push({
            type: 'followup',
            title: `Follow-up: ${record.title}`,
            date: followUpDate,
            isOverdue: false
          });
        }
      }
    });

    return upcoming.sort((a, b) => a.date - b.date);
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your pets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              Pet Health Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage your pets' health and wellness
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowAddPetModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Pet
            </button>
            {selectedPet && (
              <button
                onClick={handleExportData}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="h-5 w-5" />
                Export
              </button>
            )}
          </div>
        </div>

        {pets.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center"
          >
            <PawPrint className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Pets Added Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start tracking your pet's health by adding your first pet. You'll be able to monitor vaccinations, health records, and more.
            </p>
            <button
              onClick={() => setShowAddPetModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Pet
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Pet Selector Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-blue-500" />
                  My Pets
                </h3>
                <div className="space-y-2">
                  {pets.map((pet) => (
                    <motion.button
                      key={pet.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPet(pet)}
                      className={`w-full p-3 rounded-lg flex items-center gap-3 transition-colors ${
                        selectedPet?.id === pet.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                        {pet.photoUrl ? (
                          <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PawPrint className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {pet.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {pet.species} • {pet.breed || 'Mixed'}
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 flex-shrink-0 ${
                        selectedPet?.id === pet.id ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddPetModal(true)}
                  className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Another Pet
                </button>
              </div>

              {/* Upcoming Reminders */}
              {selectedPet && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-500" />
                    Upcoming Reminders
                  </h3>
                  <div className="space-y-2">
                    {getUpcomingReminders().length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No upcoming reminders
                      </p>
                    ) : (
                      getUpcomingReminders().slice(0, 5).map((reminder, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            reminder.isOverdue
                              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {reminder.isOverdue ? (
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${
                              reminder.isOverdue ? 'text-red-700 dark:text-red-300' : 'text-yellow-700 dark:text-yellow-300'
                            }`}>
                              {reminder.title}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 ml-6 ${
                            reminder.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {reminder.isOverdue ? 'Overdue: ' : ''}{format(reminder.date, 'MMM dd, yyyy')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {selectedPet && (
                <>
                  {/* Pet Overview Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                        {selectedPet.photoUrl ? (
                          <img src={selectedPet.photoUrl} alt={selectedPet.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <PawPrint className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedPet.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                          {selectedPet.species} • {selectedPet.breed || 'Mixed Breed'} • {selectedPet.gender || 'Unknown'}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-3">
                          {selectedPet.age && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              <strong>Age:</strong> {selectedPet.age} years
                            </span>
                          )}
                          {selectedPet.weight && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              <strong>Weight:</strong> {selectedPet.weight} {selectedPet.weightUnit || 'kg'}
                            </span>
                          )}
                          {selectedPet.adoptionDate && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              <strong>With you since:</strong> {format(new Date(selectedPet.adoptionDate), 'MMM yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      {analytics && (
                        <div className="text-center">
                          <div className={`text-4xl font-bold ${getHealthScoreColor(analytics.healthScore)}`}>
                            {analytics.healthScore}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Health Score</p>
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${getHealthScoreBg(analytics.healthScore)}`}
                              style={{ width: `${analytics.healthScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Stethoscope className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {analytics?.vaccinations || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Vaccinations</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {analytics?.checkups || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Checkups</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <AlertCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {analytics?.illnesses || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Illnesses</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <FileText className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {analytics?.totalRecords || 0}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <nav className="flex space-x-8 px-6 overflow-x-auto">
                        {[ 
                          { id: 'overview', label: 'Overview', icon: TrendingUp },
                          { id: 'weight', label: 'Weight Tracking', icon: Activity },
                          { id: 'vaccinations', label: 'Vaccinations', icon: Stethoscope },
                          { id: 'medications', label: 'Medications', icon: Pill },
                          { id: 'records', label: 'Health Records', icon: FileText },
                          { id: 'timeline', label: 'Medical Timeline', icon: Clock },
                          { id: 'notifications', label: 'Notifications', icon: Bell },
                          { id: 'analytics', label: 'Analytics', icon: Activity }
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                      {activeTab === 'overview' && analytics && (
                        <HealthChart analytics={analytics} healthRecords={healthRecords} />
                      )}

                      {activeTab === 'weight' && (
                        <WeightTrackingChart 
                          pet={selectedPet}
                          weightRecords={selectedPet.weightRecords || []}
                          onAddWeight={async (weightData) => {
                            try {
                              // Update pet weight data
                              const updatedWeightRecords = [...(selectedPet.weightRecords || []), {
                                id: `weight-${Date.now()}`,
                                date: weightData.date,
                                weight: weightData.weight,
                                unit: weightData.unit,
                                notes: weightData.notes
                              }];
                              
                              await HealthService.updatePetProfile(selectedPet.id, {
                                weight: weightData.weight,
                                weightUnit: weightData.unit,
                                weightRecords: updatedWeightRecords
                              });
                              
                              fetchPets();
                              toast.success('Weight record added!');
                            } catch (error) {
                              toast.error('Failed to add weight record');
                            }
                          }}
                        />
                      )}

                      {activeTab === 'medications' && (
                        <MedicationManager 
                          pet={selectedPet}
                          onUpdateMedication={() => fetchHealthData(selectedPet.id)}
                        />
                      )}

                      {activeTab === 'timeline' && (
                        <MedicalTimeline 
                          pet={selectedPet}
                          healthRecords={healthRecords}
                          vaccinations={vaccinations}
                          onAddRecord={() => {}}
                        />
                      )}

                      {activeTab === 'notifications' && (
                        <NotificationCenter 
                          pet={selectedPet}
                          healthData={{
                            vaccinations,
                            records: healthRecords,
                            healthScore: analytics?.healthScore
                          }}
                        />
                      )}

                      {activeTab === 'vaccinations' && (
                        <VaccinationScheduler
                          petId={selectedPet.id}
                          vaccinations={vaccinations}
                          onUpdate={() => fetchHealthData(selectedPet.id)}
                        />
                      )}

                      {activeTab === 'records' && (
                        <div className="space-y-4">
                          {/* Filter and Add Button */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <Filter className="h-5 w-5 text-gray-400" />
                              <select
                                value={recordFilter}
                                onChange={(e) => setRecordFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                              >
                                <option value="all">All Records</option>
                                <option value="vaccination">Vaccinations</option>
                                <option value="checkup">Checkups</option>
                                <option value="illness">Illnesses</option>
                                <option value="medication">Medications</option>
                              </select>
                            </div>
                            <button
                              onClick={() => setShowAddRecordModal(true)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Add Record
                            </button>
                          </div>

                          {/* Records List */}
                          <div className="space-y-3">
                            {getFilteredRecords().length === 0 ? (
                              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No health records found</p>
                                <p className="text-sm">Add your first health record to get started</p>
                              </div>
                            ) : (
                              getFilteredRecords().map((record) => (
                                <HealthRecordCard
                                  key={record.id}
                                  record={record}
                                  onDelete={handleDeleteRecord}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'analytics' && analytics && (
                        <div className="space-y-6">
                          <HealthChart analytics={analytics} healthRecords={healthRecords} />
                          
                          {/* PDF Report Generator */}
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                              Generate Health Report
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                              Download a comprehensive PDF report of {selectedPet.name}'s health history.
                            </p>
                            <PDFReportGenerator
                              pet={selectedPet}
                              healthRecords={healthRecords}
                              vaccinations={vaccinations}
                              analytics={analytics}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Add Pet Modal */}
        {showAddPetModal && (
          <AddPetModal
            onClose={() => setShowAddPetModal(false)}
            onSubmit={handleAddPet}
          />
        )}

        {/* Add Health Record Modal */}
        <AnimatePresence>
          {showAddRecordModal && (
            <AddHealthRecordModal
              onClose={() => setShowAddRecordModal(false)}
              onSubmit={handleAddHealthRecord}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Add Health Record Modal Component
const AddHealthRecordModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'checkup',
    title: '',
    description: '',
    veterinarian: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    followUpDate: '',
    medications: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        date: new Date(formData.date),
        followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : null
      });
    } catch (error) {
      console.error('Error submitting record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Health Record
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Record Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="checkup">Checkup</option>
              <option value="vaccination">Vaccination</option>
              <option value="illness">Illness</option>
              <option value="medication">Medication</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Annual Checkup, Rabies Vaccine"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Additional details about the visit or treatment"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Veterinarian
            </label>
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Veterinarian name"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Record'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PetHealthDashboard;
