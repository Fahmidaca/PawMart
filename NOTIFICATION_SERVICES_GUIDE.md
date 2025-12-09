# WarmPaws Notification Services Setup Guide

## Overview

Phase 4 of WarmPaws includes SMS and Email notification services for:
- Vaccination reminders
- Appointment reminders
- Medication reminders
- Health alerts
- Adoption updates

## Installation

Install the required packages:

```bash
cd warmpaws/warmpaws-server
npm install nodemailer twilio
```

## Configuration

### 1. Email Configuration

Add the following to your `.env` file:

#### Option A: Gmail SMTP (Recommended for Development)

```env
EMAIL_SERVICE=smtp
EMAIL_FROM=your-email@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note:** For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an App Password at https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password)

#### Option B: SendGrid

```env
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@warmpaws.com
SENDGRID_API_KEY=your-sendgrid-api-key
```

#### Option C: Mailgun

```env
EMAIL_SERVICE=mailgun
EMAIL_FROM=noreply@warmpaws.com
EMAIL_USER=postmaster@your-domain.mailgun.org
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-domain.mailgun.org
```

### 2. SMS Configuration (Twilio)

1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Console
3. Purchase a phone number

Add to your `.env` file:

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## API Endpoints

### Send Notification

```http
POST /api/notifications/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "vaccination_reminder",
  "data": {
    "petName": "Buddy",
    "vaccineName": "Rabies",
    "date": "Dec 15, 2024",
    "email": "user@example.com",
    "phoneNumber": "+1234567890"
  },
  "channels": ["email", "sms"]
}
```

### Vaccination Reminder

```http
POST /api/notifications/vaccination-reminder
Authorization: Bearer <token>
Content-Type: application/json

{
  "petName": "Buddy",
  "vaccineName": "Rabies",
  "date": "Dec 15, 2024",
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "channels": ["email"]
}
```

### Appointment Reminder

```http
POST /api/notifications/appointment-reminder
Authorization: Bearer <token>
Content-Type: application/json

{
  "petName": "Buddy",
  "date": "Dec 15, 2024",
  "time": "10:00 AM",
  "location": "Happy Paws Vet Clinic",
  "appointmentType": "Annual Checkup",
  "email": "user@example.com",
  "channels": ["email"]
}
```

### Medication Reminder

```http
POST /api/notifications/medication-reminder
Authorization: Bearer <token>
Content-Type: application/json

{
  "petName": "Buddy",
  "medicationName": "Heartworm Prevention",
  "dosage": "1 tablet",
  "instructions": "Give with food",
  "email": "user@example.com",
  "channels": ["email"]
}
```

### Health Alert

```http
POST /api/notifications/health-alert
Authorization: Bearer <token>
Content-Type: application/json

{
  "petName": "Buddy",
  "healthScore": 65,
  "alertType": "Low Health Score",
  "details": "Weight has decreased significantly",
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "channels": ["email", "sms"]
}
```

### Test Notification

```http
POST /api/notifications/test
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "user@example.com",
  "phoneNumber": "+1234567890",
  "channel": "email"
}
```

### Get Service Stats

```http
GET /api/notifications/stats
Authorization: Bearer <token>
```

## Frontend Usage

The NotificationCenter component now includes:

1. **Delivery Settings Panel**
   - Enable/disable email notifications
   - Enable/disable SMS notifications
   - Configure email address and phone number
   - Test notification delivery

2. **Send Button on Each Notification**
   - Click the send icon to deliver notification via configured channels
   - Shows loading state while sending

### Example Usage in Code

```javascript
import notificationApiService from '../services/notificationService';

// Send a vaccination reminder
await notificationApiService.sendVaccinationReminder({
  petName: 'Buddy',
  vaccineName: 'Rabies',
  date: 'Dec 15, 2024',
  email: 'user@example.com',
  phoneNumber: '+1234567890'
}, ['email', 'sms']);

// Test notification
await notificationApiService.testNotification(
  'user@example.com',
  '+1234567890',
  'email'
);
```

## Mock Mode

If Twilio or email credentials are not configured, the services will run in **mock mode**:
- Notifications will be logged to the console
- API responses will indicate `mock: true`
- No actual emails or SMS will be sent

This allows development and testing without real credentials.

## Troubleshooting

### Email Not Sending

1. Check EMAIL_HOST and EMAIL_PORT are correct
2. For Gmail, ensure you're using an App Password
3. Check firewall isn't blocking SMTP ports

### SMS Not Sending

1. Verify Twilio credentials are correct
2. Ensure phone number is in E.164 format (+1234567890)
3. Check Twilio account has sufficient balance
4. Verify the "from" number is a valid Twilio number

### Common Errors

- `Invalid credentials`: Check your API keys/passwords
- `Rate limit exceeded`: Wait before sending more notifications
- `Invalid phone number`: Use E.164 format (+country code + number)

## Phase 4 Completion Status

✅ SMS Integration Service - Complete
✅ Email Automation System - Complete
✅ Notification API Routes - Complete
✅ Frontend Integration - Complete
✅ Test Functionality - Complete

**Phase 4 is now 100% complete!**
