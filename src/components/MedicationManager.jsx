import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Plus, 
  Clock, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  Bell,
  TrendingUp
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, isAfter, isBefore, isToday, isTomorrow } from 'date-fns';
import toast from 'react-hot-toast';

const MedicationManager = ({ pet, onUpdateMedication }) => {
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    instructions: '',
    veterinarian: '',
    sideEffects: '',
    reminderTimes: ['08:00']
  });
  const [loading, setLoading] = useState(false);

  // Generate mock medication data
  useEffect(() => {
    const mockMedications = [
      {
        id: 'med-1',
        name: 'Heartgard Plus',
        dosage: '1 tablet',
        frequency: 'monthly',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-05-01'),
        status: 'active',
        instructions: 'Give with food, preferably in the morning',
        veterinarian: 'Dr. Smith',
        sideEffects: 'Mild drowsiness possible',
        reminderTimes: ['08:00'],
        nextDose: new Date('2025-01-01'),
        dosesGiven: 2,
        totalDoses: 6,
        isCompleted: false
      },
      {
        id: 'med-2',
        name: 'Carprofen',
        dosage: '50mg',
        frequency: 'twice-daily',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-15'),
        status: 'completed',
        instructions: 'Give with meals, twice daily for pain relief',
        veterinarian: 'Dr. Johnson',
        sideEffects: 'May cause stomach upset',
        reminderTimes: ['08:00', '20:00'],
        completedDate: new Date('2024-12-15'),
        dosesGiven: 28,
        totalDoses: 28,
        isCompleted: true
      }
    ];

    setMedications(mockMedications);
  }, [pet]);

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      instructions: '',
      veterinarian: '',
      sideEffects: '',
      reminderTimes: ['08:00']
    });
    setShowAddForm(false);
    setEditingMedication(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const medicationData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        status: 'active',
        petId: pet.id,
        dosesGiven: 0,
        totalDoses: calculateTotalDoses(),
        nextDose: calculateNextDose(),
        isCompleted: false
      };

      if (editingMedication) {
        // Update existing medication
        setMedications(prev => prev.map(med => 
          med.id === editingMedication.id ? { ...med, ...medicationData } : med
        ));
        toast.success('Medication updated successfully!');
      } else {
        // Add new medication
        const newMedication = {
          ...medicationData,
          id: `med-${Date.now()}`
        };
        setMedications(prev => [...prev, newMedication]);
        toast.success('Medication added successfully!');
      }

      resetForm();
    } catch (error) {
      toast.error('Failed to save medication');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDoses = () => {
    if (!formData.endDate) return Infinity;
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    switch (formData.frequency) {
      case 'daily':
        return daysDiff;
      case 'twice-daily':
        return daysDiff * 2;
      case 'three-times-daily':
        return daysDiff * 3;
      case 'weekly':
        return Math.ceil(daysDiff / 7);
      case 'monthly':
        return Math.ceil(daysDiff / 30);
      default:
        return daysDiff;
    }
  };

  const calculateNextDose = () => {
    const now = new Date();
    const nextDose = new Date();
    
    // Set to next reminder time today
    const reminderTime = formData.reminderTimes[0] || '08:00';
    const [hours, minutes] = reminderTime.split(':');
    nextDose.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // If the time has passed today, set to tomorrow
    if (nextDose <= now) {
      nextDose.setDate(nextDose.getDate() + 1);
    }
    
    return nextDose;
  };

  const markDoseAsGiven = async (medicationId) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medicationId) {
        const updatedMed = { ...med };
        updatedMed.dosesGiven += 1;
        
        // Calculate next dose
        const nextDose = new Date();
        if (med.frequency === 'daily') {
          nextDose.setDate(nextDose.getDate() + 1);
        } else if (med.frequency === 'twice-daily') {
          // Add 12 hours to current time
          nextDose.setHours(nextDose.getHours() + 12);
        } else if (med.frequency === 'three-times-daily') {
          // Add 8 hours to current time
          nextDose.setHours(nextDose.getHours() + 8);
        }
        
        updatedMed.nextDose = nextDose;
        
        // Check if medication is complete
        if (updatedMed.dosesGiven >= updatedMed.totalDoses) {
          updatedMed.status = 'completed';
          updatedMed.completedDate = new Date();
          updatedMed.isCompleted = true;
          toast.success(`${med.name} treatment completed!`);
        }
        
        return updatedMed;
      }
      return med;
    }));

    toast.success('Dose marked as given!');
  };

  const pauseMedication = (medicationId) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId ? { ...med, status: 'paused' } : med
    ));
    toast.success('Medication paused');
  };

  const resumeMedication = (medicationId) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId ? { ...med, status: 'active' } : med
    ));
    toast.success('Medication resumed');
  };

  const deleteMedication = async (medicationId) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setMedications(prev => prev.filter(med => med.id !== medicationId));
      toast.success('Medication deleted');
    }
  };

  const editMedication = (medication) => {
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      startDate: format(medication.startDate, 'yyyy-MM-dd'),
      endDate: medication.endDate ? format(medication.endDate, 'yyyy-MM-dd') : '',
      instructions: medication.instructions,
      veterinarian: medication.veterinarian,
      sideEffects: medication.sideEffects,
      reminderTimes: medication.reminderTimes
    });
    setEditingMedication(medication);
    setShowAddForm(true);
  };

  const addReminderTime = () => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, '12:00']
    }));
  };

  const removeReminderTime = (index) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((_, i) => i !== index)
    }));
  };

  const getFilteredMedications = () => {
    switch (activeTab) {
      case 'current':
        return medications.filter(med => med.status === 'active');
      case 'completed':
        return medications.filter(med => med.status === 'completed');
      case 'paused':
        return medications.filter(med => med.status === 'paused');
      case 'all':
        return medications;
      default:
        return medications;
    }
  };

  const getUpcomingDoses = () => {
    const now = new Date();
    const upcoming = [];
    
    medications.forEach(med => {
      if (med.status === 'active' && med.nextDose && isAfter(med.nextDose, now)) {
        const hoursUntil = Math.ceil((med.nextDose - now) / (1000 * 60 * 60));
        if (hoursUntil <= 24) {
          upcoming.push({
            medication: med,
            nextDose: med.nextDose,
            hoursUntil
          });
        }
      }
    });
    
    return upcoming.sort((a, b) => a.nextDose - b.nextDose);
  };

  const upcomingDoses = getUpcomingDoses();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Medication Manager
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track {pet.name}'s medications and doses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Medication
        </button>
      </div>

      {/* Upcoming Doses Alert */}
      {upcomingDoses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium text-orange-900 dark:text-orange-300">
              Upcoming Doses
            </h4>
          </div>
          <div className="mt-2 space-y-1">
            {upcomingDoses.map(({ medication, nextDose, hoursUntil }) => (
              <div key={medication.id} className="text-sm text-orange-800 dark:text-orange-400">
                {medication.name} - {hoursUntil}h remaining ({format(nextDose, 'HH:mm')})
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'current', label: 'Current', count: medications.filter(m => m.status === 'active').length },
              { id: 'completed', label: 'Completed', count: medications.filter(m => m.status === 'completed').length },
              { id: 'paused', label: 'Paused', count: medications.filter(m => m.status === 'paused').length },
              { id: 'all', label: 'All', count: medications.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Medication List */}
        <div className="p-6">
          {getFilteredMedications().length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No medications found</p>
              <p className="text-sm">Add medications to track doses and schedules</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredMedications().map((medication) => (
                <motion.div
                  key={medication.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    medication.status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-900/20' :
                    medication.status === 'paused' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                        <Pill className="h-5 w-5 text-purple-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {medication.name}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            medication.status === 'completed' ? 'bg-green-100 text-green-800' :
                            medication.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {medication.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {medication.dosage} • {medication.frequency.replace('-', ' ')}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(medication.startDate, 'MMM dd')} - {medication.endDate ? format(medication.endDate, 'MMM dd') : 'Ongoing'}
                          </div>
                          
                          {medication.veterinarian && (
                            <div className="flex items-center gap-1">
                              <span>Dr. {medication.veterinarian}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {medication.dosesGiven}/{medication.totalDoses === Infinity ? '∞' : medication.totalDoses} doses
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${medication.totalDoses === Infinity ? 
                                Math.min((medication.dosesGiven / 30) * 100, 100) : 
                                (medication.dosesGiven / medication.totalDoses) * 100}%`
                            }}
                          />
                        </div>

                        {/* Instructions */}
                        {medication.instructions && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <strong>Instructions:</strong> {medication.instructions}
                          </p>
                        )}

                        {/* Next dose */}
                        {medication.status === 'active' && medication.nextDose && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400">
                            <Clock className="h-3 w-3" />
                            Next dose: {format(medication.nextDose, 'MMM dd, HH:mm')}
                          </div>
                        )}

                        {/* Side effects */}
                        {medication.sideEffects && (
                          <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                            <strong>Side effects:</strong> {medication.sideEffects}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {medication.status === 'active' && (
                        <button
                          onClick={() => markDoseAsGiven(medication.id)}
                          className="p-2 text-green-600 hover:text-green-700 transition-colors"
                          title="Mark dose as given"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      
                      {medication.status === 'active' ? (
                        <button
                          onClick={() => pauseMedication(medication.id)}
                          className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                          title="Pause medication"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      ) : medication.status === 'paused' ? (
                        <button
                          onClick={() => resumeMedication(medication.id)}
                          className="p-2 text-green-600 hover:text-green-700 transition-colors"
                          title="Resume medication"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      ) : null}
                      
                      <button
                        onClick={() => editMedication(medication)}
                        className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                        title="Edit medication"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteMedication(medication.id)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete medication"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Medication Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={resetForm}
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
                  {editingMedication ? 'Edit Medication' : 'Add Medication'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Medication Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., Heartgard Plus"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., 1 tablet"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Frequency *
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="twice-daily">Twice Daily</option>
                      <option value="three-times-daily">Three Times Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
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
                      placeholder="Dr. Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Reminder Times */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reminder Times
                  </label>
                  <div className="space-y-2">
                    {formData.reminderTimes.map((time, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={time}
                          onChange={(e) => {
                            const newTimes = [...formData.reminderTimes];
                            newTimes[index] = e.target.value;
                            setFormData({ ...formData, reminderTimes: newTimes });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        {formData.reminderTimes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReminderTime(index)}
                            className="p-2 text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addReminderTime}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      + Add another time
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instructions
                  </label>
                  <textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Give with food, after meals, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Side Effects
                  </label>
                  <input
                    type="text"
                    value={formData.sideEffects}
                    onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Mild drowsiness, stomach upset, etc."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingMedication ? 'Update' : 'Add Medication')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicationManager;