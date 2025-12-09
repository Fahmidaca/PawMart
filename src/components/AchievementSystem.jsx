import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Target, 
  Calendar, 
  Award, 
  Medal, 
  Crown,
  Zap,
  Heart,
  Users,
  Camera,
  CheckCircle,
  Lock,
  Gift,
  TrendingUp,
  Flame,
  Shield
} from 'lucide-react';

const AchievementSystem = () => {
  const [userStats, setUserStats] = useState({
    totalPoints: 2450,
    level: 12,
    streakDays: 15,
    petsAdopted: 3,
    healthRecordsAdded: 28,
    communityPosts: 12,
    photosShared: 45,
    consultations: 8,
    referrals: 2
  });

  const [achievements, setAchievements] = useState([
    {
      id: '1',
      title: 'First Steps',
      description: 'Adopt your first pet',
      icon: '🐾',
      category: 'adoption',
      points: 100,
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedAt: new Date('2024-10-15'),
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Health Guardian',
      description: 'Add 25 health records',
      icon: '💊',
      category: 'health',
      points: 200,
      progress: 28,
      maxProgress: 25,
      unlocked: true,
      unlockedAt: new Date('2024-11-20'),
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Make 50 community posts',
      icon: '💬',
      category: 'community',
      points: 300,
      progress: 12,
      maxProgress: 50,
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Photography Pro',
      description: 'Share 100 pet photos',
      icon: '📸',
      category: 'social',
      points: 250,
      progress: 45,
      maxProgress: 100,
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: '5',
      title: 'Streak Master',
      description: 'Maintain a 30-day activity streak',
      icon: '🔥',
      category: 'engagement',
      points: 500,
      progress: 15,
      maxProgress: 30,
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: '6',
      title: 'Pet Parent Pro',
      description: 'Adopt 5 pets',
      icon: '👑',
      category: 'adoption',
      points: 750,
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'legendary'
    }
  ]);

  const [activeTab, setActiveTab] = useState('achievements');
  const [challenges, setChallenges] = useState([
    {
      id: '1',
      title: 'Weekly Health Check',
      description: 'Update 3 health records this week',
      reward: 50,
      progress: 2,
      maxProgress: 3,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      category: 'health'
    },
    {
      id: '2',
      title: 'Community Star',
      description: 'Receive 25 likes on your posts',
      reward: 75,
      progress: 18,
      maxProgress: 25,
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      category: 'social'
    },
    {
      id: '3',
      title: 'Referral Champion',
      description: 'Invite 3 friends to join WarmPaws',
      reward: 150,
      progress: 2,
      maxProgress: 3,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      category: 'referral'
    }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Sarah Ahmed', points: 5640, avatar: null, badge: '👑' },
    { rank: 2, name: 'Rahim Khan', points: 4890, avatar: null, badge: '🥈' },
    { rank: 3, name: 'Fatema Begum', points: 4230, avatar: null, badge: '🥉' },
    { rank: 4, name: 'You', points: userStats.totalPoints, avatar: null, badge: '⭐', isCurrentUser: true },
    { rank: 5, name: 'Karim Hassan', points: 2180, avatar: null, badge: '🏅' }
  ]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 border-gray-300';
      case 'rare': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'epic': return 'text-purple-600 bg-purple-100 border-purple-300';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'rare': return 'shadow-lg shadow-blue-200';
      case 'epic': return 'shadow-xl shadow-purple-200';
      case 'legendary': return 'shadow-2xl shadow-yellow-200';
      default: return 'shadow-md';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'adoption': return Heart;
      case 'health': return Shield;
      case 'community': return Users;
      case 'social': return Camera;
      case 'engagement': return Flame;
      case 'referral': return Gift;
      default: return Star;
    }
  };

  const getProgressPercentage = (progress, maxProgress) => {
    return Math.min((progress / maxProgress) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Achievement System
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and earn rewards for your pet care journey
        </p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{userStats.totalPoints}</div>
          <div className="text-sm opacity-90">Total Points</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">Level {userStats.level}</div>
          <div className="text-sm opacity-90">Current Level</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{userStats.streakDays}</div>
          <div className="text-sm opacity-90">Day Streak</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
          <div className="text-sm opacity-90">Achievements</div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'achievements', label: 'Achievements', icon: Award },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Achievements Tab */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Achievements
              </h3>
              <div className="text-sm text-gray-500">
                {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const CategoryIcon = getCategoryIcon(achievement.category);
                const progressPercentage = getProgressPercentage(achievement.progress, achievement.maxProgress);
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-xl p-4 transition-all ${
                      achievement.unlocked 
                        ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.unlocked ? achievement.icon : '🔒'}
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                        }`}>
                          {achievement.points} pts
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {achievement.rarity}
                        </div>
                      </div>
                    </div>

                    <h4 className={`font-semibold mb-1 ${
                      achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    
                    <p className={`text-sm mb-3 ${
                      achievement.unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>

                    {!achievement.unlocked && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Unlocked {achievement.unlockedAt.toLocaleDateString()}</span>
                      </div>
                    )}

                    {!achievement.unlocked && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Lock className="h-3 w-3" />
                        <span>Keep going!</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Challenges Tab */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Challenges
            </h3>

            <div className="space-y-4">
              {challenges.map((challenge) => {
                const progressPercentage = getProgressPercentage(challenge.progress, challenge.maxProgress);
                const daysLeft = Math.ceil((challenge.deadline - new Date()) / (1000 * 60 * 60 * 24));
                
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {challenge.title}
                      </h4>
                      <div className="text-right">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {challenge.reward} points
                        </div>
                        <div className="text-xs text-gray-500">
                          {daysLeft} days left
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {challenge.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {challenge.progress}/{challenge.maxProgress}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Tab */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Community Leaderboard
            </h3>

            <div className="space-y-3">
              {leaderboard.map((user) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-4 p-3 rounded-lg ${
                    user.isCurrentUser 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {user.rank <= 3 ? user.badge : user.rank}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className={`font-medium ${
                      user.isCurrentUser ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {user.name}
                      {user.isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;