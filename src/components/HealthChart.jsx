import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Calendar, Activity, Target } from 'lucide-react';
import { format, subMonths, eachMonthOfInterval } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HealthChart = ({ analytics, healthRecords }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [activeChart, setActiveChart] = useState('overview');

  // Generate monthly data for the selected time range
  const generateMonthlyData = () => {
    const now = new Date();
    const months = selectedTimeRange === '1year' ? 12 : 6;
    const startDate = subMonths(now, months - 1);
    
    const monthLabels = eachMonthOfInterval({
      start: startDate,
      end: now
    }).map(date => format(date, 'MMM yyyy'));

    // Process health records by month
    const monthlyData = eachMonthOfInterval({
      start: startDate,
      end: now
    }).map(date => {
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthRecords = healthRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });

      return {
        vaccinations: monthRecords.filter(r => r.type === 'vaccination').length,
        checkups: monthRecords.filter(r => r.type === 'checkup').length,
        illnesses: monthRecords.filter(r => r.type === 'illness').length,
        medications: monthRecords.filter(r => r.type === 'medication').length
      };
    });

    return { monthLabels, monthlyData };
  };

  const { monthLabels, monthlyData } = generateMonthlyData();

  // Health Trend Chart Data
  const healthTrendData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Vaccinations',
        data: monthlyData.map(data => data.vaccinations),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Checkups',
        data: monthlyData.map(data => data.checkups),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Illnesses',
        data: monthlyData.map(data => data.illnesses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  // Health Record Distribution Chart
  const recordDistributionData = {
    labels: ['Vaccinations', 'Checkups', 'Illnesses', 'Medications'],
    datasets: [
      {
        data: [
          healthRecords.filter(r => r.type === 'vaccination').length,
          healthRecords.filter(r => r.type === 'checkup').length,
          healthRecords.filter(r => r.type === 'illness').length,
          healthRecords.filter(r => r.type === 'medication').length,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Monthly Activity Chart
  const monthlyActivityData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Health Activities',
        data: monthlyData.map(data => 
          data.vaccinations + data.checkups + data.illnesses + data.medications
        ),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
        borderRadius: 4,
      },
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
          beginAtZero: true,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          color: '#374151',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    },
    cutout: '60%',
  };

  const getHealthInsight = () => {
    const recentRecords = healthRecords.filter(record => {
      const recordDate = new Date(record.date);
      const threeMonthsAgo = subMonths(new Date(), 3);
      return recordDate >= threeMonthsAgo;
    });

    const recentVaccinations = recentRecords.filter(r => r.type === 'vaccination').length;
    const recentCheckups = recentRecords.filter(r => r.type === 'checkup').length;
    const recentIllnesses = recentRecords.filter(r => r.type === 'illness').length;

    if (recentIllnesses > recentVaccinations) {
      return {
        type: 'warning',
        message: 'Consider scheduling more preventive care visits',
        icon: TrendingUp,
        color: 'text-yellow-600'
      };
    }

    if (recentVaccinations >= 2 && recentCheckups >= 1) {
      return {
        type: 'good',
        message: 'Great job maintaining regular health care!',
        icon: Target,
        color: 'text-green-600'
      };
    }

    return {
      type: 'normal',
      message: 'Your pet\'s health care is on track',
      icon: Activity,
      color: 'text-blue-600'
    };
  };

  const insight = getHealthInsight();
  const InsightIcon = insight.icon;

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Health Analytics
        </h3>
        <div className="flex space-x-2">
          {['3months', '6months', '1year'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range === '3months' ? '3M' : range === '6months' ? '6M' : '1Y'}
            </button>
          ))}
        </div>
      </div>

      {/* Health Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-white dark:bg-gray-800 ${insight.color}`}>
            <InsightIcon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              Health Insight
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {insight.message}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chart Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'trends', label: 'Health Trends', icon: Activity },
              { id: 'distribution', label: 'Record Distribution', icon: Calendar },
              { id: 'activity', label: 'Monthly Activity', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeChart === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          {activeChart === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Score Gauge */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Health Score
                </h4>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${
                    analytics.healthScore >= 80 ? 'text-green-500' :
                    analytics.healthScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {analytics.healthScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    out of 100
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-4">
                    <div 
                      className={`h-3 rounded-full ${
                        analytics.healthScore >= 80 ? 'bg-green-500' :
                        analytics.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analytics.healthScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Records</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {analytics.totalRecords}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Vaccinations</span>
                    <span className="font-medium text-blue-600">
                      {analytics.vaccinations}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Checkups</span>
                    <span className="font-medium text-green-600">
                      {analytics.checkups}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Illnesses</span>
                    <span className="font-medium text-red-600">
                      {analytics.illnesses}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChart === 'trends' && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Health Trends Over Time
              </h4>
              <div className="h-80">
                <Line data={healthTrendData} options={chartOptions} />
              </div>
            </div>
          )}

          {activeChart === 'distribution' && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Health Record Distribution
              </h4>
              <div className="h-80">
                <Doughnut data={recordDistributionData} options={doughnutOptions} />
              </div>
            </div>
          )}

          {activeChart === 'activity' && (
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Monthly Health Activity
              </h4>
              <div className="h-80">
                <Bar data={monthlyActivityData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Trends Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Health Trends Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.trends.vaccinations.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                Vaccination Trends
              </h5>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {analytics.trends.vaccinations.length} vaccination events recorded
              </p>
            </div>
          )}
          
          {analytics.trends.healthIssues.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h5 className="font-medium text-red-900 dark:text-red-300 mb-2">
                Health Issues
              </h5>
              <p className="text-sm text-red-700 dark:text-red-400">
                {analytics.trends.healthIssues.length} health issues tracked
              </p>
            </div>
          )}
          
          {analytics.trends.medications.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h5 className="font-medium text-green-900 dark:text-green-300 mb-2">
                Medications
              </h5>
              <p className="text-sm text-green-700 dark:text-green-400">
                {analytics.trends.medications.length} medication records
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthChart;