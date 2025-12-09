import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Mock orders data for PawMart - adoption requests and product orders
  const mockOrders = [
    {
      id: '1',
      productId: 'list1',
      productName: 'Golden Retriever Puppy',
      buyerName: user?.displayName || 'Sarah Ahmed',
      email: user?.email || 'sarah@gmail.com',
      quantity: 1,
      price: 0,
      address: '123 Gulshan, Dhaka',
      phone: '01712345678',
      date: '2025-12-10',
      additionalNotes: 'Looking forward to giving this puppy a loving home. I have a backyard and am home most of the time.',
      category: 'Pets',
      status: 'Pending',
      orderType: 'Adoption'
    },
    {
      id: '2',
      productId: 'list2',
      productName: 'Premium Dog Food (5kg)',
      buyerName: user?.displayName || 'Rahman Family',
      email: user?.email || 'rahman@gmail.com',
      quantity: 2,
      price: 2500,
      address: '456 Agrabad, Chattogram',
      phone: '01876543210',
      date: '2025-12-08',
      additionalNotes: 'Please deliver on weekends only.',
      category: 'Food',
      status: 'Completed',
      orderType: 'Purchase'
    },
    {
      id: '3',
      productId: 'list3',
      productName: 'Persian Cat',
      buyerName: user?.displayName || 'Dr. Fatema',
      email: user?.email || 'fatema@gmail.com',
      quantity: 1,
      price: 0,
      address: '789 Sylhet Sadar, Sylhet',
      phone: '01987654321',
      date: '2025-12-05',
      additionalNotes: 'I have experience with cats and can provide proper care.',
      category: 'Pets',
      status: 'Approved',
      orderType: 'Adoption'
    },
    {
      id: '4',
      productId: 'list4',
      productName: 'Interactive Cat Toy',
      buyerName: user?.displayName || 'Karim',
      email: user?.email || 'karim@gmail.com',
      quantity: 1,
      price: 800,
      address: '321 Khulna Sadar, Khulna',
      phone: '01567891234',
      date: '2025-12-03',
      additionalNotes: '',
      category: 'Accessories',
      status: 'Shipped',
      orderType: 'Purchase'
    },
    {
      id: '5',
      productId: 'list5',
      productName: 'Pet Shampoo',
      buyerName: user?.displayName || 'Lisa',
      email: user?.email || 'lisa@gmail.com',
      quantity: 3,
      price: 450,
      address: '654 Rajshahi, Rajshahi',
      phone: '01798765432',
      date: '2025-12-01',
      additionalNotes: 'Need sensitive formula for my puppy.',
      category: 'Care Products',
      status: 'Delivered',
      orderType: 'Purchase'
    }
  ];

  useEffect(() => {
    // Simulate loading orders
    const loadOrders = async () => {
      try {
        // In real app, this would be an API call
        // const response = await fetch(`/api/orders/${user.uid}`);
        // const data = await response.json();
        
        // For demo, use mock data
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Pending': 'badge-warning',
      'Approved': 'badge-success',
      'Completed': 'badge-success',
      'Shipped': 'badge-info',
      'Delivered': 'badge-success',
      'Cancelled': 'badge-error',
      'Rejected': 'badge-error'
    };
    
    return (
      <span className={`badge ${statusStyles[status] || 'badge-info'} badge-sm`}>
        {status}
      </span>
    );
  };

  const getTotalSpent = () => {
    return orders.reduce((total, order) => total + (order.price * order.quantity), 0);
  };

  const getOrderTypeBadge = (orderType) => {
    return (
      <span className={`badge badge-sm ${orderType === 'Adoption' ? 'badge-success' : 'badge-info'}`}>
        {orderType}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryStyles = {
      'Pets': 'bg-green-100 text-green-800',
      'Food': 'bg-yellow-100 text-yellow-800',
      'Accessories': 'bg-blue-100 text-blue-800',
      'Care Products': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyles[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
  };

  // Generate PDF Report for Orders
  const generateOrdersPDF = () => {
    if (orders.length === 0) {
      toast.error('No orders to generate report');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(24);
      doc.setTextColor(241, 118, 26); // PawMart orange
      doc.text('PawMart', 20, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Orders Report', 20, 32);
      
      // User Info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated for: ${user?.displayName || user?.email}`, 20, 42);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 48);
      
      // Summary
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(`Total Orders: ${orders.length}`, 20, 60);
      doc.text(`Total Spent: ৳${getTotalSpent()}`, 20, 68);
      
      // Orders Table
      const tableData = orders.map(order => [
        order.productName,
        order.category,
        order.quantity.toString(),
        order.price === 0 ? 'Free' : `৳${order.price * order.quantity}`,
        order.address,
        new Date(order.date).toLocaleDateString(),
        order.phone
      ]);
      
      autoTable(doc, {
        head: [['Product', 'Category', 'Qty', 'Amount', 'Address', 'Date', 'Phone']],
        body: tableData,
        startY: 80,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [241, 118, 26],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { left: 10, right: 10 }
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `PawMart Orders Report - Page ${i} of ${pageCount}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      const fileName = `PawMart_Orders_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('Orders report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please login to view your orders
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="loading loading-spinner loading-lg text-warm-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Orders
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            View and manage all your adoption requests and product orders
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">৳{getTotalSpent()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Adoptions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter(order => order.orderType === 'Adoption').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Purchases</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {orders.filter(order => order.orderType === 'Purchase').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Report Generator */}
        <div className="mb-8">
          <button
            onClick={generateOrdersPDF}
            disabled={isGeneratingPDF || orders.length === 0}
            className="bg-warm-600 hover:bg-warm-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report (PDF)
              </>
            )}
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't placed any adoption requests or product orders yet. Start exploring our listings!
            </p>
            <Link 
              to="/pets-supplies"
              className="btn-primary-warm inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order & Adoption History
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product/Listing
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.productName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Buyer: {order.buyerName}
                          </div>
                          {order.additionalNotes && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              Note: {order.additionalNotes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(order.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getOrderTypeBadge(order.orderType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {order.price === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `৳${order.price * order.quantity}`
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {order.address}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
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