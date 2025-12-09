/**
 * SMS Service for WarmPaws
 * Integrates with Twilio for SMS notifications
 * 
 * To use this service, set the following environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 */

import twilio from 'twilio';

class SMSService {
  constructor() {
    this.client = null;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    this.isConfigured = false;
    this.initialize();
  }

  initialize() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && authToken && this.fromNumber) {
      try {
        this.client = twilio(accountSid, authToken);
        this.isConfigured = true;
        console.log('✅ SMS Service initialized successfully');
      } catch (error) {
        console.warn('⚠️ SMS Service initialization failed:', error.message);
        this.isConfigured = false;
      }
    } else {
      console.warn('⚠️ SMS Service not configured - missing Twilio credentials');
      this.isConfigured = false;
    }
  }

  /**
   * Send a single SMS message
   * @param {string} to - Recipient phone number (E.164 format)
   * @param {string} message - Message content
   * @returns {Promise<object>} - Send result
   */
  async sendSMS(to, message) {
    if (!this.isConfigured) {
      console.log('📱 SMS (Mock):', { to, message: message.substring(0, 50) + '...' });
      return { success: true, mock: true, messageId: `mock-${Date.now()}` };
    }

    try {
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      console.log(`📱 SMS sent to ${to}: ${result.sid}`);
      return {
        success: true,
        messageId: result.sid,
        status: result.status
      };
    } catch (error) {
      console.error('❌ SMS send failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Send vaccination reminder SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {object} data - Vaccination data
   */
  async sendVaccinationReminder(phoneNumber, data) {
    const message = `🐾 WarmPaws Reminder: ${data.petName}'s ${data.vaccineName} vaccination is scheduled for ${data.date}. Don't forget to visit your vet!`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send appointment reminder SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {object} data - Appointment data
   */
  async sendAppointmentReminder(phoneNumber, data) {
    const message = `🐾 WarmPaws Reminder: You have an appointment for ${data.petName} on ${data.date} at ${data.time}. Location: ${data.location || 'Your vet clinic'}`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send medication reminder SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {object} data - Medication data
   */
  async sendMedicationReminder(phoneNumber, data) {
    const message = `🐾 WarmPaws Reminder: Time to give ${data.petName} their ${data.medicationName}. Dosage: ${data.dosage}`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send health alert SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {object} data - Health alert data
   */
  async sendHealthAlert(phoneNumber, data) {
    const message = `⚠️ WarmPaws Alert: ${data.petName}'s health score has dropped to ${data.healthScore}. Please check on your pet and consider consulting a vet.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send adoption update SMS
   * @param {string} phoneNumber - Recipient phone number
   * @param {object} data - Adoption data
   */
  async sendAdoptionUpdate(phoneNumber, data) {
    const message = `🎉 WarmPaws Update: Great news about your adoption application for ${data.petName}! Status: ${data.status}. ${data.additionalInfo || ''}`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send bulk SMS messages
   * @param {Array<{to: string, message: string}>} messages - Array of messages
   * @returns {Promise<Array>} - Results array
   */
  async sendBulkSMS(messages) {
    const results = [];
    
    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(msg => this.sendSMS(msg.to, msg.message))
      );
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < messages.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - Is valid E.164 format
   */
  validatePhoneNumber(phoneNumber) {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }

  /**
   * Format phone number to E.164
   * @param {string} phoneNumber - Phone number to format
   * @param {string} countryCode - Country code (default: +1)
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber, countryCode = '+1') {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    // If already has country code
    if (phoneNumber.startsWith('+')) {
      return '+' + digits;
    }
    
    // Add country code
    return countryCode + digits;
  }
}

// Export singleton instance
const smsService = new SMSService();
export default smsService;
