"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CalculatorPage() {
  const [emailsPerMonth, setEmailsPerMonth] = useState(1000)

  // Calculate mailboxes needed (1.6 per 1000 emails, rounded up)
  const mailboxesNeeded = Math.ceil((emailsPerMonth / 1000) * 1.6)

  // Calculate domains needed (1 domain per 3 mailboxes, rounded up)
  const domainsNeeded = Math.ceil(mailboxesNeeded / 3)

  // Generate dropdown options from 1,000 to 300,000
  const emailOptions = []
  for (let i = 1000; i <= 300000; i += 1000) {
    emailOptions.push(i)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ybHbXDCwZHw6qKxMIXYIghncTFtKTU.png"
            alt="eVirtualAssistants"
            className="h-8"
          />
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-400 hover:text-blue-300 underline text-sm">
              Back to Home
            </a>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            <span className="text-blue-600">Let's Set Up Your</span>
            <br />
            <span className="text-black">Cold Email System</span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed">
            It's really important to understand the scaling mechanism of cold email. We have built this calculator to
            help you understand exactly what you need for your desired email volume.
          </p>

          {/* Calculator Container */}
          <div className="max-w-2xl mx-auto bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-8">Cold Email System Calculator</h2>

            {/* Email Volume Selector */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-blue-800 mb-4">
                How many emails do you want to send per month?
              </label>
              <select
                value={emailsPerMonth}
                onChange={(e) => setEmailsPerMonth(Number(e.target.value))}
                className="w-full p-4 text-lg border-2 border-blue-300 rounded-lg bg-white text-black focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                {emailOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.toLocaleString()} emails per month
                  </option>
                ))}
              </select>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mailboxes Required */}
              <div className="bg-white p-6 rounded-lg border border-blue-300">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Mailboxes Required</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">{mailboxesNeeded}</div>
                <p className="text-sm text-gray-600">Based on 1.6 mailboxes per 1,000 emails</p>
              </div>

              {/* Domains Required */}
              <div className="bg-white p-6 rounded-lg border border-blue-300">
                <h3 className="text-lg font-bold text-blue-800 mb-2">Domains Required</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">{domainsNeeded}</div>
                <p className="text-sm text-gray-600">Based on 1 domain per 3 mailboxes</p>
              </div>
            </div>

            {/* Monthly Cost Breakdown */}
            <div className="mt-8 bg-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Estimated Monthly Costs</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span>Instantly.ai Platform:</span>
                  <span className="font-semibold">$37/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Mailboxes ({mailboxesNeeded} × $4):</span>
                  <span className="font-semibold">${mailboxesNeeded * 4}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Domains ({domainsNeeded} × $1/mo):</span>
                  <span className="font-semibold">${domainsNeeded}/mo</span>
                </div>
                <hr className="border-blue-300" />
                <div className="flex justify-between text-lg font-bold text-blue-800">
                  <span>Total Monthly Cost:</span>
                  <span>${37 + mailboxesNeeded * 4 + domainsNeeded}/mo</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-bold cursor-pointer"
              >
                Get My System Set Up For $97
              </Button>
              <p className="text-sm text-gray-600 mt-4">One-time setup fee + monthly operational costs above</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-800 mb-6">Why These Numbers Matter</h3>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-3">Mailbox Distribution</h4>
                <p className="text-gray-700">
                  We spread your emails across multiple mailboxes to maintain high deliverability and avoid spam
                  filters.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-3">Domain Strategy</h4>
                <p className="text-gray-700">
                  Multiple domains protect your main business domain and increase overall campaign success rates.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-700 mb-3">Scaling Safely</h4>
                <p className="text-gray-700">
                  Our ratios ensure you can scale your outreach without compromising deliverability or reputation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
