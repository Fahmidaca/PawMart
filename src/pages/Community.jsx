import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Image,
  Heart,
  Star,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  MessageCircle,
  Share2,
  Award,
  Camera,
  Send,
  X,
  ChevronRight,
  Clock,
  User,
  PawPrint
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// Demo data for community features
const demoForumPosts = [
  {
    id: '1',
    title: 'Tips for First-Time Dog Owners',
    content: 'Just adopted my first puppy! Looking for advice on training and care. What are the essential things I should know?',
    author: { name: 'Sarah Ahmed', avatar: null, reputation: 125 },
    category: 'Training',
    tags: ['puppy', 'training', 'beginner'],
    likes: 24,
    replies: 12,
    views: 156,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isPinned: true
  },
  {
    id: '2',
    title: 'Best Cat Food Recommendations in Bangladesh',
    content: 'What cat food brands do you recommend that are available locally? My Persian cat is quite picky.',
    author: { name: 'Rahim Khan', avatar: null, reputation: 89 },
    category: 'Health',
    tags: ['cat', 'food', 'nutrition'],
    likes: 18,
    replies: 8,
    views: 98,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isPinned: false
  },
  {
    id: '3',
    title: 'How to Help a Rescued Street Dog Adjust',
    content: 'I recently rescued a street dog and she seems very scared. Any tips on helping her feel safe and comfortable?',
    author: { name: 'Fatema Begum', avatar: null, reputation: 210 },
    category: 'Adoption',
    tags: ['rescue', 'adoption', 'behavior'],
    likes: 45,
    replies: 23,
    views: 312,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isPinned: false
  }
];

const demoPhotos = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    caption: 'My golden retriever enjoying the park! 🐕',
    author: { name: 'Karim', avatar: null },
    likes: 89,
    comments: 12,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    caption: 'Lazy Sunday with my Persian cat 😺',
    author: { name: 'Nadia', avatar: null },
    likes: 67,
    comments: 8,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    caption: 'Best friends forever! 🐾',
    author: { name: 'Tanvir', avatar: null },
    likes: 124,
    comments: 19,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
    caption: 'New family member! Just adopted this cutie 🥰',
    author: { name: 'Rima', avatar: null },
    likes: 156,
    comments: 28,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

const demoSuccessStories = [
  {
    id: '1',
    title: 'From Street to Home: Bruno\'s Journey',
    petName: 'Bruno',
    petType: 'Dog',
    beforeImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400',
    afterImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    story: 'Bruno was found on the streets of Dhaka, malnourished and scared. After 6 months of love and care, he\'s now a happy, healthy family member who loves playing fetch!',
    author: { name: 'The Rahman Family', avatar: null },
    adoptionDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    likes: 234,
    featured: true
  },
  {
    id: '2',
    title: 'Whiskers Found Her Forever Home',
    petName: 'Whiskers',
    petType: 'Cat',
    beforeImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400',
    afterImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    story: 'Whiskers was abandoned as a kitten. Through WarmPaws, she found a loving home where she now rules as the queen of the house!',
    author: { name: 'Ayesha Siddiqui', avatar: null },
    adoptionDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    likes: 189,
    featured: true
  }
];

const forumCategories = ['All', 'Training', 'Health', 'Adoption', 'Nutrition', 'Behavior', 'General'];

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('forum');
  const [forumPosts, setForumPosts] = useState(demoForumPosts);
  const [photos, setPhotos] = useState(demoPhotos);
  const [successStories, setSuccessStories] = useState(demoSuccessStories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  const filteredPosts = forumPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLikePost = (postId) => {
    setForumPosts(posts => posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    toast.success('Post liked!');
  };

  const handleLikePhoto = (photoId) => {
    setPhotos(photos => photos.map(photo => 
      photo.id === photoId ? { ...photo, likes: photo.likes + 1 } : photo
    ));
  };

  const handleLikeStory = (storyId) => {
    setSuccessStories(stories => stories.map(story => 
      story.id === storyId ? { ...story, likes: story.likes + 1 } : story
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            WarmPaws Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connect with fellow pet lovers, share stories, and learn together
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-500">1,234</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Members</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-500">567</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Discussions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-500">2,345</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Photos Shared</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-500">189</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Success Stories</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'forum', label: 'Forum Discussions', icon: MessageSquare },
                { id: 'photos', label: 'Photo Gallery', icon: Image },
                { id: 'stories', label: 'Success Stories', icon: Heart }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
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

          <div className="p-6">
            {/* Forum Tab */}
            {activeTab === 'forum' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {forumCategories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {user && (
                    <button
                      onClick={() => setShowNewPostModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      New Post
                    </button>
                  )}
                </div>

                {/* Forum Posts */}
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow ${
                        post.isPinned ? 'border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {post.isPinned && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Pinned</span>
                            )}
                            <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              {post.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-500 cursor-pointer">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {post.author.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {post.author.reputation}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(post.createdAt, 'MMM d')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">{post.replies} replies</span>
                            </button>
                            <span className="text-sm text-gray-400">{post.views} views</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Pet Photo Gallery
                  </h3>
                  {user && (
                    <button
                      onClick={() => setShowPhotoUploadModal(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Camera className="h-4 w-4" />
                      Upload Photo
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={photo.imageUrl}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {photo.caption}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            by {photo.author.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleLikePhoto(photo.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              <span className="text-xs">{photo.likes}</span>
                            </button>
                            <span className="flex items-center gap-1 text-gray-500">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-xs">{photo.comments}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Stories Tab */}
            {activeTab === 'stories' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Adoption Success Stories
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Heartwarming stories of pets finding their forever homes
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {successStories.map((story) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg"
                    >
                      {story.featured && (
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-center py-1 text-sm font-medium">
                          ⭐ Featured Story
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 p-4">
                        <div className="relative">
                          <img
                            src={story.beforeImage}
                            alt="Before"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Before
                          </span>
                        </div>
                        <div className="relative">
                          <img
                            src={story.afterImage}
                            alt="After"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            After
                          </span>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {story.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <PawPrint className="h-4 w-4" />
                          <span>{story.petName} • {story.petType}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mt-3 text-sm">
                          {story.story}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span>by {story.author.name}</span>
                            <span className="mx-2">•</span>
                            <span>Adopted {format(story.adoptionDate, 'MMM yyyy')}</span>
                          </div>
                          <button
                            onClick={() => handleLikeStory(story.id)}
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Heart className="h-5 w-5 fill-current" />
                            <span className="font-medium">{story.likes}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {user && (
                  <div className="text-center mt-8">
                    <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium">
                      Share Your Success Story
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* New Post Modal */}
        <AnimatePresence>
          {showNewPostModal && (
            <NewPostModal onClose={() => setShowNewPostModal(false)} onSubmit={(post) => {
              setForumPosts([{ ...post, id: Date.now().toString() }, ...forumPosts]);
              setShowNewPostModal(false);
              toast.success('Post created successfully!');
            }} />
          )}
        </AnimatePresence>

        {/* Photo Upload Modal */}
        <AnimatePresence>
          {showPhotoUploadModal && (
            <PhotoUploadModal onClose={() => setShowPhotoUploadModal(false)} onSubmit={(photo) => {
              setPhotos([{ ...photo, id: Date.now().toString() }, ...photos]);
              setShowPhotoUploadModal(false);
              toast.success('Photo uploaded successfully!');
            }} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// New Post Modal Component
const NewPostModal = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      author: { name: user?.displayName || 'Anonymous', avatar: null, reputation: 0 },
      likes: 0,
      replies: 0,
      views: 0,
      createdAt: new Date(),
      isPinned: false
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Enter post title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {forumCategories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content *</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Write your post content..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="e.g., puppy, training, tips"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
              Post
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Photo Upload Modal Component
const PhotoUploadModal = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error('Please provide an image URL');
      return;
    }

    onSubmit({
      imageUrl,
      caption,
      author: { name: user?.displayName || 'Anonymous', avatar: null },
      likes: 0,
      comments: 0,
      createdAt: new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL *</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          {imageUrl && (
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Caption</label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              placeholder="Add a caption for your photo..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
              Upload
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Community;
