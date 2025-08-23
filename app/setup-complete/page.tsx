"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SetupCompletePage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const type = searchParams.get("type")
  const mailboxes = searchParams.get("mailboxes")

  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // Here you could verify the session with your API if needed
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">Cold Email System</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-black mb-4">Setup Payment Successful!</h1>
          <p className="text-xl text-gray-700 mb-8">
            Your cold email system setup has been initiated. Our team will begin configuring your infrastructure
            immediately.
          </p>
        </div>

        {/* Setup Progress */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">What's Being Set Up</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-black">Domains & Infrastructure</h3>
              </div>
              <p className="text-gray-600">Domain setup and DNS configuration in progress</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-black">Mailbox Setup</h3>
              </div>
              <p className="text-gray-600">{mailboxes || "Multiple"} mailboxes being configured</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-xs">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">Immediate Setup (0-2 hours)</h3>
                <p className="text-gray-600">Domain configuration and mailbox creation begins</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-xs">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">System Ready (24-48 hours)</h3>
                <p className="text-gray-600">Login credentials and system access delivered</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-xs">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">Account Manager Contact</h3>
                <p className="text-gray-600">Personal onboarding call within 2 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Questions about your setup?</p>
          <a
            href="mailto:support@evirtualassistants.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contact Support Team
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-4">
            <p className="text-gray-300">eVirtualAssistants LLC</p>
            <p className="text-gray-300">4801 Lang Ave NE, Ste 110-1088</p>
            <p className="text-gray-300">Albuquerque, NM 87109</p>
            <p className="text-gray-300">Email: support@evirtualassistants.com</p>
          </div>
          <div className="flex justify-center space-x-6">
            <a href="/privacy" className="text-gray-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-300 hover:text-white">
              Terms & Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
