/**
 * Unified Notification Service for WarmPaws
 * Coordinates SMS, Email, and Push notifications
 */

import smsService from './smsService.js';
import emailService from './emailService.js';

class NotificationService {
  constructor() {
    this.sms = smsService;
    this.email = emailService;
    this.notificationQueue = [];
    this.isProcessing = false;
  }

  /**
   * Send notification through multiple channels
   * @param {object} options - Notification options
   * @returns {Promise<object>} - Results from all channels
   */
  async sendNotification({
    userId,
    type,
    data,
    channels = ['email'], // Default to email only
    preferences = {}
  }) {
    const results = {
      email: null,
      sms: null,
      push: null,
      timestamp: new Date().toISOString()
    };

    // Check user preferences and quiet hours
    if (this.isQuietHours(preferences.quietHours)) {
      // Queue for later delivery
      this.queueNotification({ userId, type, data, channels, preferences });
      return { queued: true, reason: 'quiet_hours', ...results };
    }

    // Send through each enabled channel
    const promises = [];

    if (channels.includes('email') && data.email) {
      promises.push(
        this.sendEmailNotification(type, data)
          .then(result => { results.email = result; })
      );
    }

    if (channels.includes('sms') && data.phoneNumber) {
      promises.push(
        this.sendSMSNotification(type, data)
          .then(result => { results.sms = result; })
      );
    }

    await Promise.all(promises);

    // Log notification
    this.logNotification(userId, type, results);

    return results;
  }

  /**
   * Send email notification based on type
   */
  async sendEmailNotification(type, data) {
    switch (type) {
      case 'vaccination_reminder':
        return this.email.sendVaccinationReminder(data.email, data);
      case 'appointment_reminder':
        return this.email.sendAppointmentReminder(data.email, data);
      case 'medication_reminder':
        return this.email.sendMedicationReminder(data.email, data);
      case 'health_alert':
        return this.email.sendHealthAlert(data.email, data);
      case 'adoption_update':
        return this.email.sendAdoptionUpdate(data.email, data);
      case 'welcome':
        return this.email.sendWelcomeEmail(data.email, data);
      default:
        return this.email.sendEmail({
          to: data.email,
          subject: data.subject || 'WarmPaws Notification',
          text: data.message,
          html: this.email.generateTemplate(data.title || 'Notification', `<p>${data.message}</p>`)
        });
    }
  }

  /**
   * Send SMS notification based on type
   */
  async sendSMSNotification(type, data) {
    switch (type) {
      case 'vaccination_reminder':
        return this.sms.sendVaccinationReminder(data.phoneNumber, data);
      case 'appointment_reminder':
        return this.sms.sendAppointmentReminder(data.phoneNumber, data);
      case 'medication_reminder':
        return this.sms.sendMedicationReminder(data.phoneNumber, data);
      case 'health_alert':
        return this.sms.sendHealthAlert(data.phoneNumber, data);
      case 'adoption_update':
        return this.sms.sendAdoptionUpdate(data.phoneNumber, data);
      default:
        return this.sms.sendSMS(data.phoneNumber, data.message);
    }
  }

  /**
   * Check if current time is within quiet hours
   */
  isQuietHours(quietHours) {
    if (!quietHours?.enabled) return false;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = quietHours.start.split(':').map(Number);
    const [endHour, endMinute] = quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Handle overnight quiet hours (e.g., 22:00 - 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime < endTime;
    }

    return currentTime >= startTime && currentTime < endTime;
  }

  /**
   * Queue notification for later delivery
   */
  queueNotification(notification) {
    this.notificationQueue.push({
      ...notification,
      queuedAt: new Date().toISOString()
    });
    console.log(`📋 Notification queued for later delivery`);
  }

  /**
   * Process queued notifications
   */
  async processQueue() {
    if (this.isProcessing || this.notificationQueue.length === 0) return;

    this.isProcessing = true;
    const toProcess = [...this.notificationQueue];
    this.notificationQueue = [];

    for (const notification of toProcess) {
      if (!this.isQuietHours(notification.preferences?.quietHours)) {
        await this.sendNotification(notification);
      } else {
        // Re-queue if still in quiet hours
        this.notificationQueue.push(notification);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Log notification for analytics
   */
  logNotification(userId, type, results) {
    console.log(`📊 Notification Log:`, {
      userId,
      type,
      emailSent: results.email?.success || false,
      smsSent: results.sms?.success || false,
      timestamp: results.timestamp
    });
  }

  /**
   * Schedule recurring notifications (e.g., daily medication reminders)
   */
  scheduleRecurring(schedule) {
    // This would integrate with a job scheduler like node-cron
    console.log('📅 Recurring notification scheduled:', schedule);
    return { scheduled: true, schedule };
  }

  /**
   * Send batch notifications to multiple users
   */
  async sendBatchNotifications(notifications) {
    const results = [];
    
    // Process in batches to avoid overwhelming services
    const batchSize = 5;
    for (let i = 0; i < notifications.length; i += batchSize) {
      const batch = notifications.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(n => this.sendNotification(n))
      );
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < notifications.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    return results;
  }

  /**
   * Get notification statistics
   */
  getStats() {
    return {
      queueLength: this.notificationQueue.length,
      emailConfigured: this.email.isConfigured,
      smsConfigured: this.sms.isConfigured
    };
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
