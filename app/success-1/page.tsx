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

const FallbackPaymentForm = ({
  initialName = "",
  initialEmail = "",
}: { initialName?: string; initialEmail?: string }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState(() => {
    if (initialEmail) return initialEmail
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("customerEmail") || ""
    }
    return ""
  })
  const [name, setName] = useState(() => {
    if (initialName) return initialName
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("customerName") || ""
    }
    return ""
  })

  useEffect(() => {
    if (initialName && initialName !== name) {
      setName(initialName)
    }
    if (initialEmail && initialEmail !== email) {
      setEmail(initialEmail)
    }
  }, [initialName, initialEmail])

  useEffect(() => {
    const updateFromSession = () => {
      if (!initialName && !initialEmail) {
        const sessionName = sessionStorage.getItem("customerName")
        const sessionEmail = sessionStorage.getItem("customerEmail")

        if (sessionName && sessionName !== name) {
          setName(sessionName)
        }
        if (sessionEmail && sessionEmail !== email) {
          setEmail(sessionEmail)
        }
      }
    }

    updateFromSession()
    window.addEventListener("storage", updateFromSession)

    return () => {
      window.removeEventListener("storage", updateFromSession)
    }
  }, [name, email, initialName, initialEmail])

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
          priceId: "price_1RzmT4BP6nLFGEYdrbQ3mxlc", // $1199 upsell price ID
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
          await fetch("/api/update-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              emailName: name, // Fixed field mapping: full name goes to emailName parameter
              upsell4: true,
            }),
          })
        } catch (apiError) {
          console.error("External API call failed:", apiError)
        }

        const successUrl = `/success-2?session_id=${paymentIntent.id}&customer_id=${responseData.customerId}&price_id=${responseData.priceId}`
        window.location.href = successUrl
      }
    } catch (err: any) {
      setError(err.message || "Payment failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border">
      <div className="text-center mb-4">
        <div className="text-2xl font-bold text-red-600 line-through">$2,000</div>
        <div className="text-3xl font-bold text-green-600">NOW ONLY $1,199</div>
        <div className="text-sm text-gray-600 mt-2">Limited Time - Volume Client Pricing</div>
      </div>
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
          {isLoading ? "Processing..." : "Pay $1,199 for Full Implementation"}
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
    console.log("[v0] User accepted $1,199 upsell")
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
          priceId: "price_1RzmT4BP6nLFGEYdrbQ3mxlc", // $1199 upsell price ID
        }),
      })

      const result = await response.json()

      if (result.success) {
        const existingName = sessionStorage.getItem("customerName")
        const existingEmail = sessionStorage.getItem("customerEmail")

        if (!existingName || !existingEmail) {
          const urlParams = new URLSearchParams(window.location.search)
          const customerEmail = urlParams.get("customer_email") || urlParams.get("email")
          const customerName = urlParams.get("customer_name") || urlParams.get("name")

          if (customerName) sessionStorage.setItem("customerName", customerName)
          if (customerEmail) sessionStorage.setItem("customerEmail", customerEmail)
        }

        const finalName = existingName || sessionStorage.getItem("customerName") || "Unknown Customer"
        const finalEmail = existingEmail || sessionStorage.getItem("customerEmail")

        if (finalEmail) {
          try {
            await fetch("/api/update-customer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: finalEmail,
                emailName: finalName, // Fixed field mapping: full name goes to emailName parameter
                upsell4: true,
              }),
            })
          } catch (apiError) {
            console.error("External API call failed:", apiError)
          }
        }

        await slackNotifications.success1Upsell(finalName, finalEmail || "Unknown Email", "1199")

        const params = new URLSearchParams({
          session_id: sessionId,
          ...(customerId && { customer_id: customerId }),
          ...(priceId && { price_id: priceId }),
        })
        window.location.href = `/success-2?${params.toString()}`
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
    const customerName = sessionStorage.getItem("customerName") || "Unknown Customer"
    const customerEmail = sessionStorage.getItem("customerEmail")

    if (customerEmail) {
      try {
        await fetch("/api/update-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerEmail,
            emailName: customerName, // Fixed field mapping: full name goes to emailName parameter
            upsell4: false,
          }),
        })
      } catch (apiError) {
        console.error("External API call failed:", apiError)
      }
    }

    const params = new URLSearchParams({
      session_id: sessionId,
      ...(customerId && { customer_id: customerId }),
      ...(priceId && { price_id: priceId }),
    })
    window.location.href = `/success-2?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-600 text-white text-center py-3 text-lg font-semibold">
        🔥 THIS OFFER IS LIMITED AS WE CAN ONLY TAKE 10 NEW CLIENTS PER MONTH!
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white text-center py-4 text-xl font-bold">
        USUALLY $2,000 - NOW ONLY $1,199 | USUALLY RESERVED FOR HIGH VOLUME CLIENTS OR HIGH TICKET CLIENTS
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent leading-tight">
            WE WILL COMPLETELY TAKE CARE OF YOUR ACCOUNT FOR 3 MONTHS. 100% MANAGED BY OUR TEAM - YOU MANAGE YOUR LEADS
          </h1>

          <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto mb-8">
            That's right you don't have to manage any of the tech or copywriting or email optimization you only have to
            focus on converting your leads!
          </p>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 max-w-4xl mx-auto mb-8">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              🏆 THE BEST OPTION TO RECEIVE RETURN ON INVESTMENT USING A COLD EMAIL SYSTEM
            </div>
            <div className="text-base text-gray-700">
              ✅ 5 Years of Experience Doing Cold Email
              <br />✅ Sent Over 25 Million Emails
              <br />✅ Proven Track Record with Volume Clients
            </div>
          </div>
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
              <source src="https://www.evirtualassistants.com/videos/vv3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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
                <span>100% manage cold email system</span>
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
                <span>A full team dedicated to your success</span>
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
                <span>We will take care of all aspect of the cold email system</span>
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
                <span>Optimizing campaigns every day</span>
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
                <span>Dedicated account manager</span>
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
                <span>Everything on autopilot for 3 months</span>
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
                <span>You only have to manage leads</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          {!sessionId ? (
            <Elements stripe={stripePromise}>
              <FallbackPaymentForm initialName={urlFullName || ""} initialEmail={urlEmail || ""} />
              <div className="mt-6">
                <button
                  onClick={() => (window.location.href = "/success-2")}
                  className="text-black hover:text-gray-700 font-semibold cursor-pointer bg-transparent border-none text-lg"
                >
                  ❌ I'm not interested in this offer, I prefer to do it myself
                </button>
              </div>
            </Elements>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-red-600 line-through">Usually $2,000</div>
                <div className="text-4xl font-bold text-green-600">NOW ONLY $1,199</div>
                <div className="text-lg text-gray-600 mt-2">Volume Client Exclusive Pricing</div>
              </div>

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
                  Yes, I want you to implement my entire system for $1,199 one-time
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
