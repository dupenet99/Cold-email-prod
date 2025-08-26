"use client"

import type React from "react"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
const stripePromise = loadStripe(publishableKey)

const FallbackPaymentForm = ({
  domainsNeeded,
  mailboxesNeeded,
  totalCost,
  urlFullName,
  urlEmail,
}: {
  domainsNeeded: number
  mailboxesNeeded: number
  totalCost: number
  urlFullName?: string | null
  urlEmail?: string | null
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return urlEmail || sessionStorage.getItem("customerEmail") || ""
    }
    return urlEmail || ""
  })
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return urlFullName || sessionStorage.getItem("customerName") || ""
    }
    return urlFullName || ""
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) throw new Error("Card element not found")

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: name, email: email },
      })

      if (pmError) {
        setError(pmError.message || "Failed to create payment method")
        setIsLoading(false)
        return
      }

      // Create customer with payment method
      const customerResponse = await fetch("/api/create-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: name,
          paymentMethodId: paymentMethod.id,
        }),
      })

      const customerData = await customerResponse.json()
      if (!customerResponse.ok) throw new Error(customerData.error || "Failed to create customer")

      // Use upsell-payment API for separate domain and mailbox transactions
      const response = await fetch("/api/upsell-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: `customer_${customerData.customerId}`, // Use customer ID as session identifier
          domainPriceId: "price_1RzmT0BP6nLFGEYdILSwoA9C", // Domain price ID (one-time)
          domainQuantity: domainsNeeded,
          mailboxPriceId: "price_1RzmT2BP6nLFGEYdvkzNSpKW", // Mailbox price ID (subscription)
          mailboxQuantity: mailboxesNeeded,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Payment failed")

      if (result.success) {
        sessionStorage.setItem("customerName", name)
        sessionStorage.setItem("customerEmail", email)

        try {
          await fetch("/api/update-customer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              emailName: name, // Fixed field mapping: full name goes to emailName parameter
              nbrMailboxes: mailboxesNeeded,
              nbrDomains: domainsNeeded,
            }),
          })
        } catch (apiError) {
          console.error("External API call failed:", apiError)
          // Don't block the user flow if external API fails
        }

        const successUrl = `/success-3?session_id=${result.domainPaymentIntent}&customer_id=${customerData.customerId}&subscription_id=${result.subscription}`
        window.location.href = successUrl
      } else {
        setError(result.error || "Payment failed")
      }
    } catch (err: any) {
      setError(err.message || "Payment failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border">
      <h3 className="text-xl font-bold text-center mb-4">Complete Your Payment</h3>
      <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="flex justify-between">
          <span>Domains ({domainsNeeded}):</span>
          <span>${domainsNeeded * 12}</span>
        </div>
        <div className="flex justify-between">
          <span>Mailboxes ({mailboxesNeeded}):</span>
          <span>${mailboxesNeeded * 4}/month</span>
        </div>
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${totalCost}</span>
        </div>
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Processing..." : `Set Up System - $${domainsNeeded * 12} + $${mailboxesNeeded * 4}/mo`}
        </button>
      </form>
    </div>
  )
}

function Success2Content() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const customerId = searchParams.get("customer_id")
  const priceId = searchParams.get("price_id")
  const urlFullName = searchParams.get("fullname")
  const urlEmail = searchParams.get("email")

  const [emailsPerMonth, setEmailsPerMonth] = useState(10000)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (urlFullName) {
      sessionStorage.setItem("customerName", urlFullName)
    }
    if (urlEmail) {
      sessionStorage.setItem("customerEmail", urlEmail)
    }
  }, [urlFullName, urlEmail])

  const mailboxesNeeded = Math.ceil((emailsPerMonth / 1000) * 1.6)
  const domainsNeeded = Math.ceil(mailboxesNeeded / 3)

  const monthlyRecurring = mailboxesNeeded * 4
  const oneTimeSetup = domainsNeeded * 12
  const totalCost = monthlyRecurring + oneTimeSetup

  const estimatedReplies = Math.round(emailsPerMonth * 0.04)

  const emailOptions = []
  for (let i = 10000; i <= 100000; i += 1000) {
    emailOptions.push(i)
  }

  const handlePayment = async () => {
    if (!sessionId) {
      alert("Unable to process payment - no session information available. Please contact support.")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/upsell-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          domainPriceId: "price_1RzmT0BP6nLFGEYdILSwoA9C", // Domain price ID (one-time)
          domainQuantity: domainsNeeded,
          mailboxPriceId: "price_1RzmT2BP6nLFGEYdvkzNSpKW", // Mailbox price ID (subscription)
          mailboxQuantity: mailboxesNeeded,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const urlParams = new URLSearchParams(window.location.search)
        const customerEmail = urlParams.get("email") || sessionStorage.getItem("customerEmail")
        const customerName = urlParams.get("name") || sessionStorage.getItem("customerName")

        if (customerEmail) sessionStorage.setItem("customerEmail", customerEmail)
        if (customerName) sessionStorage.setItem("customerName", customerName)

        if (customerEmail) {
          try {
            await fetch("/api/update-customer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: customerEmail,
                emailName: customerName, // Fixed field mapping: full name goes to emailName parameter
                nbrMailboxes: mailboxesNeeded,
                nbrDomains: domainsNeeded,
              }),
            })
          } catch (apiError) {
            console.error("External API call failed:", apiError)
            // Don't block the user flow if external API fails
          }
        }

        const params = new URLSearchParams({
          session_id: sessionId,
          ...(customerId && { customer_id: customerId }),
          ...(priceId && { price_id: priceId }),
        })
        window.location.href = `/success-3?${params.toString()}`
      } else {
        setIsProcessing(false)
        alert("Payment failed: " + result.error)
        return
      }
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
      alert("Payment failed. Please try again.")
      return
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Let's Set Up Your <span className="text-blue-500">Cold Email System</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            It's really important to understand the scaling mechanism of cold email. We have built this calculator to
            help you understand the requirements for your desired email volume.
          </p>
        </div>
      </div>

      <div className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-lg font-semibold text-gray-600">
            Setting up account <span className="text-blue-600">1 of 2</span>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-black mb-8">Cold Email System Calculator</h2>

            {/* Email Volume Selector */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-black mb-4">
                How many emails do you want to send per month?
              </label>
              <select
                value={emailsPerMonth}
                onChange={(e) => setEmailsPerMonth(Number(e.target.value))}
                className="w-full p-4 border-2 border-blue-200 rounded-lg text-lg font-medium focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                {emailOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.toLocaleString()} emails per month
                  </option>
                ))}
              </select>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Mailboxes Required */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{mailboxesNeeded}</div>
                <div className="text-lg font-semibold text-black mb-2">Mailboxes Required</div>
                <div className="text-sm text-gray-600">Based on sending 30 per day emails per account Mon to Fri</div>
              </div>

              {/* Domains Required */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{domainsNeeded}</div>
                <div className="text-lg font-semibold text-black mb-2">Domains Required</div>
                <div className="text-sm text-gray-600">Based on 1 domain per 3 mailboxes</div>
              </div>
            </div>

            {/* Estimated Replies Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Estimated Replies</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">{estimatedReplies.toLocaleString()}</div>
              <div className="text-lg text-gray-700 mb-2">Expected replies per month</div>
              <div className="text-sm text-gray-600">* This can vary on type of audience</div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-black mb-4 text-center">Cost Breakdown</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold text-black mb-2">Monthly Recurring</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${(mailboxesNeeded * 4).toLocaleString()}/month
                  </div>
                  <div className="text-sm text-gray-600">Mailboxes: {mailboxesNeeded} × $4/month</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-black mb-2">One-Time Setup</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">${(domainsNeeded * 12).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Domains: {domainsNeeded} × $12/year</div>
                </div>
              </div>
            </div>

            {/* Total to Pay Section */}
            {!sessionId ? (
              <div className="py-8">
                <Elements stripe={stripePromise}>
                  <FallbackPaymentForm
                    domainsNeeded={domainsNeeded}
                    mailboxesNeeded={mailboxesNeeded}
                    totalCost={totalCost}
                    urlFullName={urlFullName}
                    urlEmail={urlEmail}
                  />
                </Elements>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-lg p-8 text-center text-white mb-8">
                <h3 className="text-3xl font-bold mb-4">Total to Pay Right Now</h3>
                <div className="text-6xl font-bold mb-4">${totalCost.toLocaleString()}</div>
                <div className="text-lg mb-6 opacity-90">
                  Includes: ${monthlyRecurring}/month mailboxes + ${oneTimeSetup} domain setup
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !sessionId}
                  className="bg-white text-green-600 px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Pay Now & Set Up My System"}
                </button>
                <p className="text-sm mt-4 opacity-80">Secure payment using your saved payment method</p>
              </div>
            )}

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Why These Numbers Matter</h3>
              <ul className="text-gray-700 space-y-2">
                <li>
                  • <strong>Optimal Volume:</strong> For best results, our clients send 30,000 emails per month to
                  really feel abundance in leads
                </li>
                <li>
                  • <strong>Mailbox Ratio:</strong> Based on sending 30 per day emails per account Mon to Fri for
                  optimal deliverability
                </li>
                <li>
                  • <strong>Spam Prevention:</strong> Sending 30 emails per account keeps us under the radar for spam
                  filters
                </li>
                <li>
                  • <strong>Optimal Timing:</strong> Sending Monday to Friday within work hours is optimal for spam-free
                  campaigns
                </li>
                <li>
                  • <strong>Domain Distribution:</strong> Multiple domains prevent spam filtering and protect your
                  reputation
                </li>
                <li>
                  • <strong>Volume Management:</strong> Proper scaling prevents your emails from being marked as spam
                </li>
                <li>
                  • <strong>Cost Efficiency:</strong> Understanding costs helps you plan your cold email budget
                  effectively
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {sessionId && <p className="text-center text-sm text-gray-500 mt-8">Order ID: {sessionId}</p>}

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

export default function Success2Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Success2Content />
    </Suspense>
  )
}
