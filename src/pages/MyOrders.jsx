import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Mock data - in real app, fetch from MongoDB based on user ID
  const mockAllOrders = [
    {
      id: 'order1',
      productId: '1',
      productName: 'Golden Retriever Puppy',
      buyerName: user?.displayName || 'Test User',
      email: user?.email || 'test@gmail.com',
      quantity: 1,
      price: 0,
      address: '123 Main Street, Dhaka',
      phone: '01712345678',
      date: '2025-12-15',
      additionalNotes: 'Looking forward to adopting this puppy',
      userId: user?.uid || 'user1',
      createdAt: '2025-12-07T10:30:00Z'
    },
    {
      id: 'order2',
      productId: '3',
      productName: 'Interactive Cat Toy',
      buyerName: user?.displayName || 'Test User',
      email: user?.email || 'test@gmail.com',
      quantity: 2,
      price: 800,
      address: '456 Park Avenue, Chattogram',
      phone: '01812345678',
      date: '2025-12-20',
      additionalNotes: 'Please deliver on time',
      userId: user?.uid || 'user1',
      createdAt: '2025-12-06T14:20:00Z'
    },
    {
      id: 'order3',
      productId: '2',
      productName: 'Premium Dog Food',
      buyerName: 'Other User',
      email: 'other@gmail.com',
      quantity: 1,
      price: 2500,
      address: '789 Ocean Drive, Sylhet',
      phone: '01912345678',
      date: '2025-12-18',
      additionalNotes: 'Need express delivery',
      userId: 'otheruser',
      createdAt: '2025-12-05T09:15:00Z'
    }
  ];

  useEffect(() => {
    if (!user) {
      return;
    }

    // Load user's orders
    const loadOrders = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter orders for current user
        const userOrders = mockAllOrders.filter(order => order.userId === user.uid);
        setOrders(userOrders);
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const downloadPDF = async () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    setDownloadingPDF(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('PawMart - My Orders Report', 20, 20);
      
      // Add user info
      doc.setFontSize(12);
      doc.text(`Generated for: ${user?.displayName || 'User'}`, 20, 35);
      doc.text(`Email: ${user?.email}`, 20, 45);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 55);
      doc.text(`Total Orders: ${orders.length}`, 20, 65);
      
      // Add some spacing
      let yPosition = 80;
      
      // Table data
      const tableData = orders.map((order, index) => [
        (index + 1).toString(),
        order.productName,
        order.quantity.toString(),
        order.price === 0 ? 'Free' : `৳${order.price}`,
        order.address,
        new Date(order.date).toLocaleDateString(),
        order.phone
      ]);
      
      // Add table using autoTable
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: yPosition,
          head: [['#', 'Product/Listing Name', 'Qty', 'Price', 'Address', 'Date', 'Phone']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [255, 183, 77] }, // warm color
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 15 }, // #
            1: { cellWidth: 40 }, // Product name
            2: { cellWidth: 15 }, // Qty
            3: { cellWidth: 25 }, // Price
            4: { cellWidth: 50 }, // Address
            5: { cellWidth: 25 }, // Date
            6: { cellWidth: 30 }  // Phone
          }
        });
      } else {
        // Fallback if autoTable is not available
        doc.setFontSize(10);
        doc.text('Order Details:', 20, yPosition);
        yPosition += 10;
        
        orders.forEach((order, index) => {
          doc.text(`${index + 1}. ${order.productName} - ${order.quantity} x ${order.price === 0 ? 'Free' : `৳${order.price}`}`, 20, yPosition);
          doc.text(`   Address: ${order.address}`, 25, yPosition + 5);
          doc.text(`   Date: ${new Date(order.date).toLocaleDateString()} | Phone: ${order.phone}`, 25, yPosition + 10);
          yPosition += 20;
        });
      }
      
      // Save the PDF
      doc.save(`pawmart-orders-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('Order report downloaded successfully!');
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders.</p>
          <Link to="/login" className="btn-primary-warm">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">
                View and manage your adoption requests and supply orders
              </p>
            </div>
            
            {orders.length > 0 && (
              <button
                onClick={downloadPDF}
                disabled={downloadingPDF}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center disabled:opacity-50"
              >
                {downloadingPDF ? (
                  <>
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Report
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't placed any adoption requests or supply orders yet. 
              Start by browsing our available pets and supplies!
            </p>
            <Link 
              to="/pets-supplies"
              className="btn-primary-warm inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Pets & Supplies
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product/Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buyer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      {/* Product/Listing */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.productName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Order ID: {order.id}
                        </div>
                      </td>
                      
                      {/* Buyer Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.buyerName}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.price === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          <span className="font-medium">৳{order.price}</span>
                        )}
                      </td>
                      
                      {/* Quantity */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.quantity}
                      </td>
                      
                      {/* Address */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {order.address}
                        </div>
                      </td>
                      
                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      
                      {/* Phone */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.phone}
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;