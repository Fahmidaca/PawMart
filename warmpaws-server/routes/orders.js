import express from 'express';

const router = express.Router();

// Mock data for orders (in real app, this would come from MongoDB)
const mockOrders = [];

// GET /api/orders - Get all orders (with optional user filter)
router.get('/', (req, res) => {
  try {
    const { userId, status } = req.query;
    let orders = [...mockOrders];

    // Filter by user ID if provided
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }

    // Filter by status if provided
    if (status) {
      orders = orders.filter(order => order.status === status);
    }

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = mockOrders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// POST /api/orders - Create new order
router.post('/', (req, res) => {
  try {
    const { 
      buyerName, 
      email, 
      productId, 
      productName, 
      quantity, 
      price, 
      address, 
      phone, 
      additionalNotes,
      userId 
    } = req.body;
    
    if (!buyerName || !email || !productId || !productName || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buyerName,
      email,
      productId,
      productName,
      quantity: quantity || 1,
      price: price || 0,
      address,
      phone,
      additionalNotes: additionalNotes || '',
      userId: userId || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// PUT /api/orders/:id - Update order status
router.put('/:id', (req, res) => {
  try {
    const orderIndex = mockOrders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order (partial update)
    const updatedOrder = { 
      ...mockOrders[orderIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    mockOrders[orderIndex] = updatedOrder;
    
    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', (req, res) => {
  try {
    const orderIndex = mockOrders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    const deletedOrder = mockOrders.splice(orderIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
});

export default router;