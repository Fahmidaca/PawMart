import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Stethoscope, 
  Pill, 
  FileText, 
  AlertCircle,
  Clock,
  MapPin,
  User,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  Plus
} from 'lucide-react';
import { format, parseISO, isSameMonth, isSameYear, startOfMonth, endOfMonth, startOfYear } from 'date-fns';
import HealthService from '../services/healthService';

const MedicalTimeline = ({ pet, healthRecords, vaccinations, onAddRecord }) => {
  const [filter, setFilter] = useState('all');
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [showAddModal, setShowAddModal] = useState(false);

  // Combine and sort all health events chronologically
  const combineHealthEvents = () => {
    const events = [];

    // Add health records
    healthRecords?.forEach(record => {
      events.push({
        id: record.id,
        type: record.type,
        title: record.title,
        description: record.description,
        date: new Date(record.date),
        veterinarian: record.veterinarian,
        location: record.location || 'Veterinary Clinic',
        medications: record.medications || [],
        attachments: record.attachments || [],
        followUpDate: record.followUpDate ? new Date(record.followUpDate) : null,
        cost: record.cost || 0,
        category: 'health-record',
        priority: record.type === 'illness' ? 'high' : 'normal',
        data: record
      });
    });

    // Add vaccinations
    vaccinations?.forEach(vaccination => {
      events.push({
        id: vaccination.id,
        type: 'vaccination',
        title: vaccination.vaccineName,
        description: vaccination.notes || 'Routine vaccination',
        date: new Date(vaccination.scheduledDate),
        completedDate: vaccination.completedDate ? new Date(vaccination.completedDate) : null,
        veterinarian: vaccination.veterinarian,
        location: 'Veterinary Clinic',
        status: vaccination.status,
        cost: vaccination.cost || 0,
        category: 'vaccination',
        priority: 'normal',
        data: vaccination
      });
    });

    // Sort by date (most recent first)
    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const allEvents = combineHealthEvents();

  // Filter events
  const filteredEvents = allEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'vaccinations') return event.category === 'vaccination';
    if (filter === 'health-records') return event.category === 'health-record';
    if (filter === 'recent') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return event.date >= sixMonthsAgo;
    }
    return event.type === filter;
  });

  // Group events by year and month for better organization
  const groupEventsByTime = () => {
    const grouped = {};
    
    filteredEvents.forEach(event => {
      const year = event.date.getFullYear();
      const month = event.date.getMonth();
      const yearKey = year.toString();
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      
      if (!grouped[yearKey]) {
        grouped[yearKey] = {};
      }
      if (!grouped[yearKey][monthKey]) {
        grouped[yearKey][monthKey] = {
          month: month,
          year: year,
          events: []
        };
      }
      grouped[yearKey][monthKey].events.push(event);
    });

    return grouped;
  };

  const groupedEvents = groupEventsByTime();

  const getEventIcon = (event) => {
    switch (event.type) {
      case 'vaccination':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'checkup':
        return <Stethoscope className="h-5 w-5 text-green-500" />;
      case 'illness':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventColor = (event) => {
    switch (event.type) {
      case 'vaccination':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
      case 'checkup':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800';
      case 'illness':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'medication':
        return 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const toggleEventExpansion = (eventId) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const exportTimeline = async () => {
    try {
      const exportData = {
        pet: {
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          birthDate: pet.birthDate
        },
        timeline: filteredEvents.map(event => ({
          date: event.date,
          type: event.type,
          title: event.title,
          description: event.description,
          veterinarian: event.veterinarian,
          location: event.location,
          medications: event.medications,
          cost: event.cost
        })),
        generatedAt: new Date()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pet.name}_medical_timeline.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting timeline:', error);
    }
  };

  const getFilterCount = (filterType) => {
    switch (filterType) {
      case 'all':
        return allEvents.length;
      case 'vaccinations':
        return allEvents.filter(e => e.category === 'vaccination').length;
      case 'health-records':
        return allEvents.filter(e => e.category === 'health-record').length;
      case 'recent':
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return allEvents.filter(e => e.date >= sixMonthsAgo).length;
      default:
        return allEvents.filter(e => e.type === filterType).length;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Medical Timeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete medical history for {pet.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportTimeline}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Record
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Events', icon: FileText },
          { key: 'vaccinations', label: 'Vaccinations', icon: Stethoscope },
          { key: 'health-records', label: 'Health Records', icon: FileText },
          { key: 'recent', label: 'Recent (6mo)', icon: Clock }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === key ? 'bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'
            }`}>
              {getFilterCount(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No medical records found</p>
            <p className="text-sm">Add health records to build the timeline</p>
          </div>
        ) : (
          Object.entries(groupedEvents)
            .sort(([a], [b]) => parseInt(b) - parseInt(a)) // Sort years descending
            .map(([year, months]) => (
              <div key={year} className="mb-8">
                {/* Year Header */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {year}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {year}
                    </h4>
                  </div>
                </div>

                {/* Months in this year */}
                <div className="space-y-6 ml-6">
                  {Object.entries(months)
                    .sort(([a], [b]) => b.localeCompare(a)) // Sort months descending
                    .map(([monthKey, monthData]) => (
                      <div key={monthKey} className="relative">
                        {/* Month Header */}
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            {format(new Date(year, monthData.month), 'MMM')}
                          </div>
                          <div className="ml-3">
                            <h5 className="text-md font-medium text-gray-800 dark:text-gray-200">
                              {format(new Date(year, monthData.month), 'MMMM yyyy')}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {monthData.events.length} event{monthData.events.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        {/* Events in this month */}
                        <div className="space-y-4 ml-12">
                          {monthData.events.map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`relative border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${getEventColor(event)}`}
                              onClick={() => toggleEventExpansion(event.id)}
                            >
                              {/* Timeline dot */}
                              <div className="absolute -left-16 top-4 w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>

                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                    {getEventIcon(event)}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {event.title}
                                      </h4>
                                      {event.status === 'completed' && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                          Completed
                                        </span>
                                      )}
                                      {event.priority === 'high' && (
                                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                          Priority
                                        </span>
                                      )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      {event.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {format(event.date, 'MMM dd, yyyy')}
                                      </div>
                                      
                                      {event.veterinarian && (
                                        <div className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          {event.veterinarian}
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                      </div>
                                      
                                      {event.cost > 0 && (
                                        <div className="flex items-center gap-1">
                                          <span>${event.cost}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Expanded details */}
                                    {expandedEvents.has(event.id) && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                                      >
                                        {/* Medications */}
                                        {event.medications && event.medications.length > 0 && (
                                          <div className="mb-3">
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Medications:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                              {event.medications.map((med, medIndex) => (
                                                <span
                                                  key={medIndex}
                                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded text-gray-700 dark:text-gray-300"
                                                >
                                                  {med.name} - {med.dosage}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Follow-up date */}
                                        {event.followUpDate && (
                                          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 mb-2">
                                            <Clock className="h-3 w-3" />
                                            Follow-up: {format(new Date(event.followUpDate), 'MMM dd, yyyy')}
                                          </div>
                                        )}

                                        {/* Attachments */}
                                        {event.attachments && event.attachments.length > 0 && (
                                          <div>
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Attachments:
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                              {event.attachments.map((attachment, attIndex) => (
                                                <a
                                                  key={attIndex}
                                                  href={attachment.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                  {attachment.name}
                                                </a>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </div>
                                </div>

                                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                  {expandedEvents.has(event.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Add Record Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Medical Record
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Add medical record functionality would be implemented here.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalTimeline;