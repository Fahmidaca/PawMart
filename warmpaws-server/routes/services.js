import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock data for services (in real app, this would come from MongoDB)
const mockServices = [
  {
    serviceId: 1,
    serviceName: "Winter Coat Fitting for Dogs",
    providerName: "PawCare Studio",
    providerEmail: "info@pawcare.com",
    price: 25,
    rating: 4.9,
    slotsAvailable: 4,
    description: "Custom coat fitting and warm outfit options to keep your dog comfortable in the cold.",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Clothing"
  },
  {
    serviceId: 2,
    serviceName: "Winter Grooming & Paw Treatment",
    providerName: "CozyPets Grooming",
    providerEmail: "hello@cozypets.com",
    price: 30,
    rating: 4.8,
    slotsAvailable: 3,
    description: "Professional grooming with moisturizing paw balm and winter-safe shampoo.",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Grooming"
  },
  {
    serviceId: 3,
    serviceName: "Heated Pet Bed Rental",
    providerName: "WarmPaws Rentals",
    providerEmail: "rentals@warmpaws.com",
    price: 15,
    rating: 4.7,
    slotsAvailable: 8,
    description: "Rental service for heated pet beds during cold nights. Perfect for arthritic pets.",
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Equipment"
  },
  {
    serviceId: 4,
    serviceName: "Winter Pet Walking Service",
    providerName: "SnowPaws Walkers",
    providerEmail: "walk@snowpaws.com",
    price: 20,
    rating: 4.6,
    slotsAvailable: 5,
    description: "Safe winter walks with proper gear and heated rest stops for your furry friends.",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Walking"
  },
  {
    serviceId: 5,
    serviceName: "Emergency Winter Pet Care",
    providerName: "Winter Emergency Vet",
    providerEmail: "emergency@wintervet.com",
    price: 50,
    rating: 4.9,
    slotsAvailable: 2,
    description: "24/7 emergency care for hypothermia, frostbite, and winter-related pet emergencies.",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Medical"
  },
  {
    serviceId: 6,
    serviceName: "Indoor Exercise & Play Sessions",
    providerName: "Cozy Indoor Play",
    providerEmail: "play@cozyindoor.com",
    price: 18,
    rating: 4.5,
    slotsAvailable: 6,
    description: "Indoor play sessions to keep pets active when it's too cold to go outside.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Exercise"
  },
  {
    serviceId: 7,
    serviceName: "Winter Nutrition Consultation",
    providerName: "Dr. Sarah's Pet Nutrition",
    providerEmail: "nutrition@drsarah.com",
    price: 35,
    rating: 4.8,
    slotsAvailable: 3,
    description: "Specialized nutrition advice for winter months to keep pets healthy and warm.",
    image: "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Nutrition"
  },
  {
    serviceId: 8,
    serviceName: "Pet Photography in Winter Setting",
    providerName: "Snowy Paws Photography",
    providerEmail: "photo@snowypaws.com",
    price: 40,
    rating: 4.9,
    slotsAvailable: 4,
    description: "Professional winter-themed pet photoshoots with cozy props and outfits.",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Photography"
  }
];

// GET /api/services - Get all services
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockServices,
      count: mockServices.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message
    });
  }
});

// GET /api/services/:id - Get service by ID
router.get('/:id', (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const service = mockServices.find(s => s.serviceId === serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
});

// POST /api/services - Create new service (protected route)
router.post('/', (req, res) => {
  try {
    const { serviceName, providerName, providerEmail, price, description, image, category } = req.body;
    
    if (!serviceName || !providerName || !providerEmail || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const newService = {
      serviceId: mockServices.length + 1,
      serviceName,
      providerName,
      providerEmail,
      price,
      rating: 5.0,
      slotsAvailable: 10,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: category || 'General'
    };
    
    mockServices.push(newService);
    
    res.status(201).json({
      success: true,
      data: newService,
      message: 'Service created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
});

// PUT /api/services/:id - Update service
router.put('/:id', (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const serviceIndex = mockServices.findIndex(s => s.serviceId === serviceId);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Update service (partial update)
    const updatedService = { ...mockServices[serviceIndex], ...req.body };
    mockServices[serviceIndex] = updatedService;
    
    res.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
});

// DELETE /api/services/:id - Delete service
router.delete('/:id', (req, res) => {
  try {
    const serviceId = parseInt(req.params.id);
    const serviceIndex = mockServices.findIndex(s => s.serviceId === serviceId);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const deletedService = mockServices.splice(serviceIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedService,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
});

export default router;