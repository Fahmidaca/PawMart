import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, Plus, Target, AlertCircle, Calendar } from 'lucide-react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const WeightTrackingChart = ({ pet, weightRecords = [], onAddWeight }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');
  const [formData, setFormData] = useState({
    weight: '',
    unit: pet?.weightUnit || 'kg',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Generate mock weight data if no records exist
  const generateMockData = () => {
    if (weightRecords.length === 0 && pet) {
      const mockData = [];
      const endDate = new Date();
      const startDate = subMonths(endDate, 6);
      let currentWeight = 5 + Math.random() * 5; // Starting weight between 5-10kg

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Simulate gradual weight gain
        currentWeight += (Math.random() - 0.4) * 0.5; // Slight upward trend with variation
        
        mockData.push({
          date: new Date(currentDate),
          weight: Math.round(currentWeight * 10) / 10,
          unit: 'kg'
        });
        
        // Add entry every 2 weeks
        currentDate = subDays(currentDate, -14);
      }

      return mockData;
    }
    return weightRecords;
  };

  const processedWeightData = generateMockData();

  // Filter data by time range
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate;
    
    switch (timeRange) {
      case '1month':
        cutoffDate = subMonths(now, 1);
        break;
      case '3months':
        cutoffDate = subMonths(now, 3);
        break;
      case '6months':
        cutoffDate = subMonths(now, 6);
        break;
      case '1year':
        cutoffDate = subMonths(now, 12);
        break;
      default:
        cutoffDate = subMonths(now, 6);
    }

    return processedWeightData.filter(entry => entry.date >= cutoffDate);
  };

  const filteredData = getFilteredData();

  // Calculate weight trends
  const calculateTrends = () => {
    if (filteredData.length < 2) return null;

    const latest = filteredData[filteredData.length - 1];
    const previous = filteredData[filteredData.length - 2];
    const oldest = filteredData[0];

    const change = latest.weight - previous.weight;
    const totalChange = latest.weight - oldest.weight;
    const daysDiff = Math.ceil((latest.date - oldest.date) / (1000 * 60 * 60 * 24));

    return {
      recent: change,
      total: totalChange,
      dailyRate: totalChange / daysDiff
    };
  };

  const trends = calculateTrends();

  // Chart data
  const chartData = {
    labels: filteredData.map(entry => format(entry.date, 'MMM dd')),
    datasets: [
      {
        label: `Weight (${pet?.weightUnit || 'kg'})`,
        data: filteredData.map(entry => entry.weight),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      // Target weight line (if available)
      ...(pet?.targetWeight ? [{
        label: 'Target Weight',
        data: filteredData.map(() => pet.targetWeight),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 2,
      }] : [])
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} ${pet?.weightUnit || 'kg'}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          callback: function(value) {
            return value + ' ' + (pet?.weightUnit || 'kg');
          }
        },
        beginAtZero: false,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const weightData = {
        date: new Date(formData.date),
        weight: parseFloat(formData.weight),
        unit: formData.unit,
        notes: formData.notes
      };

      await onAddWeight(weightData);
      toast.success('Weight record added successfully!');
      setShowAddForm(false);
      setFormData({
        weight: '',
        unit: pet?.weightUnit || 'kg',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to add weight record');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getWeightStatus = () => {
    if (!trends) return { color: 'text-gray-500', icon: Calendar, message: 'Not enough data' };

    const recentChange = trends.recent;
    if (recentChange > 0.5) {
      return { color: 'text-green-600', icon: TrendingUp, message: 'Weight increasing' };
    } else if (recentChange < -0.5) {
      return { color: 'text-red-600', icon: TrendingUp, message: 'Weight decreasing' };
    }
    return { color: 'text-blue-600', icon: Target, message: 'Stable weight' };
  };

  const weightStatus = getWeightStatus();
  const StatusIcon = weightStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weight Tracking
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor {pet?.name}'s weight over time
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Weight
        </button>
      </div>

      {/* Weight Status */}
      {trends && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-white dark:bg-gray-800 ${weightStatus.color}`}>
                <StatusIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Weight Trend
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {weightStatus.message}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recent Change
              </p>
              <p className={`font-semibold ${weightStatus.color}`}>
                {trends.recent > 0 ? '+' : ''}{trends.recent.toFixed(1)} {pet?.weightUnit || 'kg'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Weight History
          </h4>
          <div className="flex space-x-2">
            {['1month', '3months', '6months', '1year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {range === '1month' ? '1M' : range === '3months' ? '3M' : range === '6months' ? '6M' : '1Y'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Add Weight Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Weight Record
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter weight"
                    required
                  />
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Any additional notes"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Weight'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default WeightTrackingChart;