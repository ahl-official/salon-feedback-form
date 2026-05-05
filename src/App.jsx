import { useState } from 'react'
import FeedbackForm from './components/FeedbackForm'
import SuccessScreen from './components/SuccessScreen'

export default function App() {
  const [submissionData, setSubmissionData] = useState(null)

  const handleFormSubmit = (data) => {
    setSubmissionData(data)
  }

  const handleReset = () => {
    setSubmissionData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-lighter relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {!submissionData ? (
          <FeedbackForm onSubmit={handleFormSubmit} />
        ) : (
          <SuccessScreen data={submissionData} onReset={handleReset} />
        )}
      </div>
    </div>
  )
}
