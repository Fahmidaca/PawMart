import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Pets', 'Food', 'Accessories', 'Care Products', 'Toys', 'Beds', 'Clothing', 'Health Products']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  primaryImage: {
    type: String,
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  ownerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  ownerPhone: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSold: {
    type: Boolean,
    default: false
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'New'
  },
  age: {
    type: String, // For pets: "2 months", "3 years"
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown']
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  weight: {
    type: String, // e.g., "5kg"
    trim: true
  },
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  color: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Map,
    of: String
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inquiries: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    responded: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for search and filtering
listingSchema.index({ name: 'text', description: 'text', category: 'text', location: 'text' });
listingSchema.index({ category: 1 });
listingSchema.index({ location: 1 });
listingSchema.index({ ownerId: 1 });
listingSchema.index({ isActive: 1, isSold: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ createdAt: -1 });

export default mongoose.model('Listing', listingSchema);