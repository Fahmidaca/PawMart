/**
 * Email Service for WarmPaws
 * Integrates with Nodemailer for email notifications
 * Supports multiple providers: SMTP, SendGrid, Mailgun
 * 
 * Environment variables:
 * - EMAIL_SERVICE (smtp, sendgrid, mailgun)
 * - EMAIL_HOST (for SMTP)
 * - EMAIL_PORT (for SMTP)
 * - EMAIL_USER
 * - EMAIL_PASS
 * - EMAIL_FROM
 * - SENDGRID_API_KEY (for SendGrid)
 * - MAILGUN_API_KEY (for Mailgun)
 * - MAILGUN_DOMAIN (for Mailgun)
 */

import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@warmpaws.com';
    this.isConfigured = false;
    this.initialize();
  }

  initialize() {
    const service = process.env.EMAIL_SERVICE || 'smtp';

    try {
      switch (service.toLowerCase()) {
        case 'sendgrid':
          this.transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
              user: 'apikey',
              pass: process.env.SENDGRID_API_KEY
            }
          });
          break;

        case 'mailgun':
          this.transporter = nodemailer.createTransport({
            host: 'smtp.mailgun.org',
            port: 587,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.MAILGUN_API_KEY
            }
          });
          break;

        case 'smtp':
        default:
          if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
            this.transporter = nodemailer.createTransport({
              host: process.env.EMAIL_HOST,
              port: parseInt(process.env.EMAIL_PORT) || 587,
              secure: process.env.EMAIL_SECURE === 'true',
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
              }
            });
          }
          break;
      }

      if (this.transporter) {
        this.isConfigured = true;
        console.log('✅ Email Service initialized successfully');
      } else {
        console.warn('⚠️ Email Service not configured - missing credentials');
      }
    } catch (error) {
      console.warn('⚠️ Email Service initialization failed:', error.message);
      this.isConfigured = false;
    }
  }

  /**
   * Send a single email
   * @param {object} options - Email options
   * @returns {Promise<object>} - Send result
   */
  async sendEmail({ to, subject, text, html }) {
    if (!this.isConfigured) {
      console.log('📧 Email (Mock):', { to, subject });
      return { success: true, mock: true, messageId: `mock-${Date.now()}` };
    }

    try {
      const result = await this.transporter.sendMail({
        from: this.fromEmail,
        to,
        subject,
        text,
        html
      });

      console.log(`📧 Email sent to ${to}: ${result.messageId}`);
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('❌ Email send failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate HTML email template
   * @param {string} title - Email title
   * @param {string} content - Main content
   * @param {string} ctaText - Call to action button text
   * @param {string} ctaUrl - Call to action URL
   * @returns {string} - HTML email
   */
  generateTemplate(title, content, ctaText = null, ctaUrl = null) {
    const ctaButton = ctaText && ctaUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${ctaUrl}" style="background-color: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          ${ctaText}
        </a>
      </div>
    ` : '';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🐾 WarmPaws</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Pet Care & Adoption Platform</p>
    </div>
    
    <!-- Content -->
    <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #1f2937; margin-top: 0;">${title}</h2>
      <div style="color: #4b5563; line-height: 1.6;">
        ${content}
      </div>
      ${ctaButton}
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
      <p>© ${new Date().getFullYear()} WarmPaws. All rights reserved.</p>
      <p>You're receiving this email because you have an account with WarmPaws.</p>
      <p>
        <a href="#" style="color: #3B82F6; text-decoration: none;">Unsubscribe</a> | 
        <a href="#" style="color: #3B82F6; text-decoration: none;">Manage Preferences</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Send vaccination reminder email
   * @param {string} email - Recipient email
   * @param {object} data - Vaccination data
   */
  async sendVaccinationReminder(email, data) {
    const content = `
      <p>Hi ${data.ownerName || 'Pet Parent'},</p>
      <p>This is a friendly reminder that <strong>${data.petName}</strong>'s <strong>${data.vaccineName}</strong> vaccination is scheduled for:</p>
      <div style="background-color: #EFF6FF; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
        <p style="margin: 0; font-size: 18px; color: #1e40af;"><strong>📅 ${data.date}</strong></p>
        ${data.time ? `<p style="margin: 5px 0 0 0; color: #3b82f6;">⏰ ${data.time}</p>` : ''}
        ${data.location ? `<p style="margin: 5px 0 0 0; color: #3b82f6;">📍 ${data.location}</p>` : ''}
      </div>
      <p>Keeping your pet's vaccinations up to date is essential for their health and well-being.</p>
      <p>If you need to reschedule, please contact your veterinarian as soon as possible.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: `🐾 Vaccination Reminder for ${data.petName}`,
      text: `Reminder: ${data.petName}'s ${data.vaccineName} vaccination is scheduled for ${data.date}`,
      html: this.generateTemplate('Vaccination Reminder', content, 'View Pet Health Dashboard', data.dashboardUrl || '#')
    });
  }

  /**
   * Send appointment reminder email
   * @param {string} email - Recipient email
   * @param {object} data - Appointment data
   */
  async sendAppointmentReminder(email, data) {
    const content = `
      <p>Hi ${data.ownerName || 'Pet Parent'},</p>
      <p>You have an upcoming appointment for <strong>${data.petName}</strong>:</p>
      <div style="background-color: #F0FDF4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22C55E;">
        <p style="margin: 0; font-size: 18px; color: #166534;"><strong>📅 ${data.date}</strong></p>
        <p style="margin: 5px 0 0 0; color: #16a34a;">⏰ ${data.time}</p>
        ${data.location ? `<p style="margin: 5px 0 0 0; color: #16a34a;">📍 ${data.location}</p>` : ''}
        ${data.appointmentType ? `<p style="margin: 5px 0 0 0; color: #16a34a;">🏥 ${data.appointmentType}</p>` : ''}
      </div>
      <p><strong>What to bring:</strong></p>
      <ul>
        <li>Your pet's health records</li>
        <li>List of current medications</li>
        <li>Any questions for the vet</li>
      </ul>
    `;

    return this.sendEmail({
      to: email,
      subject: `🐾 Appointment Reminder for ${data.petName}`,
      text: `Reminder: You have an appointment for ${data.petName} on ${data.date} at ${data.time}`,
      html: this.generateTemplate('Appointment Reminder', content, 'View Appointment Details', data.appointmentUrl || '#')
    });
  }

  /**
   * Send medication reminder email
   * @param {string} email - Recipient email
   * @param {object} data - Medication data
   */
  async sendMedicationReminder(email, data) {
    const content = `
      <p>Hi ${data.ownerName || 'Pet Parent'},</p>
      <p>It's time to give <strong>${data.petName}</strong> their medication:</p>
      <div style="background-color: #FDF4FF; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #A855F7;">
        <p style="margin: 0; font-size: 18px; color: #7e22ce;"><strong>💊 ${data.medicationName}</strong></p>
        <p style="margin: 5px 0 0 0; color: #9333ea;">Dosage: ${data.dosage}</p>
        ${data.instructions ? `<p style="margin: 5px 0 0 0; color: #9333ea;">Instructions: ${data.instructions}</p>` : ''}
      </div>
      <p>Consistent medication schedules help ensure the best outcomes for your pet's health.</p>
    `;

    return this.sendEmail({
      to: email,
      subject: `🐾 Medication Reminder for ${data.petName}`,
      text: `Reminder: Time to give ${data.petName} their ${data.medicationName}. Dosage: ${data.dosage}`,
      html: this.generateTemplate('Medication Reminder', content, 'View Medication Schedule', data.medicationUrl || '#')
    });
  }

  /**
   * Send health alert email
   * @param {string} email - Recipient email
   * @param {object} data - Health alert data
   */
  async sendHealthAlert(email, data) {
    const content = `
      <p>Hi ${data.ownerName || 'Pet Parent'},</p>
      <p>We noticed a change in <strong>${data.petName}</strong>'s health metrics that requires your attention:</p>
      <div style="background-color: #FEF2F2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
        <p style="margin: 0; font-size: 18px; color: #dc2626;"><strong>⚠️ Health Score: ${data.healthScore}/100</strong></p>
        ${data.alertType ? `<p style="margin: 5px 0 0 0; color: #ef4444;">Alert Type: ${data.alertType}</p>` : ''}
        ${data.details ? `<p style="margin: 5px 0 0 0; color: #ef4444;">${data.details}</p>` : ''}
      </div>
      <p><strong>Recommended Actions:</strong></p>
      <ul>
        <li>Monitor your pet closely for any unusual behavior</li>
        <li>Check food and water intake</li>
        <li>Consider scheduling a vet visit if symptoms persist</li>
      </ul>
    `;

    return this.sendEmail({
      to: email,
      subject: `⚠️ Health Alert for ${data.petName}`,
      text: `Alert: ${data.petName}'s health score has dropped to ${data.healthScore}. Please check on your pet.`,
      html: this.generateTemplate('Health Alert', content, 'View Health Dashboard', data.dashboardUrl || '#')
    });
  }

  /**
   * Send adoption application update email
   * @param {string} email - Recipient email
   * @param {object} data - Adoption data
   */
  async sendAdoptionUpdate(email, data) {
    const statusColors = {
      pending: '#F59E0B',
      approved: '#22C55E',
      rejected: '#EF4444',
      completed: '#3B82F6'
    };

    const statusColor = statusColors[data.status?.toLowerCase()] || '#6B7280';

    const content = `
      <p>Hi ${data.applicantName || 'Pet Lover'},</p>
      <p>We have an update on your adoption application for <strong>${data.petName}</strong>:</p>
      <div style="background-color: #F9FAFB; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
        <p style="margin: 0; font-size: 18px; color: ${statusColor};"><strong>Status: ${data.status}</strong></p>
        ${data.message ? `<p style="margin: 10px 0 0 0; color: #4b5563;">${data.message}</p>` : ''}
      </div>
      ${data.nextSteps ? `
        <p><strong>Next Steps:</strong></p>
        <p>${data.nextSteps}</p>
      ` : ''}
    `;

    return this.sendEmail({
      to: email,
      subject: `🐾 Adoption Update for ${data.petName}`,
      text: `Your adoption application for ${data.petName} has been updated. Status: ${data.status}`,
      html: this.generateTemplate('Adoption Application Update', content, 'View Application', data.applicationUrl || '#')
    });
  }

  /**
   * Send welcome email to new users
   * @param {string} email - Recipient email
   * @param {object} data - User data
   */
  async sendWelcomeEmail(email, data) {
    const content = `
      <p>Hi ${data.name || 'Pet Lover'},</p>
      <p>Welcome to <strong>WarmPaws</strong>! 🎉</p>
      <p>We're thrilled to have you join our community of pet lovers. Here's what you can do with WarmPaws:</p>
      <ul>
        <li>🐕 Browse adorable pets available for adoption</li>
        <li>📊 Track your pet's health with our comprehensive dashboard</li>
        <li>💊 Set medication and vaccination reminders</li>
        <li>🏥 Schedule vet appointments</li>
        <li>👥 Connect with other pet parents in our community</li>
      </ul>
      <p>Start exploring and find your perfect furry companion today!</p>
    `;

    return this.sendEmail({
      to: email,
      subject: '🐾 Welcome to WarmPaws!',
      text: `Welcome to WarmPaws, ${data.name}! Start exploring pets available for adoption.`,
      html: this.generateTemplate('Welcome to WarmPaws!', content, 'Explore Pets', data.exploreUrl || '#')
    });
  }

  /**
   * Send bulk emails
   * @param {Array<object>} emails - Array of email objects
   * @returns {Promise<Array>} - Results array
   */
  async sendBulkEmails(emails) {
    const results = [];
    
    // Process in batches
    const batchSize = 10;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(email => this.sendEmail(email))
      );
      results.push(...batchResults);
      
      // Delay between batches
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} - Is valid email
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Export singleton instance
const emailService = new EmailService();
export default emailService;
