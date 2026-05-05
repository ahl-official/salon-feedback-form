import { useEffect, useState, useRef } from 'react'

export default function SuccessScreen({ data, onReset }) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const messageSentRef = useRef(false)
  const isSatisfied = data.satisfaction >= 4
  const isNeutral = data.satisfaction === 3
  const isUnhappy = data.satisfaction <= 2

  // Send WhatsApp message via WAHA
  const sendWhatsAppMessage = async (contactNo) => {
    try {
      // Check if contact number exists
      if (!contactNo) {
        console.error('❌ Contact number is missing or undefined')
        return
      }

      console.log('📱 Received contact number:', contactNo, typeof contactNo)
      
      // Format phone number: add country code if not present and remove other non-digits
      let cleanPhone = String(contactNo).replace(/\D/g, '')
      
      console.log('📱 Cleaned phone:', cleanPhone)
      
      // If phone number doesn't start with country code, add +91 (India)
      if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone
      }
      
      const wahaPhoneId = `${cleanPhone}@c.us`
      
      console.log('📱 Sending WhatsApp to:', wahaPhoneId)
      console.log('📱 Using endpoint: https://waha.amankhan.space/api/sendText')
      
      const brandName = data.gender === 'male' ? 'American Hairline' : 'Alchemane'
      const professionalMessage = `*${brandName} Support* 🌟\n\nHi ${data.name || 'there'},\n\nWe sincerely apologize that your recent experience did not meet your expectations. We have raised a priority ticket for your concerns.\n\nOur senior support team will review your feedback and call you within *24 hours* to resolve this matter to your satisfaction.\n\nThank you for your valuable feedback. 🙏`
      
      const response = await fetch('https://waha.amankhan.space/api/sendText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': import.meta.env.VITE_WAHA_API_KEY || 'Americanhairline@123'
        },
        body: JSON.stringify({
          chatId: wahaPhoneId,
          reply_to: null,
          text: professionalMessage,
          linkPreview: true,
          linkPreviewHighQuality: false,
          session: import.meta.env.VITE_WAHA_SESSION || 'ahlaiteam'
        })
      })

      const responseText = await response.text()
      console.log('WhatsApp API Response Status:', response.status)
      console.log('WhatsApp API Response:', responseText)

      if (response.ok) {
        console.log('✅ WhatsApp message sent successfully')
      } else {
        console.error('❌ Failed to send WhatsApp message. Status:', response.status, 'Response:', responseText)
      }
    } catch (error) {
      console.error('❌ Error sending WhatsApp:', error.message, error)
    }
  }

  // Auto-redirect for 4-5 stars (satisfied customers)
  useEffect(() => {
    if (isSatisfied && !isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        window.location.href = getGoogleReviewLink()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSatisfied, isRedirecting])

  // Auto-redirect for 1-2 stars (unhappy customers) - send WhatsApp first
  useEffect(() => {
    if (isUnhappy && !isRedirecting && !messageSentRef.current) {
      messageSentRef.current = true
      // Send WhatsApp message immediately
      sendWhatsAppMessage(data.contact)
      
      // Redirect after 2 seconds
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        window.location.href = complaintLink
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isUnhappy, isRedirecting])

  const getGoogleReviewLink = () => {
    if (data.gender === 'male') {
      return 'https://www.google.com/search?gs_ssp=eJzj4tVP1zc0zDBPSc6pyEkyYLRSNagwTko1TzY3N01MSjM3MEoytjKoMEo1TzOztLRMSk4zMTFONvISTMxNLcpMTsxTyEjMLMrJzEsFABdAFnY&q=american+hairline&oq=amricna+hair&gs_lcrp=EgZjaHJvbWUqEggBEC4YDRivARjHARiABBiOBTIGCAAQRRg5MhIIARAuGA0YrwEYxwEYgAQYjgUyCQgCEAAYDRiABDIJCAMQABgNGIAEMgkIBBAuGA0YgAQyCQgFEAAYDRiABDIJCAYQABgNGIAEMgkIBxAAGA0YgAQyCQgIEAAYDRiABNIBCDU5NTJqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0x3be7c775abf702b3:0x2e7f6999bcf443c2,3,,,,'
    } else {
      return 'https://www.google.com/search?q=alchemane&oq=alchem&gs_lcrp=EgZjaHJvbWUqDwgAECMYJxjjAhiABBiKBTIPCAAQIxgnGOMCGIAEGIoFMhUIARAuGCcYrwEYxwEYgAQYigUYjgUyDwgCEC4YQxixAxiABBiKBTIPCAMQLhhDGLEDGIAEGIoFMgYIBBBFGDkyDQgFEC4YrwEYxwEYgAQyDAgGEAAYQxiABBiKBTINCAcQABiSAxiABBiKBTINCAgQABiSAxiABBiKBTIHCAkQABiPAtIBCDE0NzZqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0x3be7ced2ae1b4cb5:0xb6c46033f416e128,3,,,,'
    }
  }

  const complaintLink = 'https://script.google.com/a/macros/americanhairline.com/s/AKfycbyz99eOjBFgTcO6hckInwCepSvepOob_XBIpS4AKycnGoAw3D_-mO25kpcwZ--EnMf7/exec?page=customer&mode=complaint'

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
                We're redirecting you to leave a Google review...
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
              <h1 className="text-5xl font-bold text-navy mb-4">We're Sorry to Hear That</h1>
              <p className="text-xl text-gray-600 mb-2">Your ticket has been raised.</p>
              <p className="text-xl text-gray-600 mb-8">You will get a call within 24 hours.</p>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 mb-12 text-left rounded-lg shadow-hover">
                <p className="text-gray-700 text-base font-medium">
                  ✓ WhatsApp notification sent to your phone<br/>
                  ✓ Redirecting to complaint form in 2 seconds...
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
