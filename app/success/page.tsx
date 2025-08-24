"use client"
import { useSearchParams } from "next/navigation"
import type React from "react"
import { useEffect, useRef } from "react"
import { Suspense, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { slackNotifications } from "@/lib/slack-notifications"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
const stripePromise = loadStripe(publishableKey)

const FallbackPaymentForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("customerEmail") || ""
    }
    return ""
  })
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("customerName") || ""
    }
    return ""
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1RzmSwBP6nLFGEYdT04GsDOZ", // $397 upsell price ID
          email: email,
          name: name,
        }),
      })

      const responseData = await response.json()
      if (!response.ok) throw new Error(responseData.error || "Failed to create payment intent")

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error("Card element not found")

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(responseData.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: name, email: email },
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
      } else if (paymentIntent?.status === "succeeded") {
        sessionStorage.setItem("customerName", name)
        sessionStorage.setItem("customerEmail", email)

        try {
          if (email) {
            await fetch("/api/update-customer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email,
                companyName: name, // Send full name as CompanyName
                upsell3: true,
              }),
            })
          }
        } catch (apiError) {
          console.error("Failed to update external API:", apiError)
        }

        const successUrl = `/success-1?session_id=${paymentIntent.id}&customer_id=${responseData.customerId}&price_id=${responseData.priceId}`
        window.location.href = successUrl
      }
    } catch (err: any) {
      setError(err.message || "Payment failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border">
      <h3 className="text-xl font-bold text-center mb-4">Complete Your Payment</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
          <div className="border border-gray-300 rounded-lg p-3 bg-white">
            <CardElement />
          </div>
        </div>
        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Pay $397 for Full Implementation"}
        </button>
      </form>
    </div>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const customerId = searchParams.get("customer_id")
  const priceId = searchParams.get("price_id")
  const urlFullName = searchParams.get("fullname")
  const urlEmail = searchParams.get("email")
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    if (urlFullName) {
      sessionStorage.setItem("customerName", urlFullName)
    }
    if (urlEmail) {
      sessionStorage.setItem("customerEmail", urlEmail)
    }
  }, [urlFullName, urlEmail])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(true)
      window.removeEventListener("scroll", handleScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    console.log("[v0] Setting up video intersection observer")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasScrolled) {
            console.log("[v0] Video is visible and user has scrolled, attempting to play")
            video.play().catch((error) => {
              console.log("[v0] Autoplay failed:", error)
            })
          } else if (!entry.isIntersecting) {
            console.log("[v0] Video is not visible, pausing")
            video.pause()
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    )

    observer.observe(video)
    console.log("[v0] Video observer attached")

    return () => {
      observer.disconnect()
    }
  }, [hasScrolled])

  const handleUpsellAccept = async () => {
    console.log("[v0] User accepted $397 upsell")
    setIsProcessing(true)

    try {
      if (!sessionId) {
        alert("Unable to process upsell - no session information available. Please contact support.")
        setIsProcessing(false)
        return
      }

      const response = await fetch("/api/upsell-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          priceId: "price_1RzmSwBP6nLFGEYdT04GsDOZ", // $397 upsell price ID
        }),
      })

      const result = await response.json()

      if (result.success) {
        let customerEmail = sessionStorage.getItem("customerEmail") || urlEmail
        let customerName = sessionStorage.getItem("customerName") || urlFullName

        if (!customerName || !customerEmail) {
          const urlParams = new URLSearchParams(window.location.search)
          customerEmail = customerEmail || urlParams.get("customer_email") || urlParams.get("email")
          customerName = customerName || urlParams.get("customer_name") || urlParams.get("name")

          if (customerName) sessionStorage.setItem("customerName", customerName)
          if (customerEmail) sessionStorage.setItem("customerEmail", customerEmail)
        }

        await slackNotifications.successPageUpsell(
          customerName || "Unknown Customer",
          customerEmail || "Unknown Email",
          "397",
        )

        try {
          if (customerEmail) {
            await fetch("/api/update-customer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: customerEmail,
                companyName: customerName, // Send full name as CompanyName
                upsell3: true, // User paid for upsell
              }),
            })
          } else {
            console.error("No email available for external API update")
          }
        } catch (apiError) {
          console.error("Failed to update external API:", apiError)
        }

        const params = new URLSearchParams({
          session_id: sessionId,
          ...(customerId && { customer_id: customerId }),
          ...(priceId && { price_id: priceId }),
        })
        window.location.href = `/success-1?${params.toString()}`
      } else {
        alert("Payment failed: " + result.error)
      }
    } catch (error) {
      console.error("Upsell payment error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpsellDecline = async () => {
    try {
      const customerEmail = sessionStorage.getItem("customerEmail") || urlEmail
      const customerName = sessionStorage.getItem("customerName") || urlFullName
      if (customerEmail) {
        await fetch("/api/update-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerEmail,
            companyName: customerName, // Send full name as CompanyName
            upsell3: false, // User skipped upsell
          }),
        })
      } else {
        console.error("No email available for external API update on decline")
      }
    } catch (apiError) {
      console.error("Failed to update external API:", apiError)
    }

    const params = new URLSearchParams({
      session_id: sessionId,
      ...(customerId && { customer_id: customerId }),
      ...(priceId && { price_id: priceId }),
    })
    window.location.href = `/success-1?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-600 text-white text-center py-3 text-lg font-semibold">
        Only Offered Once - Full Implementation for Only $397
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent leading-tight">
            WE WILL GET YOUR SYSTEM READY FOR YOU TO LOG IN AND PRESS "START" - ALL DONE FOR YOU.
          </h1>

          <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto mb-8">
            Uploading your leads, setting up your campaign sequence, spintax, and AB tests. Only $397 one-time to make
            sure it's done right.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="relative max-w-4xl w-full">
            <video
              ref={videoRef}
              controls
              muted
              preload="metadata"
              className="w-full rounded-lg shadow-2xl"
              poster="/cold-email-system-thumbnail.png"
            >
              <source src="https://www.evirtualassistants.com/videos/vv2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-6">🎁 JUMPSTART YOUR CAMPAIGN</div>
              <div className="text-xl md:text-2xl font-semibold mb-6 text-blue-100">With This Exclusive Bonus</div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-2xl font-bold mb-2">✅ Extra 10,000 Leads</div>
                  <div className="text-lg text-blue-100">Double your B2B lead capacity instantly</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-2xl font-bold mb-2">✅ Account Manager</div>
                  <div className="text-lg text-blue-100">Weekly campaign reviews for 1 month</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-2">
                  <span className="line-through text-gray-300">$499 Value</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-yellow-300">GET IT ALL FREE WITH THIS UPGRADE!</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
              What's Included?
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Double check your Instantly AI settings</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Create your campaign</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Upload your lead list</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Add your cold email copy & AB tests</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Add spintax to your cold email copy</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Remove / replace any spam words</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Cleaning your list of 20,000 B2B leads email</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Account manager reviewing your campaign weekly for 1 month</span>
              </div>

              <div className="flex items-center gap-4 text-lg text-black">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Everything on autopilot for 30 days, you only have to manage leads</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          {!sessionId ? (
            <Elements stripe={stripePromise}>
              <FallbackPaymentForm />
              <div className="mt-6">
                <button
                  onClick={() => (window.location.href = "/success-1")}
                  className="text-black hover:text-gray-700 font-semibold cursor-pointer bg-transparent border-none text-lg"
                >
                  ❌ I'm not interested in this offer, I prefer to do it myself
                </button>
              </div>
            </Elements>
          ) : (
            <>
              <button
                onClick={handleUpsellAccept}
                disabled={isProcessing || !sessionId}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-6 text-xl font-semibold rounded-full cursor-pointer disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl max-w-4xl w-full"
              >
                <div className="text-xl font-bold">
                  {isProcessing
                    ? "Processing..."
                    : "Pay a one-time fee for my team to fully prepare your cold email system"}
                </div>
                <div className="text-lg font-normal mt-2">
                  Yes, I want you to implement my entire system for $397 one-time
                </div>
              </button>

              <div>
                <button
                  onClick={handleUpsellDecline}
                  className="text-black hover:text-gray-700 font-semibold cursor-pointer bg-transparent border-none text-lg"
                >
                  ❌ I'm not interested in this offer, I prefer to do it myself
                </button>
              </div>
            </>
          )}
        </div>

        {sessionId && <p className="text-center text-sm text-gray-500 mt-8">Order ID: {sessionId}</p>}
      </div>

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

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
