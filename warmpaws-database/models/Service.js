import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  providerName: {
    type: String,
    required: true,
    trim: true
  },
  providerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  slotsAvailable: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Clothing', 'Grooming', 'Equipment', 'Walking', 'Medical', 'Exercise', 'Nutrition', 'Photography', 'General']
  },
  location: {
    type: String,
    trim: true
  },
  duration: {
    type: String, // e.g., "2 hours", "30 minutes"
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  availableDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  availableTimeSlots: [{
    start: String, // e.g., "09:00"
    end: String    // e.g., "17:00"
  }]
}, {
  timestamps: true
});

// Index for search functionality
serviceSchema.index({ serviceName: 'text', description: 'text', category: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ providerId: 1 });
serviceSchema.index({ isActive: 1, isVerified: 1 });

export default mongoose.model('Service', serviceSchema);