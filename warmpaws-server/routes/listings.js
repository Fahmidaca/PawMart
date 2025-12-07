import express from 'express';

const router = express.Router();

// Mock data for listings (in real app, this would come from MongoDB)
const mockListings = {
  '1': {
    id: '1',
    name: 'Golden Retriever Puppy',
    category: 'Pets',
    price: 0,
    location: 'Dhaka',
    description: 'Friendly 2-month-old puppy available for adoption. This adorable Golden Retriever puppy is looking for a loving home. He is vaccinated, dewormed, and ready to join your family. Perfect with children and other pets.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'owner1@gmail.com',
    date: '2025-12-15',
    ownerName: 'Mr. Rahman'
  },
  '2': {
    id: '2',
    name: 'Premium Dog Food',
    category: 'Food',
    price: 2500,
    location: 'Chattogram',
    description: 'High-quality dry dog food for adult dogs. Made with premium ingredients including real chicken and brown rice. Rich in protein and essential nutrients to keep your dog healthy and energetic.',
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'shop1@gmail.com',
    date: '2025-12-10',
    ownerName: 'Pet Store Pro'
  },
  '3': {
    id: '3',
    name: 'Interactive Cat Toy',
    category: 'Accessories',
    price: 800,
    location: 'Sylhet',
    description: 'Fun interactive toy for cats to play with. Features LED lights and moving parts to keep your feline friend entertained for hours. Made with safe, non-toxic materials.',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'shop2@gmail.com',
    date: '2025-12-12',
    ownerName: 'Cat Lover Shop'
  },
  '4': {
    id: '4',
    name: 'Pet Shampoo',
    category: 'Care Products',
    price: 450,
    location: 'Dhaka',
    description: 'Gentle shampoo for sensitive pet skin. Hypoallergenic formula with natural ingredients. Perfect for pets with allergies or sensitive skin conditions.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'shop3@gmail.com',
    date: '2025-12-08',
    ownerName: 'Pet Care Center'
  },
  '5': {
    id: '5',
    name: 'Persian Cat',
    category: 'Pets',
    price: 0,
    location: 'Rajshahi',
    description: 'Beautiful Persian cat looking for a loving home. 3 years old, fully vaccinated and spayed. Very calm and gentle personality, perfect for apartment living.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'owner2@gmail.com',
    date: '2025-12-20',
    ownerName: 'Ms. Khan'
  },
  '6': {
    id: '6',
    name: 'Dog Leash',
    category: 'Accessories',
    price: 350,
    location: 'Khulna',
    description: 'Durable leash for medium to large dogs. Made with high-quality nylon material. 6 feet length with comfortable handle grip.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    email: 'shop4@gmail.com',
    date: '2025-12-14',
    ownerName: 'Pet Supplies Plus'
  }
};

// GET /api/listings - Get all listings
router.get('/', (req, res) => {
  try {
    const { category, search, location } = req.query;
    let listings = Object.values(mockListings);

    // Filter by category
    if (category && category !== 'All') {
      listings = listings.filter(listing => listing.category === category);
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      listings = listings.filter(listing => 
        listing.name.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by location
    if (location) {
      listings = listings.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: listings,
      count: listings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    });
  }
});

// GET /api/listings/:id - Get listing by ID
router.get('/:id', (req, res) => {
  try {
    const listing = mockListings[req.params.id];
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    res.json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: error.message
    });
  }
});

// POST /api/listings - Create new listing
router.post('/', (req, res) => {
  try {
    const { name, category, price, location, description, image, email, ownerName } = req.body;
    
    if (!name || !category || !location || !description || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const newId = (Math.max(...Object.keys(mockListings).map(id => parseInt(id))) + 1).toString();
    
    const newListing = {
      id: newId,
      name,
      category,
      price: price || 0,
      location,
      description,
      image: image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      email,
      date: new Date().toISOString().split('T')[0],
      ownerName: ownerName || 'Unknown Owner'
    };
    
    mockListings[newId] = newListing;
    
    res.status(201).json({
      success: true,
      data: newListing,
      message: 'Listing created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message
    });
  }
});

// PUT /api/listings/:id - Update listing
router.put('/:id', (req, res) => {
  try {
    const listing = mockListings[req.params.id];
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    // Update listing (partial update)
    const updatedListing = { ...listing, ...req.body };
    mockListings[req.params.id] = updatedListing;
    
    res.json({
      success: true,
      data: updatedListing,
      message: 'Listing updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error.message
    });
  }
});

// DELETE /api/listings/:id - Delete listing
router.delete('/:id', (req, res) => {
  try {
    const listing = mockListings[req.params.id];
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    delete mockListings[req.params.id];
    
    res.json({
      success: true,
      data: listing,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: error.message
    });
  }
});

export default router;