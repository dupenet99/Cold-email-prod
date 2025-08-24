"use client"

import type React from "react"
import { slackNotifications } from "@/lib/slack-notifications"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!

if (!publishableKey || !publishableKey.startsWith("pk_")) {
  throw new Error(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is required and must be a valid Stripe publishable key",
  )
}

console.log("[v0] Using Stripe publishable key:", publishableKey.substring(0, 20) + "...")
console.log("[v0] Key length:", publishableKey.length)

const stripePromise = loadStripe(publishableKey)

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [premiumLeads, setPremiumLeads] = useState(true)
  const [prioritySetup, setPrioritySetup] = useState(true)

  const getPriceId = () => {
    if (premiumLeads && prioritySetup) {
      return "price_1RzmStBP6nLFGEYdbqAMvxv6" // Base + Both upsells
    } else if (prioritySetup && !premiumLeads) {
      return "price_1RzmSlBP6nLFGEYdqPA5LaId" // Base + Priority Setup only
    } else if (premiumLeads && !prioritySetup) {
      return "price_1RzmSqBP6nLFGEYd6cuAiNrJ" // Base + Premium Leads only
    } else {
      return "price_1RzmShBP6nLFGEYdNa1nn9vp" // Base only
    }
  }

  const calculateTotal = () => {
    let total = 97.0 // Base price
    if (premiumLeads) total += 77.0
    if (prioritySetup) total += 69.0
    return total
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions to continue.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting payment process...")
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: getPriceId(),
          email: email,
          name: name,
          upsells: {
            premiumLeads,
            prioritySetup,
          },
        }),
      })

      console.log("[v0] API response status:", response.status)
      const responseData = await response.json()
      console.log("[v0] API response data:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create payment intent")
      }

      const { clientSecret } = responseData

      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      console.log("[v0] Confirming card payment...")
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email,
          },
        },
      })

      if (stripeError) {
        console.error("[v0] Stripe error:", stripeError)
        setError(stripeError.message || "Payment failed")
      } else if (paymentIntent?.status === "succeeded") {
        console.log("[v0] Payment succeeded!")

        const upsellLevel = (premiumLeads ? 1 : 0) + (prioritySetup ? 1 : 0)
        await slackNotifications.homepagePayment(
          name || "Unknown Customer",
          email || "Unknown Email",
          "97",
          upsellLevel,
          calculateTotal().toFixed(2),
        )

        try {
          await fetch("/api/update-customer", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              companyName: name,
              upsell1: premiumLeads,
              upsell2: prioritySetup,
            }),
          })
        } catch (error) {
          console.error("[v0] Failed to update customer info:", error)
          // Don't block the user flow if this fails
        }

        sessionStorage.setItem("customerName", name)
        sessionStorage.setItem("customerEmail", email)
        const successUrl = `/success?session_id=${paymentIntent.id}&customer_id=${responseData.customerId}&price_id=${responseData.priceId}`
        window.location.href = successUrl
      }
    } catch (err: any) {
      console.error("[v0] Payment error:", err)
      setError(err.message || "Payment failed")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 Upgrade Your Package</h3>

          <div className="space-y-3">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={premiumLeads}
                onChange={(e) => setPremiumLeads(e.target.checked)}
                className="mr-3 mt-1 w-4 h-4 text-blue-600 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Premium Lead Lists</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 line-through">$110</span>
                    <span className="ml-2 font-bold text-blue-600">$77</span>
                    <span className="ml-1 text-xs bg-red-500 text-white px-2 py-1 rounded">30% OFF</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Upgrade from 10K to 20K B2B leads in your industry</p>
              </div>
            </label>

            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={prioritySetup}
                onChange={(e) => setPrioritySetup(e.target.checked)}
                className="mr-3 mt-1 w-4 h-4 text-blue-600 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Priority Setup</span>
                  <span className="font-bold text-blue-600">$69</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Get your system live within 24 hours instead of 3-5 business days
                </p>
              </div>
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Cold Email System:</span>
                <span className="text-gray-900">$97.00</span>
              </div>
              {premiumLeads && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Premium Lead Lists:</span>
                  <span className="text-gray-900">$77.00</span>
                </div>
              )}
              {prioritySetup && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Priority Setup:</span>
                  <span className="text-gray-900">$69.00</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#fa755a",
                    iconColor: "#fa755a",
                  },
                },
                hidePostalCode: false,
              }}
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-3 mt-1 w-4 h-4 text-blue-600 cursor-pointer"
              required
            />
            <span className="text-sm text-gray-700 leading-relaxed">
              I understand and agree to the{" "}
              <a href="/terms" className="text-blue-600 hover:underline font-medium">
                Terms and Conditions
              </a>
            </span>
          </label>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading || !termsAccepted}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "PROCESSING..." : `YES, BUILD ME A COLD EMAIL SYSTEM FOR $${calculateTotal().toFixed(2)}`}
      </button>

      <div className="flex flex-col items-center space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">100% Secure Payment</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">VISA</div>
          <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
          <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">DISC</div>
        </div>

        <p className="text-sm text-gray-600 text-center mt-3">
          After payment, you will be redirected to the setup page.
        </p>
      </div>
    </form>
  )
}

export default function StripePaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
