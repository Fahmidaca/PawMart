/**
 * Notification Routes for WarmPaws
 * API endpoints for sending and managing notifications
 */

import express from 'express';
import notificationService from '../services/notificationService.js';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';

const router = express.Router();

/**
 * @route POST /api/notifications/send
 * @desc Send a notification through specified channels
 * @access Private
 */
router.post('/send', verifyFirebaseToken, async (req, res) => {
  try {
    const { type, data, channels } = req.body;

    if (!type || !data) {
      return res.status(400).json({
        success: false,
        message: 'Type and data are required'
      });
    }

    const result = await notificationService.sendNotification({
      userId: req.user.uid,
      type,
      data,
      channels: channels || ['email']
    });

    res.json({
      success: true,
      message: 'Notification sent successfully',
      result
    });
  } catch (error) {
    console.error('Notification send error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/vaccination-reminder
 * @desc Send vaccination reminder
 * @access Private
 */
router.post('/vaccination-reminder', verifyFirebaseToken, async (req, res) => {
  try {
    const { petName, vaccineName, date, email, phoneNumber, channels } = req.body;

    const result = await notificationService.sendNotification({
      userId: req.user.uid,
      type: 'vaccination_reminder',
      data: {
        petName,
        vaccineName,
        date,
        email,
        phoneNumber,
        ownerName: req.user.name || 'Pet Parent'
      },
      channels: channels || ['email']
    });

    res.json({
      success: true,
      message: 'Vaccination reminder sent',
      result
    });
  } catch (error) {
    console.error('Vaccination reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send vaccination reminder',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/appointment-reminder
 * @desc Send appointment reminder
 * @access Private
 */
router.post('/appointment-reminder', verifyFirebaseToken, async (req, res) => {
  try {
    const { petName, date, time, location, appointmentType, email, phoneNumber, channels } = req.body;

    const result = await notificationService.sendNotification({
      userId: req.user.uid,
      type: 'appointment_reminder',
      data: {
        petName,
        date,
        time,
        location,
        appointmentType,
        email,
        phoneNumber,
        ownerName: req.user.name || 'Pet Parent'
      },
      channels: channels || ['email']
    });

    res.json({
      success: true,
      message: 'Appointment reminder sent',
      result
    });
  } catch (error) {
    console.error('Appointment reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send appointment reminder',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/medication-reminder
 * @desc Send medication reminder
 * @access Private
 */
router.post('/medication-reminder', verifyFirebaseToken, async (req, res) => {
  try {
    const { petName, medicationName, dosage, instructions, email, phoneNumber, channels } = req.body;

    const result = await notificationService.sendNotification({
      userId: req.user.uid,
      type: 'medication_reminder',
      data: {
        petName,
        medicationName,
        dosage,
        instructions,
        email,
        phoneNumber,
        ownerName: req.user.name || 'Pet Parent'
      },
      channels: channels || ['email']
    });

    res.json({
      success: true,
      message: 'Medication reminder sent',
      result
    });
  } catch (error) {
    console.error('Medication reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send medication reminder',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/health-alert
 * @desc Send health alert
 * @access Private
 */
router.post('/health-alert', verifyFirebaseToken, async (req, res) => {
  try {
    const { petName, healthScore, alertType, details, email, phoneNumber, channels } = req.body;

    const result = await notificationService.sendNotification({
      userId: req.user.uid,
      type: 'health_alert',
      data: {
        petName,
        healthScore,
        alertType,
        details,
        email,
        phoneNumber,
        ownerName: req.user.name || 'Pet Parent'
      },
      channels: channels || ['email', 'sms'] // Health alerts go to both by default
    });

    res.json({
      success: true,
      message: 'Health alert sent',
      result
    });
  } catch (error) {
    console.error('Health alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send health alert',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/batch
 * @desc Send batch notifications
 * @access Private
 */
router.post('/batch', verifyFirebaseToken, async (req, res) => {
  try {
    const { notifications } = req.body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Notifications array is required'
      });
    }

    // Add user ID to all notifications
    const notificationsWithUser = notifications.map(n => ({
      ...n,
      userId: req.user.uid
    }));

    const results = await notificationService.sendBatchNotifications(notificationsWithUser);

    res.json({
      success: true,
      message: `${results.length} notifications processed`,
      results
    });
  } catch (error) {
    console.error('Batch notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send batch notifications',
      error: error.message
    });
  }
});

/**
 * @route GET /api/notifications/stats
 * @desc Get notification service statistics
 * @access Private
 */
router.get('/stats', verifyFirebaseToken, async (req, res) => {
  try {
    const stats = notificationService.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification stats',
      error: error.message
    });
  }
});

/**
 * @route POST /api/notifications/test
 * @desc Test notification delivery (development only)
 * @access Private
 */
router.post('/test', verifyFirebaseToken, async (req, res) => {
  try {
    const { email, phoneNumber, channel } = req.body;

    let result;
    if (channel === 'sms' && phoneNumber) {
      result = await notificationService.sms.sendSMS(
        phoneNumber,
        '🐾 WarmPaws Test: Your SMS notifications are working!'
      );
    } else if (email) {
      result = await notificationService.email.sendEmail({
        to: email,
        subject: '🐾 WarmPaws Test Notification',
        text: 'Your email notifications are working!',
        html: notificationService.email.generateTemplate(
          'Test Notification',
          '<p>Congratulations! Your email notifications are configured correctly.</p>'
        )
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email or phone number required'
      });
    }

    res.json({
      success: true,
      message: 'Test notification sent',
      result
    });
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    });
  }
});

export default router;
