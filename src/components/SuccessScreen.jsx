import { useEffect, useState } from 'react'

export default function SuccessScreen({ data, onReset }) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isSatisfied = data.satisfaction >= 4
  const isNeutral = data.satisfaction === 3
  const isUnhappy = data.satisfaction <= 2

  // Auto-redirect for 4-5 stars (satisfied customers)
  useEffect(() => {
    if (isSatisfied && !isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        window.location.href = getGoogleReviewLink()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isSatisfied, isRedirecting])

  // Auto-redirect for 1-2 stars (unhappy customers)
  useEffect(() => {
    if (isUnhappy && !isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        window.location.href = complaintLink
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isUnhappy, isRedirecting])

  const GOOGLE_REVIEW_PLACE_IDS = {
    male: 'ChIJswL3q3XH5zsRwkP0vJlpfy4',
    female: 'ChIltT3szfkJEpDBbLgLDa4MhR2Q0mtLszYPjRO1pyVJ9SE78V2snQQZQHWM778JVUpc',
  }

  const getGoogleReviewLink = () => {
    const placeId = data.gender === 'male' ? GOOGLE_REVIEW_PLACE_IDS.male : GOOGLE_REVIEW_PLACE_IDS.female
    const placeQuery = data.gender === 'male' ? 'american+hairline+salon' : 'alchemane+salon'

    // Use the direct review URL when available
    if (placeId) {
      return `https://search.google.com/local/writereview?placeid=${placeId}`
    }

    // Fallback: open the location on Google Maps if the direct review link is not configured
    return `https://www.google.com/maps/search/?api=1&query=${placeQuery}`
  }

  const complaintLink = 'https://ahl-complaint-form.vercel.app/#complaint'

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl p-12 shadow-premium-lg text-center border border-white/30 backdrop-blur-md animate-slide-up">
          {/* Success Icon */}
          <div className="mb-8">
            {isUnhappy ? (
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full shadow-lg">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-primary/20 to-green-100 rounded-full shadow-lg animate-glow">
                <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content based on satisfaction */}
          {isSatisfied ? (
            <>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-light to-navy bg-clip-text text-transparent mb-4">
                Thank You! 🎉
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Thank you for the wonderful feedback!
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Your kind words motivate us to keep delivering excellence.
              </p>
              <p className="text-base text-gray-500 mb-12">
                We're redirecting you to leave a Google review in 5 seconds...
              </p>
              <div className="space-y-4">
                <a
                  href={getGoogleReviewLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-primary via-primary-light to-primary-dark hover:shadow-lg text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-premium"
                >
                  ⭐ Leave a Google Review
                </a>
              </div>
            </>
          ) : isNeutral ? (
            <>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-navy to-navy-light bg-clip-text text-transparent mb-4">
                Thank You for Your Feedback
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                We truly appreciate your insights.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We will work on the areas you mentioned to improve our services.
              </p>
              <p className="text-base text-gray-500">
                Your feedback helps us serve you better! 💝
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-navy mb-4">We Value Your Feedback</h1>
              <p className="text-xl text-gray-600 mb-2">Your concern has been escalated to our premium support team.</p>
              <p className="text-xl text-gray-600 mb-8">Our senior management will personally review your experience and contact you within 24 hours to ensure complete satisfaction.</p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 mb-12 text-left rounded-lg shadow-hover">
                <p className="text-gray-700 text-base font-medium">
                  ✓ Redirecting to detailed complaint form in 5 seconds...
                </p>
              </div>
              <div className="space-y-4">
                <a
                  href={complaintLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-navy via-navy-light to-navy-lighter hover:shadow-lg text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-premium"
                >
                  📋 Click here if not redirected
                </a>
              </div>
            </>
          )}

          {/* Footer Message */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-base mb-6">
              Thank you for choosing <span className="font-bold text-primary">{data.gender === 'male' ? 'American Hairline' : 'Alchemane'}</span>
            </p>
            <button
              onClick={onReset}
              className="text-primary hover:text-primary-dark font-semibold transition-colors duration-300 hover:underline text-lg"
            >
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
