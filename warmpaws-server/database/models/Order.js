import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  buyerPhone: {
    type: String,
    trim: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['service', 'listing', 'adoption']
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bkash', 'nagad', 'rocket', 'bank_transfer'],
    default: 'cash'
  },
  shippingAddress: {
    type: String,
    trim: true
  },
  billingAddress: {
    type: String,
    trim: true
  },
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String,
    trim: true
  },
  specialInstructions: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    const orderNumber = `WP${Date.now()}${String(count + 1).padStart(4, '0')}`;
    this.orderNumber = orderNumber;
  }
  next();
});

// Calculate total price
orderSchema.pre('save', function(next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ buyerId: 1 });
orderSchema.index({ providerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ productType: 1, productId: 1 });

export default mongoose.model('Order', orderSchema);