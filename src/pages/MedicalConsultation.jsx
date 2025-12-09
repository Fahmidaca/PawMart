import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const MedicalConsultation = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    petName: '',
    petType: '',
    petAge: '',
    issue: '',
    preferredDate: '',
    preferredTime: '',
    symptoms: '',
    urgency: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Pet experts data (similar to Home.jsx but focused on medical consultations)
  const medicalExperts = [
    {
      id: 1,
      name: 'Dr. Sarah Ahmed',
      specialization: 'Veterinary Medicine',
      location: 'Dhaka',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '15+ years',
      rating: 4.9,
      description: 'Specializes in pet health, vaccinations, and preventive care for all types of pets.',
      services: 'Health Checkups, Vaccinations, Surgery, Emergency Care',
      availability: 'Mon-Sat 9AM-6PM',
      consultationFee: 1500,
      availabilitySlots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
    },
    {
      id: 2,
      name: 'Dr. Rahman Hassan',
      specialization: 'Pet Surgery & Emergency',
      location: 'Chattogram',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '12+ years',
      rating: 4.8,
      description: 'Expert in pet surgery and emergency medical care with state-of-the-art facilities.',
      services: 'Emergency Care, Surgery, Critical Care, Trauma Treatment',
      availability: '24/7 Emergency, Mon-Fri 8AM-8PM',
      consultationFee: 2000,
      availabilitySlots: ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM', '6:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Fatema Khatun',
      specialization: 'Pet Nutrition & Wellness',
      location: 'Sylhet',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '10+ years',
      rating: 4.9,
      description: 'Nutrition specialist focusing on dietary needs and wellness programs for optimal pet health.',
      services: 'Nutrition, Wellness, Dietary Planning, Weight Management',
      availability: 'Mon-Sat 10AM-5PM',
      consultationFee: 1200,
      availabilitySlots: ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']
    },
    {
      id: 4,
      name: 'Dr. Karim Mahmud',
      specialization: 'Pet Behavior & Mental Health',
      location: 'Rajshahi',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      experience: '8+ years',
      rating: 4.7,
      description: 'Behavioral expert helping pets with training, social issues, and mental health support.',
      services: 'Behavior Training, Socialization, Mental Health, Anxiety Treatment',
      availability: 'Tue-Sun 11AM-6PM',
      consultationFee: 1000,
      availabilitySlots: ['11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']
    }
  ];

  useEffect(() => {
    setExperts(medicalExperts);
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle consultation booking
  const handleBookConsultation = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a consultation');
      return;
    }

    if (!selectedExpert) {
      toast.error('Please select a veterinary expert');
      return;
    }

    // Validate form
    const requiredFields = ['petName', 'petType', 'issue', 'preferredDate', 'preferredTime'];
    const missingFields = requiredFields.filter(field => !bookingForm[field]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for booking consultation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Consultation booked successfully with ${selectedExpert.name}!`);
      
      // Reset form
      setBookingForm({
        petName: '',
        petType: '',
        petAge: '',
        issue: '',
        preferredDate: '',
        preferredTime: '',
        symptoms: '',
        urgency: 'normal'
      });
      setSelectedExpert(null);
      
    } catch (error) {
      toast.error('Failed to book consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get urgency badge color
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Medical Consultation Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book consultations with our qualified veterinarians and pet health experts. 
            Get professional medical advice for your beloved pets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Experts Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Veterinary Expert</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experts.map((expert) => (
                  <div 
                    key={expert.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedExpert?.id === expert.id 
                        ? 'border-warm-500 bg-warm-50' 
                        : 'border-gray-200 hover:border-warm-300'
                    }`}
                    onClick={() => setSelectedExpert(expert)}
                  >
                    <div className="flex items-start space-x-4">
                      <img 
                        src={expert.image} 
                        alt={expert.name}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                        <p className="text-warm-600 text-sm">{expert.specialization}</p>
                        <p className="text-gray-500 text-sm">📍 {expert.location}</p>
                        <p className="text-gray-500 text-sm">⭐ {expert.rating} • {expert.experience}</p>
                        <p className="text-warm-600 font-semibold">৳{expert.consultationFee} per consultation</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">{expert.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {expert.services.split(', ').map((service, index) => (
                          <span 
                            key={index}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedExpert ? `Book Consultation with ${selectedExpert.name}` : 'Consultation Details'}
              </h2>
              
              {selectedExpert ? (
                <form onSubmit={handleBookConsultation} className="space-y-6">
                  {/* Pet Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        name="petName"
                        value={bookingForm.petName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                        placeholder="Enter your pet's name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Type *
                      </label>
                      <select
                        name="petType"
                        value={bookingForm.petType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                        required
                      >
                        <option value="">Select pet type</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Fish">Fish</option>
                        <option value="Rabbit">Rabbit</option>
                        <option value="Hamster">Hamster</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pet Age
                      </label>
                      <input
                        type="text"
                        name="petAge"
                        value={bookingForm.petAge}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                        placeholder="e.g., 2 years, 6 months"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <select
                        name="urgency"
                        value={bookingForm.urgency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  {/* Medical Issue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Issue *
                    </label>
                    <input
                      type="text"
                      name="issue"
                      value={bookingForm.issue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Symptoms or Details
                    </label>
                    <textarea
                      name="symptoms"
                      value={bookingForm.symptoms}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                      placeholder="Describe any symptoms, behaviors, or additional information that might help the veterinarian"
                    />
                  </div>

                  {/* Appointment Scheduling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={bookingForm.preferredDate}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferredTime"
                        value={bookingForm.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-warm-500 focus:border-warm-500"
                        required
                      >
                        <option value="">Select time slot</option>
                        {selectedExpert.availabilitySlots.map((slot, index) => (
                          <option key={index} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Urgency Badge */}
                  {bookingForm.urgency !== 'normal' && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(bookingForm.urgency)}`}>
                      {bookingForm.urgency === 'emergency' && '🚨 Emergency'}
                      {bookingForm.urgency === 'urgent' && '⚠️ Urgent'}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <p>Consultation Fee: <span className="font-semibold text-warm-600">৳{selectedExpert.consultationFee}</span></p>
                      <p>Duration: 30-45 minutes</p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-warm-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-warm-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Booking...' : 'Book Consultation'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏥</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a Veterinary Expert
                  </h3>
                  <p className="text-gray-600">
                    Please select a veterinary expert from the list above to proceed with booking your consultation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 What to Expect</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-warm-600 mr-2">✓</span>
                  30-45 minute consultation
                </li>
                <li className="flex items-start">
                  <span className="text-warm-600 mr-2">✓</span>
                  Professional medical advice
                </li>
                <li className="flex items-start">
                  <span className="text-warm-600 mr-2">✓</span>
                  Treatment recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-warm-600 mr-2">✓</span>
                  Follow-up guidance
                </li>
              </ul>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">🚨 Emergency?</h3>
              <p className="text-red-700 text-sm mb-4">
                If your pet is experiencing a medical emergency, please contact your local emergency veterinary clinic immediately.
              </p>
              <div className="text-sm text-red-600">
                <p><strong>Emergency Hotline:</strong></p>
                <p>📞 24/7: +880-1234-567890</p>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-warm-50 border border-warm-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-warm-800 mb-2">Need Help?</h3>
              <p className="text-warm-700 text-sm mb-4">
                Our support team is here to help you with any questions about booking consultations.
              </p>
              <Link 
                to="/contact" 
                className="text-warm-600 hover:text-warm-700 text-sm font-medium"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalConsultation;