"use client"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-blue-500">Let's Thrive Together!</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your cold email system setup is now in motion. We've received all your information and our team is ready to
            get you results.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Setup Successfully Submitted!</h2>
            </div>

            <div className="space-y-6 text-gray-700">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">What Happens Next?</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Your information has been sent to our dedicated team
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    We'll follow up with emails on each step of the process
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    Your cold email system will be built according to your specifications
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">✓</span>
                    You'll receive detailed updates throughout the setup process
                  </li>
                </ul>
              </div>

              <div className="text-center py-8">
                <p className="text-lg mb-4">
                  <strong>Thank You For Your Trust!</strong>
                </p>
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Our team is dedicated to making sure you succeed with cold emailing. We understand that your success
                  is our success, and we're committed to delivering results that exceed your expectations.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help or Have Questions?</h3>
                <p className="text-gray-600 mb-4">
                  You can email us at any time with any questions or concerns. We're here to help!
                </p>
                <a
                  href="mailto:support@evirtualassistants.com"
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Support
                </a>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-gray-500">
                  Expected setup time: 3-5 business days | Priority setup: 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200 text-black text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-600">
            <a href="/privacy" className="hover:underline text-blue-600">
              Privacy Policy
            </a>{" "}
            /{" "}
            <a href="/terms" className="hover:underline text-blue-600">
              Terms and Conditions
            </a>
          </p>
          <div className="text-sm mt-2 text-gray-600 space-y-1">
            <p>eVirtualAssistants LLC</p>
            <p>4801 Lang Ave NE, Ste 110-1088</p>
            <p>Albuquerque, NM 87109</p>
            <p>Email: support@evirtualassistants.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
