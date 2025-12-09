import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  Calendar,
  Clock,
  Target,
  Activity,
  Utensils,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Share2
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

const PersonalizedCarePlan = ({ pet }) => {
  const [carePlan, setCarePlan] = useState({
    id: '1',
    petName: pet?.name || 'Max',
    createdDate: new Date(),
    lastUpdated: new Date(),
    goals: [],
    dailyTasks: [],
    weeklyTasks: [],
    monthlyTasks: [],
    milestones: [],
    notes: ''
  });

  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    frequency: 'daily',
    category: 'health',
    priority: 'medium'
  });

  // Mock data for demonstration
  const mockCarePlan = {
    id: '1',
    petName: pet?.name || 'Max',
    createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(),
    goals: [
      {
        id: '1',
        title: 'Weight Management',
        description: 'Help Max reach ideal weight of 25kg',
        targetValue: 25,
        currentValue: 28,
        unit: 'kg',
        deadline: addMonths(new Date(), 3),
        progress: 65,
        category: 'weight'
      },
      {
        id: '2',
        title: 'Improve Socialization',
        description: 'Increase confidence around other dogs',
        targetValue: 10,
        currentValue: 6,
        unit: 'social interactions per week',
        deadline: addWeeks(new Date(), 8),
        progress: 60,
        category: 'behavior'
      },
      {
        id: '3',
        title: 'Dental Health',
        description: 'Establish regular dental cleaning routine',
        targetValue: 2,
        currentValue: 1,
        unit: 'cleanings per month',
        deadline: addMonths(new Date(), 2),
        progress: 50,
        category: 'health'
      }
    ],
    dailyTasks: [
      {
        id: '1',
        title: 'Morning Walk',
        description: '30-minute brisk walk around the neighborhood',
        time: '07:00',
        category: 'exercise',
        priority: 'high',
        completed: false
      },
      {
        id: '2',
        title: 'Medication',
        description: 'Give joint supplement with breakfast',
        time: '08:00',
        category: 'health',
        priority: 'high',
        completed: true
      },
      {
        id: '3',
        title: 'Evening Play',
        description: 'Interactive play session for 20 minutes',
        time: '18:00',
        category: 'exercise',
        priority: 'medium',
        completed: false
      }
    ],
    weeklyTasks: [
      {
        id: '1',
        title: 'Weight Check',
        description: 'Weigh Max and record in health journal',
        day: 'Monday',
        category: 'health',
        priority: 'medium',
        completed: false
      },
      {
        id: '2',
        title: 'Socialization Practice',
        description: 'Visit dog park or arrange playdate',
        day: 'Saturday',
        category: 'behavior',
        priority: 'high',
        completed: false
      }
    ],
    monthlyTasks: [
      {
        id: '1',
        title: 'Vet Checkup',
        description: 'Monthly health examination',
        date: addDays(new Date(), 5),
        category: 'health',
        priority: 'high',
        completed: false
      },
      {
        id: '2',
        title: 'Grooming Session',
        description: 'Full grooming and nail trim',
        date: addDays(new Date(), 10),
        category: 'grooming',
        priority: 'medium',
        completed: false
      }
    ],
    milestones: [
      {
        id: '1',
        title: 'First Month Complete',
        description: 'Consistently followed care plan for 30 days',
        achieved: true,
        achievedDate: addDays(new Date(), -5),
        points: 100
      },
      {
        id: '2',
        title: 'Weight Loss Goal',
        description: 'Lost 2kg towards target weight',
        achieved: false,
        points: 200
      }
    ],
    notes: 'Max has been responding well to the new exercise routine. Showing more energy and enthusiasm during walks.'
  };

  useEffect(() => {
    setCarePlan(mockCarePlan);
  }, [pet]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'exercise': return Activity;
      case 'health': return Stethoscope;
      case 'nutrition': return Utensils;
      case 'behavior': return Heart;
      case 'grooming': return Target;
      default: return CheckCircle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGoalColor = (category) => {
    switch (category) {
      case 'weight': return 'from-blue-500 to-blue-600';
      case 'behavior': return 'from-purple-500 to-purple-600';
      case 'health': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setCarePlan(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const addNewTask = () => {
    if (!newTask.title) return;

    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      time: newTask.frequency === 'daily' ? '09:00' : undefined
    };

    setCarePlan(prev => ({
      ...prev,
      [newTask.frequency === 'daily' ? 'dailyTasks' : 
        newTask.frequency === 'weekly' ? 'weeklyTasks' : 'monthlyTasks']: [
        ...prev[newTask.frequency === 'daily' ? 'dailyTasks' : 
               newTask.frequency === 'weekly' ? 'weeklyTasks' : 'monthlyTasks'],
        task
      ]
    }));

    setNewTask({
      title: '',
      description: '',
      frequency: 'daily',
      category: 'health',
      priority: 'medium'
    });
    setShowAddTask(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Heart className="h-6 w-6 text-pink-500" />
          Personalized Care Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customized care plan for {carePlan.petName}'s health and happiness
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{carePlan.goals.length}</div>
          <div className="text-sm opacity-90">Active Goals</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {carePlan.dailyTasks.filter(t => t.completed).length}/{carePlan.dailyTasks.length}
          </div>
          <div className="text-sm opacity-90">Daily Tasks</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {carePlan.milestones.filter(m => m.achieved).length}
          </div>
          <div className="text-sm opacity-90">Milestones</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">
            {Math.round(carePlan.goals.reduce((acc, goal) => acc + goal.progress, 0) / carePlan.goals.length) || 0}%
          </div>
          <div className="text-sm opacity-90">Overall Progress</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'goals', label: 'Goals', icon: CheckCircle },
              { id: 'tasks', label: 'Tasks', icon: Clock },
              { id: 'schedule', label: 'Schedule', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goals Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Health Goals
                  </h3>
                  <div className="space-y-3">
                    {carePlan.goals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {goal.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                          <div
                            className={`bg-gradient-to-r ${getGoalColor(goal.category)} h-2 rounded-full`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Today's Tasks
                  </h3>
                  <div className="space-y-3">
                    {carePlan.dailyTasks.map((task) => {
                      const Icon = getCategoryIcon(task.category);
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              task.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {task.completed && <CheckCircle className="h-3 w-3" />}
                          </button>
                          <Icon className="h-5 w-5 text-gray-400" />
                          <div className="flex-1">
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {task.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {task.time} • {task.description}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Milestones */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Milestones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carePlan.milestones.map((milestone) => (
                    <div key={milestone.id} className={`p-4 rounded-lg border ${
                      milestone.achieved
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {milestone.achieved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                        <h4 className={`font-medium ${
                          milestone.achieved ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-white'
                        }`}>
                          {milestone.title}
                        </h4>
                      </div>
                      <p className={`text-sm ${
                        milestone.achieved ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {milestone.description}
                      </p>
                      {milestone.achieved && (
                        <p className="text-xs text-green-600 mt-2">
                          Achieved {format(milestone.achievedDate, 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {selectedTab === 'goals' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Health Goals
                </h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carePlan.goals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getGoalColor(goal.category)} flex items-center justify-center`}>
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>

                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {goal.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div
                          className={`bg-gradient-to-r ${getGoalColor(goal.category)} h-3 rounded-full transition-all`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="text-gray-500">
                        Due {format(goal.deadline, 'MMM dd')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {selectedTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Care Tasks
                </h3>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>

              {/* Daily Tasks */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Daily Tasks</h4>
                <div className="space-y-3">
                  {carePlan.dailyTasks.map((task) => {
                    const Icon = getCategoryIcon(task.category);
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            task.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {task.completed && <CheckCircle className="h-3 w-3" />}
                        </button>
                        <Icon className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {task.time} • {task.description}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {selectedTab === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Care Schedule
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Schedule */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Weekly Tasks</h4>
                  <div className="space-y-3">
                    {carePlan.weeklyTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">{task.title}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {task.day} • {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Schedule */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Monthly Tasks</h4>
                  <div className="space-y-3">
                    {carePlan.monthlyTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-500" />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">{task.title}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {format(task.date, 'MMM dd')} • {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Task
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={newTask.frequency}
                    onChange={(e) => setNewTask(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addNewTask}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedCarePlan;