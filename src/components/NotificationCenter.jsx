import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Calendar, 
  Stethoscope, 
  Pill, 
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Filter,
  Trash2,
  Mail,
  Smartphone,
  Send,
  TestTube
} from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday, isPast, addDays } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import notificationApiService from '../services/notificationService';

const NotificationCenter = ({ pet, healthData }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(null);
  const [deliverySettings, setDeliverySettings] = useState({
    email: user?.email || '',
    phoneNumber: '',
    enableEmail: true,
    enableSMS: false
  });
  const [settings, setSettings] = useState({
    vaccinationReminders: true,
    appointmentReminders: true,
    medicationReminders: true,
    healthAlerts: true,
    quietHours: { enabled: false, start: '22:00', end: '08:00' },
    advanceNotice: 3 // days
  });

  // Generate mock notifications based on pet health data
  const generateNotifications = () => {
    const mockNotifications = [];
    const today = new Date();

    // Vaccination reminders
    if (healthData?.vaccinations) {
      healthData.vaccinations.forEach(vax => {
        const scheduledDate = new Date(vax.scheduledDate);
        const daysUntil = Math.ceil((scheduledDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil >= 0 && daysUntil <= settings.advanceNotice && vax.status !== 'completed') {
          mockNotifications.push({
            id: `vax-${vax.id}`,
            type: 'vaccination',
            title: 'Vaccination Due Soon',
            message: `${vax.vaccineName} is scheduled for ${format(scheduledDate, 'MMM dd, yyyy')}`,
            priority: daysUntil <= 1 ? 'urgent' : daysUntil <= 3 ? 'high' : 'medium',
            date: scheduledDate,
            isRead: false,
            actionRequired: true,
            relatedId: vax.id,
            petId: pet.id
          });
        } else if (daysUntil < 0 && vax.status === 'scheduled') {
          mockNotifications.push({
            id: `vax-overdue-${vax.id}`,
            type: 'vaccination',
            title: 'Vaccination Overdue',
            message: `${vaccineName} was due ${format(scheduledDate, 'MMM dd, yyyy')}`,
            priority: 'urgent',
            date: scheduledDate,
            isRead: false,
            actionRequired: true,
            relatedId: vax.id,
            petId: pet.id
          });
        }
      });
    }

    // Appointment reminders
    if (healthData?.upcomingAppointments) {
      healthData.upcomingAppointments.forEach(apt => {
        const appointmentDate = new Date(apt.date);
        const daysUntil = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil >= 0 && daysUntil <= settings.advanceNotice) {
          mockNotifications.push({
            id: `apt-${apt.id}`,
            type: 'appointment',
            title: 'Upcoming Appointment',
            message: `Health checkup scheduled for ${format(appointmentDate, 'MMM dd, yyyy')}`,
            priority: daysUntil <= 1 ? 'high' : 'medium',
            date: appointmentDate,
            isRead: false,
            actionRequired: false,
            relatedId: apt.id,
            petId: pet.id
          });
        }
      });
    }

    // Medication reminders
    if (healthData?.medications) {
      healthData.medications.forEach(med => {
        if (med.status === 'active' && med.nextDose) {
          const nextDoseDate = new Date(med.nextDose);
          const hoursUntil = Math.ceil((nextDoseDate - today) / (1000 * 60 * 60));
          
          if (hoursUntil <= 24 && hoursUntil >= 0) {
            mockNotifications.push({
              id: `med-${med.id}`,
              type: 'medication',
              title: 'Medication Reminder',
              message: `${med.name} - Next dose in ${hoursUntil} hours`,
              priority: hoursUntil <= 2 ? 'urgent' : 'medium',
              date: nextDoseDate,
              isRead: false,
              actionRequired: true,
              relatedId: med.id,
              petId: pet.id
            });
          }
        }
      });
    }

    // Health alerts
    if (healthData?.healthScore && healthData.healthScore < 70) {
      mockNotifications.push({
        id: 'health-alert',
        type: 'health',
        title: 'Health Score Alert',
        message: `${pet.name}'s health score has dropped to ${healthData.healthScore}`,
        priority: 'high',
        date: today,
        isRead: false,
        actionRequired: true,
        petId: pet.id
      });
    }

    // Follow-up reminders
    if (healthData?.records) {
      healthData.records.forEach(record => {
        if (record.followUpDate) {
          const followUpDate = new Date(record.followUpDate);
          const daysUntil = Math.ceil((followUpDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntil >= 0 && daysUntil <= settings.advanceNotice) {
            mockNotifications.push({
              id: `followup-${record.id}`,
              type: 'followup',
              title: 'Follow-up Due',
              message: `Follow-up for ${record.title} is scheduled for ${format(followUpDate, 'MMM dd, yyyy')}`,
              priority: daysUntil <= 1 ? 'high' : 'medium',
              date: followUpDate,
              isRead: false,
              actionRequired: true,
              relatedId: record.id,
              petId: pet.id
            });
          }
        }
      });
    }

    return mockNotifications.sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.date) - new Date(b.date);
    });
  };

  useEffect(() => {
    if (pet && healthData) {
      setNotifications(generateNotifications());
    }
    setLoading(false);
  }, [pet, healthData, settings]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'medication':
        return <Pill className="h-5 w-5 text-purple-500" />;
      case 'health':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'followup':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800';
      case 'high':
        return 'border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800';
    }
  };

  const getDateDisplay = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'urgent') return notification.priority === 'urgent' || notification.priority === 'high';
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getFilteredCount = (filterType) => {
    switch (filterType) {
      case 'all':
        return notifications.length;
      case 'unread':
        return notifications.filter(n => !n.isRead).length;
      case 'urgent':
        return notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length;
      default:
        return notifications.filter(n => n.type === filterType).length;
    }
  };

  // Send notification via email/SMS
  const sendNotificationExternal = async (notification) => {
    setSendingNotification(notification.id);
    
    const channels = [];
    if (deliverySettings.enableEmail && deliverySettings.email) channels.push('email');
    if (deliverySettings.enableSMS && deliverySettings.phoneNumber) channels.push('sms');

    if (channels.length === 0) {
      alert('Please configure at least one delivery channel (email or SMS) in settings.');
      setSendingNotification(null);
      return;
    }

    try {
      const data = {
        petName: pet?.name || 'Your pet',
        email: deliverySettings.email,
        phoneNumber: deliverySettings.phoneNumber,
        ownerName: user?.displayName || 'Pet Parent'
      };

      let result;
      switch (notification.type) {
        case 'vaccination':
          result = await notificationApiService.sendVaccinationReminder({
            ...data,
            vaccineName: notification.message.split(' is scheduled')[0] || 'Vaccination',
            date: format(notification.date, 'MMM dd, yyyy')
          }, channels);
          break;
        case 'appointment':
          result = await notificationApiService.sendAppointmentReminder({
            ...data,
            date: format(notification.date, 'MMM dd, yyyy'),
            time: format(notification.date, 'h:mm a')
          }, channels);
          break;
        case 'medication':
          result = await notificationApiService.sendMedicationReminder({
            ...data,
            medicationName: notification.message.split(' - ')[0] || 'Medication',
            dosage: 'As prescribed'
          }, channels);
          break;
        case 'health':
          result = await notificationApiService.sendHealthAlert({
            ...data,
            healthScore: healthData?.healthScore || 0
          }, channels);
          break;
        default:
          result = await notificationApiService.sendNotification(notification.type, {
            ...data,
            message: notification.message,
            title: notification.title
          }, channels);
      }

      if (result.success) {
        alert(`Notification sent successfully via ${channels.join(' and ')}!`);
        markAsRead(notification.id);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification. Please try again.');
    } finally {
      setSendingNotification(null);
    }
  };

  // Test notification delivery
  const testNotificationDelivery = async (channel) => {
    try {
      const result = await notificationApiService.testNotification(
        deliverySettings.email,
        deliverySettings.phoneNumber,
        channel
      );
      if (result.success) {
        alert(`Test ${channel} notification sent successfully!`);
      }
    } catch (error) {
      console.error('Test notification failed:', error);
      alert(`Failed to send test ${channel} notification.`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Health Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Mark all read
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Notification Settings
            </h4>
            
            {/* Delivery Channels */}
            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Send className="h-4 w-4" />
                Delivery Channels
              </h5>
              
              {/* Email Settings */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliverySettings.enableEmail}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, enableEmail: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {deliverySettings.enableEmail && (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={deliverySettings.email}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => testNotificationDelivery('email')}
                      className="px-3 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
                    >
                      <TestTube className="h-3 w-3" />
                      Test
                    </button>
                  </div>
                )}
              </div>

              {/* SMS Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    SMS Notifications
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deliverySettings.enableSMS}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, enableSMS: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                {deliverySettings.enableSMS && (
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={deliverySettings.phoneNumber}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+1234567890"
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => testNotificationDelivery('sms')}
                      className="px-3 py-2 text-xs bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-1"
                    >
                      <TestTube className="h-3 w-3" />
                      Test
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reminder Types */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Vaccination reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.vaccinationReminders}
                    onChange={(e) => setSettings(prev => ({ ...prev, vaccinationReminders: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Appointment reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.appointmentReminders}
                    onChange={(e) => setSettings(prev => ({ ...prev, appointmentReminders: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Medication reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.medicationReminders}
                    onChange={(e) => setSettings(prev => ({ ...prev, medicationReminders: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All', icon: Bell },
          { key: 'unread', label: 'Unread', icon: Mail },
          { key: 'urgent', label: 'Urgent', icon: AlertCircle },
          { key: 'vaccination', label: 'Vaccinations', icon: Stethoscope },
          { key: 'appointment', label: 'Appointments', icon: Calendar },
          { key: 'medication', label: 'Medications', icon: Pill }
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
              {getFilteredCount(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading notifications...
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No notifications to show</p>
            <p className="text-sm">New health alerts will appear here</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                  notification.isRead ? 'opacity-75' : ''
                } ${getPriorityColor(notification.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {getDateDisplay(notification.date)}
                          </span>
                          {notification.actionRequired && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Action Required
                            </span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => sendNotificationExternal(notification)}
                          disabled={sendingNotification === notification.id}
                          className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 disabled:opacity-50"
                          title="Send via Email/SMS"
                        >
                          {sendingNotification === notification.id ? (
                            <div className="h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;