import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Stethoscope,
  User
} from 'lucide-react';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import HealthService from '../services/healthService';
import toast from 'react-hot-toast';

const VaccinationScheduler = ({ petId, vaccinations, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [formData, setFormData] = useState({
    vaccineName: '',
    scheduledDate: '',
    veterinarian: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Common vaccines for different pet types
  const commonVaccines = [
    'Rabies Vaccine',
    'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)',
    'Bordetella (Kennel Cough)',
    'Leptospirosis Vaccine',
    'Lyme Disease Vaccine',
    'Influenza Vaccine',
    'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
    'FeLV (Feline Leukemia)',
    'FCV (Feline Calicivirus)',
    'FHV-1 (Feline Herpesvirus-1)'
  ];

  const resetForm = () => {
    setFormData({
      vaccineName: '',
      scheduledDate: '',
      veterinarian: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingVaccination(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vaccineName || !formData.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      let result;

      if (editingVaccination) {
        // Update existing vaccination
        result = await HealthService.updateVaccination(editingVaccination.id, formData);
      } else {
        // Add new vaccination
        result = await HealthService.scheduleVaccination(petId, {
          ...formData,
          scheduledDate: new Date(formData.scheduledDate)
        });
      }

      if (result.success) {
        toast.success(editingVaccination ? 'Vaccination updated!' : 'Vaccination scheduled!');
        resetForm();
        onUpdate();
      } else {
        toast.error('Failed to save vaccination');
      }
    } catch (error) {
      toast.error('Error saving vaccination');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (vaccinationId) => {
    try {
      const result = await HealthService.completeVaccination(vaccinationId, {
        completedDate: new Date(),
        veterinarian: 'Pet Owner'
      });

      if (result.success) {
        toast.success('Vaccination marked as completed!');
        onUpdate();
      } else {
        toast.error('Failed to complete vaccination');
      }
    } catch (error) {
      toast.error('Error updating vaccination');
      console.error(error);
    }
  };

  const handleEdit = (vaccination) => {
    setFormData({
      vaccineName: vaccination.vaccineName,
      scheduledDate: format(new Date(vaccination.scheduledDate), 'yyyy-MM-dd'),
      veterinarian: vaccination.veterinarian || '',
      notes: vaccination.notes || ''
    });
    setEditingVaccination(vaccination);
    setShowAddForm(true);
  };

  const handleDelete = async (vaccinationId) => {
    if (window.confirm('Are you sure you want to delete this vaccination record?')) {
      try {
        const result = await HealthService.deleteHealthRecord(vaccinationId);
        if (result.success) {
          toast.success('Vaccination deleted!');
          onUpdate();
        } else {
          toast.error('Failed to delete vaccination');
        }
      } catch (error) {
        toast.error('Error deleting vaccination');
        console.error(error);
      }
    }
  };

  const getVaccinationStatus = (vaccination) => {
    const scheduledDate = new Date(vaccination.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (vaccination.status === 'completed') {
      return { status: 'completed', color: 'green', icon: CheckCircle };
    }
    if (isBefore(scheduledDate, today)) {
      return { status: 'overdue', color: 'red', icon: AlertCircle };
    }
    if (isAfter(scheduledDate, addDays(today, 7))) {
      return { status: 'upcoming', color: 'blue', icon: Calendar };
    }
    return { status: 'due-soon', color: 'yellow', icon: Clock };
  };

  const sortedVaccinations = [...vaccinations].sort((a, b) => {
    // Sort by status priority: overdue -> due-soon -> upcoming -> completed
    const statusPriority = { overdue: 0, 'due-soon': 1, upcoming: 2, completed: 3 };
    const aStatus = getVaccinationStatus(a).status;
    const bStatus = getVaccinationStatus(b).status;
    
    if (statusPriority[aStatus] !== statusPriority[bStatus]) {
      return statusPriority[aStatus] - statusPriority[bStatus];
    }
    
    // If same status, sort by date
    return new Date(a.scheduledDate) - new Date(b.scheduledDate);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Vaccination Schedule
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Vaccination
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6"
          >
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              {editingVaccination ? 'Edit Vaccination' : 'Schedule New Vaccination'}
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vaccine Name *
                  </label>
                  <select
                    value={formData.vaccineName}
                    onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select a vaccine</option>
                    {commonVaccines.map((vaccine) => (
                      <option key={vaccine} value={vaccine}>{vaccine}</option>
                    ))}
                    <option value="Other">Other (Custom)</option>
                  </select>
                </div>

                {formData.vaccineName === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Vaccine Name *
                    </label>
                    <input
                      type="text"
                      value={formData.customVaccineName || ''}
                      onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value, customVaccineName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      placeholder="Enter vaccine name"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Veterinarian
                  </label>
                  <input
                    type="text"
                    value={formData.veterinarian}
                    onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                    placeholder="Veterinarian name (optional)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  placeholder="Any additional notes or special instructions"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editingVaccination ? 'Update' : 'Schedule')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vaccinations List */}
      <div className="space-y-3">
        {sortedVaccinations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No vaccinations scheduled yet</p>
            <p className="text-sm">Click "Add Vaccination" to get started</p>
          </div>
        ) : (
          sortedVaccinations.map((vaccination) => {
            const { status, color, icon: Icon } = getVaccinationStatus(vaccination);
            
            return (
              <motion.div
                key={vaccination.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 transition-all ${
                  status === 'overdue' ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800' :
                  status === 'due-soon' ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' :
                  status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800' :
                  'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      status === 'overdue' ? 'bg-red-100' :
                      status === 'due-soon' ? 'bg-yellow-100' :
                      status === 'completed' ? 'bg-green-100' :
                      'bg-blue-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        status === 'overdue' ? 'text-red-500' :
                        status === 'due-soon' ? 'text-yellow-500' :
                        status === 'completed' ? 'text-green-500' :
                        'text-blue-500'
                      }`} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {vaccination.vaccineName}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(vaccination.scheduledDate), 'MMM dd, yyyy')}
                        </div>
                        {vaccination.veterinarian && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {vaccination.veterinarian}
                          </div>
                        )}
                        {vaccination.completedDate && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Completed {format(new Date(vaccination.completedDate), 'MMM dd')}
                          </div>
                        )}
                      </div>
                      {vaccination.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {vaccination.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'overdue' ? 'bg-red-100 text-red-800' :
                      status === 'due-soon' ? 'bg-yellow-100 text-yellow-800' :
                      status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {status === 'due-soon' ? 'Due Soon' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    
                    {status !== 'completed' && (
                      <button
                        onClick={() => handleComplete(vaccination.id)}
                        className="p-1 text-green-600 hover:text-green-700 transition-colors"
                        title="Mark as completed"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleEdit(vaccination)}
                      className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit vaccination"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(vaccination.id)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                      title="Delete vaccination"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VaccinationScheduler;