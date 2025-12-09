/**
 * Notification Service for WarmPaws Frontend
 * Handles communication with the notification API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class NotificationApiService {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/notifications`;
  }

  /**
   * Get auth headers
   */
  async getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  /**
   * Send a generic notification
   * @param {string} type - Notification type
   * @param {object} data - Notification data
   * @param {string[]} channels - Delivery channels (email, sms)
   */
  async sendNotification(type, data, channels = ['email']) {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ type, data, channels })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }

  /**
   * Send vaccination reminder
   */
  async sendVaccinationReminder(data, channels = ['email']) {
    try {
      const response = await fetch(`${this.baseUrl}/vaccination-reminder`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ ...data, channels })
      });

      if (!response.ok) {
        throw new Error('Failed to send vaccination reminder');
      }

      return await response.json();
    } catch (error) {
      console.error('Vaccination reminder error:', error);
      throw error;
    }
  }

  /**
   * Send appointment reminder
   */
  async sendAppointmentReminder(data, channels = ['email']) {
    try {
      const response = await fetch(`${this.baseUrl}/appointment-reminder`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ ...data, channels })
      });

      if (!response.ok) {
        throw new Error('Failed to send appointment reminder');
      }

      return await response.json();
    } catch (error) {
      console.error('Appointment reminder error:', error);
      throw error;
    }
  }

  /**
   * Send medication reminder
   */
  async sendMedicationReminder(data, channels = ['email']) {
    try {
      const response = await fetch(`${this.baseUrl}/medication-reminder`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ ...data, channels })
      });

      if (!response.ok) {
        throw new Error('Failed to send medication reminder');
      }

      return await response.json();
    } catch (error) {
      console.error('Medication reminder error:', error);
      throw error;
    }
  }

  /**
   * Send health alert
   */
  async sendHealthAlert(data, channels = ['email', 'sms']) {
    try {
      const response = await fetch(`${this.baseUrl}/health-alert`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ ...data, channels })
      });

      if (!response.ok) {
        throw new Error('Failed to send health alert');
      }

      return await response.json();
    } catch (error) {
      console.error('Health alert error:', error);
      throw error;
    }
  }

  /**
   * Send batch notifications
   */
  async sendBatchNotifications(notifications) {
    try {
      const response = await fetch(`${this.baseUrl}/batch`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ notifications })
      });

      if (!response.ok) {
        throw new Error('Failed to send batch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Batch notification error:', error);
      throw error;
    }
  }

  /**
   * Get notification service stats
   */
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to get notification stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Stats error:', error);
      throw error;
    }
  }

  /**
   * Test notification delivery
   */
  async testNotification(email, phoneNumber, channel = 'email') {
    try {
      const response = await fetch(`${this.baseUrl}/test`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify({ email, phoneNumber, channel })
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      return await response.json();
    } catch (error) {
      console.error('Test notification error:', error);
      throw error;
    }
  }
}

// Export singleton instance
const notificationApiService = new NotificationApiService();
export default notificationApiService;
