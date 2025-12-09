import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Scissors,
  Heart,
  Activity,
  Edit,
  Trash2,
  Bell
} from 'lucide-react';
import { format, addDays, addWeeks, startOfWeek, endOfWeek, isSameDay, isToday, isBefore } from 'date-fns';

const AppointmentSchedulingSystem = ({ pet }) => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock veterinary data
  const vets = [
    {
      id: '1',
      name: 'Dr. Sarah Ahmed',
      specialization: 'Small Animal Veterinarian',
      clinic: 'Dhaka Pet Care Center',
      rating: 4.9,
      experience: '8 years',
      location: 'Dhanmondi, Dhaka',
      phone: '+880 1712-345678',
      avatar: null,
      availability: {
        '2024-12-09': ['09:00', '10:30', '14:00', '15:30'],
        '2024-12-10': ['09:30', '11:00', '14:30', '16:00'],
        '2024-12-11': ['08:30', '10:00', '13:30', '15:00'],
        '2024-12-12': ['09:00', '11:30', '14:00', '16:30'],
        '2024-12-13': ['08:00', '09:30', '11:00', '15:30']
      },
      services: ['General Checkup', 'Vaccination', 'Dental Care', 'Surgery'],
      consultationTypes: ['in-person', 'video']
    },
    {
      id: '2',
      name: 'Dr. Rahman Khan',
      specialization: 'Pet Behaviorist',
      clinic: 'Animal Wellness Clinic',
      rating: 4.8,
      experience: '12 years',
      location: 'Gulshan, Dhaka',
      phone: '+880 1812-456789',
      avatar: null,
      availability: {
        '2024-12-09': ['10:00', '11:30', '15:00'],
        '2024-12-10': ['09:00', '13:00', '16:00'],
        '2024-12-11': ['08:30', '10:30', '14:30'],
        '2024-12-12': ['09:30', '12:00', '15:30'],
        '2024-12-13': ['10:00', '14:00', '16:30']
      },
      services: ['Behavior Consultation', 'Training Advice', 'Socialization'],
      consultationTypes: ['in-person', 'video']
    },
    {
      id: '3',
      name: 'Dr. Fatima Begum',
      specialization: 'Exotic Pet Specialist',
      clinic: 'Exotic Animals Hospital',
      rating: 4.7,
      experience: '6 years',
      location: 'Uttara, Dhaka',
      phone: '+880 1912-567890',
      avatar: null,
      availability: {
        '2024-12-09': ['09:30', '11:00', '14:30'],
        '2024-12-10': ['08:00', '10:00', '15:00'],
        '2024-12-11': ['09:00', '13:30', '16:00'],
        '2024-12-12': ['08:30', '11:30', '14:00'],
        '2024-12-13': ['10:30', '13:00', '15:30']
      },
      services: ['Exotic Pet Care', 'Bird Medicine', 'Reptile Health'],
      consultationTypes: ['in-person']
    }
  ];

  // Mock appointment data
  const mockAppointments = [
    {
      id: '1',
      vetId: '1',
      vetName: 'Dr. Sarah Ahmed',
      petName: pet?.name || 'Max',
      type: 'General Checkup',
      date: addDays(new Date(), 2),
      time: '10:30',
      duration: 30,
      status: 'confirmed',
      location: 'Dhaka Pet Care Center',
      address: '123 Dhanmondi, Dhaka',
      phone: '+880 1712-345678',
      notes: 'Annual health checkup and vaccination update',
      reminderSent: false
    },
    {
      id: '2',
      vetId: '2',
      vetName: 'Dr. Rahman Khan',
      petName: pet?.name || 'Max',
      type: 'Behavior Consultation',
      date: addDays(new Date(), 5),
      time: '14:00',
      duration: 45,
      status: 'pending',
      location: 'Animal Wellness Clinic',
      address: '456 Gulshan, Dhaka',
      phone: '+880 1812-456789',
      notes: 'Discuss socialization issues and training strategies',
      reminderSent: false
    },
    {
      id: '3',
      vetId: '1',
      vetName: 'Dr. Sarah Ahmed',
      petName: pet?.name || 'Max',
      type: 'Dental Cleaning',
      date: addDays(new Date(), 10),
      time: '09:00',
      duration: 60,
      status: 'confirmed',
      location: 'Dhaka Pet Care Center',
      address: '123 Dhanmondi, Dhaka',
      phone: '+880 1712-345678',
      notes: 'Routine dental cleaning and examination',
      reminderSent: true
    }
  ];

  useEffect(() => {
    setAppointments(mockAppointments);
  }, [pet]);

  const [bookingForm, setBookingForm] = useState({
    vetId: '',
    type: '',
    date: '',
    time: '',
    consultationType: 'in-person',
    notes: ''
  });

  const appointmentTypes = [
    { id: 'checkup', label: 'General Checkup', icon: Stethoscope, duration: 30 },
    { id: 'vaccination', label: 'Vaccination', icon: Heart, duration: 15 },
    { id: 'dental', label: 'Dental Care', icon: Activity, duration: 45 },
    { id: 'behavior', label: 'Behavior Consultation', icon: User, duration: 45 },
    { id: 'grooming', label: 'Grooming', icon: Scissors, duration: 60 },
    { id: 'surgery', label: 'Surgery', icon: Heart, duration: 120 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'pending': return Clock;
      case 'cancelled': return AlertCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getServiceIcon = (type) => {
    const service = appointmentTypes.find(s => s.id === type);
    return service ? service.icon : Stethoscope;
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.vetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         apt.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'upcoming' && isBefore(new Date(), apt.date)) ||
                         (filterType === 'past' && isBefore(apt.date, new Date()));
    return matchesSearch && matchesFilter;
  });

  const getWeekDates = (date) => {
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    const dates = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      dates.push(d);
    }
    return dates;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const generateTimeSlots = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const availableVets = vets.filter(vet => 
      vet.availability[dateStr] && vet.availability[dateStr].length > 0
    );
    return availableVets;
  };

  const bookAppointment = () => {
    if (!bookingForm.vetId || !bookingForm.date || !bookingForm.time || !bookingForm.type) {
      alert('Please fill in all required fields');
      return;
    }

    const vet = vets.find(v => v.id === bookingForm.vetId);
    const serviceType = appointmentTypes.find(s => s.id === bookingForm.type);
    
    const newAppointment = {
      id: Date.now().toString(),
      vetId: bookingForm.vetId,
      vetName: vet.name,
      petName: pet?.name || 'Max',
      type: serviceType.label,
      date: new Date(bookingForm.date),
      time: bookingForm.time,
      duration: serviceType.duration,
      status: 'pending',
      location: vet.clinic,
      address: vet.location,
      phone: vet.phone,
      notes: bookingForm.notes,
      reminderSent: false,
      consultationType: bookingForm.consultationType
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowBookingModal(false);
    setBookingForm({
      vetId: '',
      type: '',
      date: '',
      time: '',
      consultationType: 'in-person',
      notes: ''
    });
    
    alert('Appointment booked successfully! You will receive a confirmation shortly.');
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
    ));
  };

  const confirmAppointment = (appointmentId) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-blue-500" />
          Appointment Scheduling
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Schedule and manage {pet?.name || 'your pet'}'s veterinary appointments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{appointments.length}</div>
          <div className="text-sm opacity-90">Total Appointments</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {appointments.filter(apt => apt.status === 'confirmed').length}
          </div>
          <div className="text-sm opacity-90">Confirmed</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {appointments.filter(apt => apt.status === 'pending').length}
          </div>
          <div className="text-sm opacity-90">Pending</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {appointments.filter(apt => isSameDay(apt.date, new Date())).length}
          </div>
          <div className="text-sm opacity-90">Today</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Appointments</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            List View
          </button>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {format(selectedDate, 'MMMM yyyy')}
              </h3>
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
              {getWeekDates(selectedDate).map(date => {
                const dayAppointments = getAppointmentsForDate(date);
                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors ${
                      isSameDay(date, new Date())
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : isToday(date)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isSameDay(date, new Date()) ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                    }`}>
                      {format(date, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.id}
                          className={`text-xs px-1 py-0.5 rounded ${getStatusColor(apt.status)}`}
                        >
                          {apt.time} {apt.type}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No appointments found</p>
              </div>
            ) : (
              filteredAppointments.map(appointment => {
                const StatusIcon = getStatusIcon(appointment.status);
                const ServiceIcon = getServiceIcon(appointment.type.toLowerCase().replace(' ', ''));
                
                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <ServiceIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {appointment.type}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            with {appointment.vetName}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(appointment.date, 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time} ({appointment.duration} min)
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {appointment.location}
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              Notes: {appointment.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => confirmAppointment(appointment.id)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => cancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {appointment.status === 'confirmed' && isSameDay(appointment.date, new Date()) && (
                          <div className="flex items-center gap-1 text-green-600">
                            <Bell className="h-4 w-4" />
                            <span className="text-sm font-medium">Today!</span>
                          </div>
                        )}
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Book New Appointment
                </h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Step 1: Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Service Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {appointmentTypes.map(service => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => setBookingForm(prev => ({ ...prev, type: service.id }))}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            bookingForm.type === service.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-6 w-6 text-gray-600 mb-2" />
                          <div className="font-medium text-sm">{service.label}</div>
                          <div className="text-xs text-gray-500">{service.duration} min</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Select Veterinarian */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Veterinarian
                  </label>
                  <div className="space-y-3">
                    {vets.map(vet => (
                      <button
                        key={vet.id}
                        onClick={() => setBookingForm(prev => ({ ...prev, vetId: vet.id }))}
                        className={`w-full p-4 border rounded-lg text-left transition-colors ${
                          bookingForm.vetId === vet.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{vet.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{vet.specialization}</p>
                            <p className="text-xs text-gray-500">{vet.clinic} • {vet.location}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">⭐ {vet.rating}</div>
                            <div className="text-xs text-gray-500">{vet.experience}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Date & Time */}
                {bookingForm.vetId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Available Time Slots
                      </label>
                      {bookingForm.date ? (
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                          {vets.find(v => v.id === bookingForm.vetId)?.availability[bookingForm.date]?.map(time => (
                            <button
                              key={time}
                              onClick={() => setBookingForm(prev => ({ ...prev, time }))}
                              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                                bookingForm.time === time
                                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {time}
                            </button>
                          )) || <div className="col-span-3 text-sm text-gray-500">No availability</div>}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Select a date first</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 4: Consultation Type & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Consultation Type
                    </label>
                    <select
                      value={bookingForm.consultationType}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, consultationType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="in-person">In-Person Visit</option>
                      <option value="video">Video Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Any specific concerns or information for the vet..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={bookAppointment}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSchedulingSystem;