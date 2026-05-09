import { useState, useEffect, useRef } from 'react'
import ahlLogo from '../../logo/AHL-removebg-preview.png'
import alchemaneLogo from '../../logo/Alchem-removebg-preview.png'

const MALE_PROVIDERS = ['Fahim', 'Faizan', 'Hasnain', 'Mohsin', 'Murti', 'Pradeep', 'Rahat', 'Rahul', 'Raj', 'Raja', 'Raza', 'Sohaib', 'Umair', 'Vinitt', 'Yogesh', 'Zishan', 'Gauri', 'Pooja', 'Sejal', 'Zoya']

const FEMALE_PROVIDERS = ['Anita', 'Bunu', 'Muskan', 'Nilisha', 'Soni', 'Tuba', 'Varsha', 'Ninsi']

const LIKED_MOST_OPTIONS = ['Service Quality', 'Staff Behavior', 'Ambiance/Cleanliness', 'Pricing', 'Other']

const IMPROVEMENT_OPTIONS = ['Wait Time', 'Service Speed', 'Booking Process', 'Nothing it was perfect', 'Other']

export default function FeedbackForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    gender: '',
    provider: '',
    firstVisit: '',
    satisfaction: null,
    likedMost: '',
    likedMostOther: '',
    improvement: '',
    improvementOther: '',
    neutralSuggestions: '',
    unhappyConcerns: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const abortControllerRef = useRef(null)

  // Clean up abort controller when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        console.log('🧹 [Feedback Form] Cleaning up abort controller')
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const providers = formData.gender === 'male' ? MALE_PROVIDERS : FEMALE_PROVIDERS

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'gender' && { provider: '' }),
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your name'
    if (!formData.contact.trim()) return 'Please enter your contact number'
    
    // Phone number validation
    const cleanPhone = formData.contact.replace(/\D/g, '')
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return 'Please enter a valid phone number (10-15 digits)'
    }
    
    if (!formData.gender) return 'Please select your gender'
    if (!formData.provider) return 'Please select a service provider'
    if (formData.firstVisit === '') return 'Please select if this is your first visit'
    if (formData.satisfaction === null) return 'Please rate your satisfaction'

    // 4-5 stars: Validate BOTH "Liked Most" AND "Improvement"
    if ([4, 5].includes(formData.satisfaction)) {
      if (!formData.likedMost) return 'Please select what you liked most'
      if (formData.likedMost === 'Other' && !formData.likedMostOther.trim()) return 'Please specify what you liked most'
      if (!formData.improvement) return 'Please select an improvement area'
      if (formData.improvement === 'Other' && !formData.improvementOther.trim()) return 'Please specify improvement'
    }
    // 3 stars: Validate "Neutral Suggestions"
    else if (formData.satisfaction === 3) {
      if (!formData.neutralSuggestions.trim()) return 'Please share your suggestions'
    }
    // 1-2 stars: Validate "Concerns/Suggestions"
    else if ([1, 2].includes(formData.satisfaction)) {
      if (!formData.unhappyConcerns.trim()) return 'Please share your concerns'
    }

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    // Abort any previous requests
    if (abortControllerRef.current) {
      console.log('🛑 [Feedback Form] Aborting previous request')
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        contact: formData.contact,
        gender: formData.gender === 'male' ? 'Male' : 'Female',
        provider: formData.provider,
        firstVisit: formData.firstVisit === 'yes' ? 'Yes' : 'No',
        satisfactionScore: formData.satisfaction,
        likedMost: formData.likedMost === 'Other' ? formData.likedMostOther : formData.likedMost,
        improvement: formData.improvement === 'Other' ? formData.improvementOther : formData.improvement,
        neutralSuggestions: formData.neutralSuggestions,
        unhappyConcerns: formData.unhappyConcerns,
      }

      const apiUrl = import.meta.env.VITE_GAS_API_URL
      
      if (!apiUrl) {
        console.error('❌ API URL is not configured')
        setError('Configuration error: API endpoint not found. Please contact support.')
        setIsSubmitting(false)
        return
      }

      console.log('📤 [Feedback Form] Submitting feedback...')
      console.log('📍 API URL:', apiUrl)
      console.log('📊 Payload:', JSON.stringify(payload, null, 2))
      
      // Use no-cors mode to handle Google Apps Script cross-origin requests
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      })

      console.log('✅ [Feedback Form] Request sent successfully')
      console.log('📬 Response type:', response.type)
      console.log('📍 Response status:', response.status)
      
      // Capture the submission data BEFORE resetting the form
      const submissionData = {
        gender: formData.gender,
        satisfaction: formData.satisfaction,
        name: formData.name,
        contact: formData.contact,
      }
      
      console.log('📦 [Feedback Form] Captured submission data:', submissionData)
      
      // With no-cors mode, we can't check response.ok, so we assume success if fetch completes
      // The data will be in Google Sheets regardless
      
      // Reset form and proceed to success screen
      console.log('🔄 [Feedback Form] Resetting form...')
      setFormData({
        name: '',
        contact: '',
        gender: '',
        provider: '',
        firstVisit: '',
        satisfaction: null,
        likedMost: '',
        likedMostOther: '',
        improvement: '',
        improvementOther: '',
        neutralSuggestions: '',
        unhappyConcerns: '',
      })
      
      console.log('✨ [Feedback Form] Proceeding to success screen')
      
      // Reset submit state before proceeding
      setIsSubmitting(false)
      
      // Use captured data instead of formData (which may have been reset)
      onSubmit(submissionData)
      
    } catch (err) {
      console.error('❌ [Feedback Form] Error caught in try-catch:', err)
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      
      // Don't show error if request was aborted (user went back)
      if (err.name === 'AbortError') {
        console.log('ℹ️ [Feedback Form] Request was cancelled')
        return
      }
      
      // Determine specific error type
      let errorMessage = 'Error submitting feedback. Please try again.'
      
      if (err.message && err.message.includes('Failed to fetch')) {
        errorMessage = 'Connection error. Please check if you are online and try again.'
      } else if (err.message && err.message.includes('CORS')) {
        errorMessage = 'Access error. The API endpoint may be blocked. Please contact support.'
      } else if (err.type === 'NetworkError' || err.name === 'NetworkError') {
        errorMessage = 'Network error detected. Please check your internet connection and try again.'
      } else if (!navigator.onLine) {
        errorMessage = 'You are offline. Please check your internet connection and try again.'
      }
      
      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Premium Header Card */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-t-3xl p-8 shadow-premium backdrop-blur-md border border-white/30">
          {/* Logo Section */}
          <div className="flex items-center justify-center gap-4 sm:gap-12 mb-6">
            {/* American Hairline Logo */}
            <div className="flex-1 flex justify-center transform hover:scale-105 transition-transform duration-300">
              <img
                src={ahlLogo}
                alt="American Hairline"
                className="h-24 sm:h-28 md:h-32 object-contain drop-shadow-lg"
              />
            </div>

            {/* Premium Divider */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-0.5 h-12 sm:h-16 md:h-20 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
              <span className="text-[10px] sm:text-xs font-semibold text-primary">OR</span>
              <div className="w-0.5 h-12 sm:h-16 md:h-20 bg-gradient-to-b from-transparent via-primary to-transparent"></div>
            </div>

            {/* Alchemane Logo */}
            <div className="flex-1 flex justify-center transform hover:scale-105 transition-transform duration-300">
              <img
                src={alchemaneLogo}
                alt="Alchemane"
                className="h-24 sm:h-28 md:h-32 object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Header Text */}
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-navy via-navy-light to-primary bg-clip-text text-transparent mb-2">
              Share Your Feedback
            </h1>
            <p className="text-base text-gray-600">Help us deliver an exceptional experience</p>
            <p className="text-xs text-gray-500 mt-1">Your insights matter to us</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-b-3xl p-10 shadow-premium space-y-8 border-t-4 border-primary/20">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-slide-up">
              <p className="text-red-700 font-medium">⚠️ {error}</p>
            </div>
          )}

          {/* Step 1: Basic Information */}
          <div className="space-y-6 pb-6">
            <h2 className="text-xl font-bold text-navy">Your Information</h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-3">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-3">Contact Number *</label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Salon Selection */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-4">What is your gender? *</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-primary transition-colors duration-200 font-medium">Male</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-primary transition-colors duration-200 font-medium">Female</span>
                </label>
              </div>
            </div>

            {/* Service Provider */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-3">
                Service Provider * {!formData.gender && <span className="text-gray-400 font-normal">(Select salon first)</span>}
              </label>
              <select
                value={formData.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                disabled={!formData.gender}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
              >
                <option value="">Select a service provider</option>
                {providers.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            {/* First Visit */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-4">
                Is this your first visit to {formData.gender === 'female' ? 'Alchemane' : 'American Hairline'}? *
              </label>
              <div className="flex gap-6">
                {['yes', 'no'].map(option => (
                  <label key={option} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="firstVisit"
                      value={option}
                      checked={formData.firstVisit === option}
                      onChange={(e) => handleInputChange('firstVisit', e.target.value)}
                      className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-primary transition-colors duration-200 font-medium capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Satisfaction Rating */}
            <div>
              <label className="block text-sm font-semibold text-navy mb-4">How satisfied are you with our service? (1 - Poor, 5 - Excellent) *</label>
              <div className="flex gap-4 justify-center">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleInputChange('satisfaction', rating)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 flex-shrink-0 ${
                      formData.satisfaction === rating
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-primary/50 hover:text-primary hover:shadow-md'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Conditional Fields based on Satisfaction */}
          {formData.satisfaction === 5 || formData.satisfaction === 4 ? (
            <div className="space-y-6 pb-6 border-t-2 border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-navy">What You Loved & Suggestions</h2>

              {/* What you liked most */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-3">What is one thing that you like most about our services? *</label>
                <select
                  value={formData.likedMost}
                  onChange={(e) => handleInputChange('likedMost', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                >
                  <option value="">Select an option</option>
                  {LIKED_MOST_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                {formData.likedMost === 'Other' && (
                  <input
                    type="text"
                    value={formData.likedMostOther}
                    onChange={(e) => handleInputChange('likedMostOther', e.target.value)}
                    className="w-full mt-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* What we can improve */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-3">What's one thing we can improve to serve you better next time? *</label>
                <select
                  value={formData.improvement}
                  onChange={(e) => handleInputChange('improvement', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                >
                  <option value="">Select an option</option>
                  {IMPROVEMENT_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>

                {formData.improvement === 'Other' && (
                  <input
                    type="text"
                    value={formData.improvementOther}
                    onChange={(e) => handleInputChange('improvementOther', e.target.value)}
                    className="w-full mt-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                    placeholder="Please specify"
                  />
                )}
              </div>
            </div>
          ) : formData.satisfaction === 3 ? (
            <div className="space-y-6 pb-6 border-t-2 border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-navy">Your Feedback</h2>

              {/* Neutral Suggestions - ONLY for 3 stars */}
              <div>
                <label className="block text-sm font-semibold text-navy mb-3">What are the things that you would suggest that we should work on ourselves? *</label>
                <textarea
                  value={formData.neutralSuggestions}
                  onChange={(e) => handleInputChange('neutralSuggestions', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  rows="4"
                  placeholder="Share your suggestions with us..."
                />
              </div>
            </div>
          ) : formData.satisfaction === 1 || formData.satisfaction === 2 ? (
            <div className="space-y-6 pb-6 border-t-2 border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-navy">Sorry for Your Experience</h2>
              <div>
                <label className="block text-sm font-semibold text-navy mb-3">Please share your concerns and we will arrange a call back. *</label>
                <textarea
                  value={formData.unhappyConcerns}
                  onChange={(e) => handleInputChange('unhappyConcerns', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  rows="6"
                  placeholder="Share your concerns with us..."
                />
              </div>
            </div>
          ) : null}

          {/* Submit Button */}
          <div className="pt-8 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary via-primary-light to-primary-dark hover:shadow-lg disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg shadow-premium"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  ✨ Submit Your Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
