import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import models
import User from '../models/User.js';
import Service from '../models/Service.js';
import Listing from '../models/Listing.js';
import Order from '../models/Order.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/warmpaws');
    console.log('📊 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Listing.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: 'admin@warmpaws.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      isVerified: true
    });
    await adminUser.save();
    console.log('✅ Created admin user');

    // Create service provider user
    const providerUser = new User({
      email: 'provider@warmpaws.com',
      password: 'provider123',
      name: 'Service Provider',
      role: 'service_provider',
      isVerified: true
    });
    await providerUser.save();
    console.log('✅ Created service provider user');

    // Create regular users
    const regularUsers = [];
    for (let i = 1; i <= 5; i++) {
      const user = new User({
        email: `user${i}@warmpaws.com`,
        password: 'user123',
        name: `User ${i}`,
        role: 'user',
        isVerified: true
      });
      await user.save();
      regularUsers.push(user);
    }
    console.log('✅ Created regular users');

    // Sample services
    const services = [
      {
        serviceName: "Winter Coat Fitting for Dogs",
        providerName: "PawCare Studio",
        providerEmail: "info@pawcare.com",
        providerId: providerUser._id,
        price: 25,
        rating: 4.9,
        reviewCount: 45,
        slotsAvailable: 4,
        description: "Custom coat fitting and warm outfit options to keep your dog comfortable in the cold.",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "Clothing",
        location: "Dhaka",
        duration: "1 hour",
        tags: ["winter", "clothing", "coat", "fitting"],
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        availableTimeSlots: [
          { start: "09:00", end: "12:00" },
          { start: "14:00", end: "17:00" }
        ]
      },
      {
        serviceName: "Winter Grooming & Paw Treatment",
        providerName: "CozyPets Grooming",
        providerEmail: "hello@cozypets.com",
        providerId: providerUser._id,
        price: 30,
        rating: 4.8,
        reviewCount: 32,
        slotsAvailable: 3,
        description: "Professional grooming with moisturizing paw balm and winter-safe shampoo.",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "Grooming",
        location: "Chattogram",
        duration: "2 hours",
        tags: ["grooming", "winter", "paw treatment", "shampoo"],
        availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        availableTimeSlots: [
          { start: "10:00", end: "13:00" },
          { start: "15:00", end: "18:00" }
        ]
      },
      {
        serviceName: "Heated Pet Bed Rental",
        providerName: "WarmPaws Rentals",
        providerEmail: "rentals@warmpaws.com",
        providerId: providerUser._id,
        price: 15,
        rating: 4.7,
        reviewCount: 28,
        slotsAvailable: 8,
        description: "Rental service for heated pet beds during cold nights. Perfect for arthritic pets.",
        image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "Equipment",
        location: "Sylhet",
        duration: "24 hours",
        tags: ["rental", "heated bed", "equipment", "winter"],
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        availableTimeSlots: [
          { start: "08:00", end: "20:00" }
        ]
      },
      {
        serviceName: "Winter Pet Walking Service",
        providerName: "SnowPaws Walkers",
        providerEmail: "walk@snowpaws.com",
        providerId: providerUser._id,
        price: 20,
        rating: 4.6,
        reviewCount: 51,
        slotsAvailable: 5,
        description: "Safe winter walks with proper gear and heated rest stops for your furry friends.",
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "Walking",
        location: "Rajshahi",
        duration: "1 hour",
        tags: ["walking", "winter", "exercise", "outdoor"],
        availableDays: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"],
        availableTimeSlots: [
          { start: "07:00", end: "09:00" },
          { start: "16:00", end: "18:00" }
        ]
      },
      {
        serviceName: "Emergency Winter Pet Care",
        providerName: "Winter Emergency Vet",
        providerEmail: "emergency@wintervet.com",
        providerId: providerUser._id,
        price: 50,
        rating: 4.9,
        reviewCount: 15,
        slotsAvailable: 2,
        description: "24/7 emergency care for hypothermia, frostbite, and winter-related pet emergencies.",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "Medical",
        location: "Khulna",
        duration: "Varies",
        tags: ["emergency", "medical", "24/7", "winter"],
        availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        availableTimeSlots: [
          { start: "00:00", end: "23:59" }
        ]
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log('✅ Created sample services');

    // Sample listings
    const listings = [
      {
        name: 'Golden Retriever Puppy',
        category: 'Pets',
        price: 0,
        location: 'Dhaka',
        description: 'Friendly 2-month-old puppy available for adoption. This adorable Golden Retriever puppy is looking for a loving home. He is vaccinated, dewormed, and ready to join your family. Perfect with children and other pets.',
        primaryImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        ownerId: regularUsers[0]._id,
        ownerName: 'Mr. Rahman',
        ownerEmail: 'owner1@gmail.com',
        ownerPhone: '+8801712345678',
        age: '2 months',
        breed: 'Golden Retriever',
        gender: 'Male',
        vaccinated: true,
        weight: '3kg',
        size: 'Medium',
        color: 'Golden',
        tags: ['puppy', 'golden retriever', 'adoption', 'vaccinated']
      },
      {
        name: 'Premium Dog Food',
        category: 'Food',
        price: 2500,
        location: 'Chattogram',
        description: 'High-quality dry dog food for adult dogs. Made with premium ingredients including real chicken and brown rice. Rich in protein and essential nutrients to keep your dog healthy and energetic.',
        primaryImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        ownerId: regularUsers[1]._id,
        ownerName: 'Pet Store Pro',
        ownerEmail: 'shop1@gmail.com',
        ownerPhone: '+8801812345678',
        condition: 'New',
        specifications: {
          weight: '5kg',
          brand: 'Premium Pet',
          flavor: 'Chicken & Rice',
          age: 'Adult'
        },
        tags: ['dog food', 'premium', 'dry food', 'chicken']
      },
      {
        name: 'Interactive Cat Toy',
        category: 'Accessories',
        price: 800,
        location: 'Sylhet',
        description: 'Fun interactive toy for cats to play with. Features LED lights and moving parts to keep your feline friend entertained for hours. Made with safe, non-toxic materials.',
        primaryImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        ownerId: regularUsers[2]._id,
        ownerName: 'Cat Lover Shop',
        ownerEmail: 'shop2@gmail.com',
        ownerPhone: '+8801912345678',
        condition: 'Like New',
        specifications: {
          material: 'Plastic',
          color: 'Multicolor',
          battery: 'Included'
        },
        tags: ['cat toy', 'interactive', 'LED', 'entertainment']
      },
      {
        name: 'Pet Shampoo',
        category: 'Care Products',
        price: 450,
        location: 'Dhaka',
        description: 'Gentle shampoo for sensitive pet skin. Hypoallergenic formula with natural ingredients. Perfect for pets with allergies or sensitive skin conditions.',
        primaryImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        ownerId: regularUsers[3]._id,
        ownerName: 'Pet Care Center',
        ownerEmail: 'shop3@gmail.com',
        ownerPhone: '+8801712345679',
        condition: 'New',
        specifications: {
          volume: '500ml',
          type: 'Hypoallergenic',
          ingredients: 'Natural'
        },
        tags: ['shampoo', 'hypoallergenic', 'sensitive skin', 'natural']
      },
      {
        name: 'Persian Cat',
        category: 'Pets',
        price: 0,
        location: 'Rajshahi',
        description: 'Beautiful Persian cat looking for a loving home. 3 years old, fully vaccinated and spayed. Very calm and gentle personality, perfect for apartment living.',
        primaryImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        ownerId: regularUsers[4]._id,
        ownerName: 'Ms. Khan',
        ownerEmail: 'owner2@gmail.com',
        ownerPhone: '+8801712345680',
        age: '3 years',
        breed: 'Persian',
        gender: 'Female',
        vaccinated: true,
        weight: '4kg',
        size: 'Small',
        color: 'White',
        tags: ['persian cat', 'adoption', 'vaccinated', 'calm']
      }
    ];

    const createdListings = await Listing.insertMany(listings);
    console.log('✅ Created sample listings');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@warmpaws.com / admin123');
    console.log('Provider: provider@warmpaws.com / provider123');
    console.log('Users: user1@warmpaws.com to user5@warmpaws.com / user123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

// Run the seeder
seedDatabase();