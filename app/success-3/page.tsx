"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { slackNotifications } from "@/lib/slack-notifications"

export default function Success3Page() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    companyLinks: "",
    salesPitch: "",
    clientAvatar: "",
    leadListOption: "build",
    emailName: "",
    sendingDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    sendingTimeFrom: "09:00",
    sendingTimeTo: "17:00",
    leadRedirection: "",
    agreement: false,
  })

  const [companyEmail, setCompanyEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [hasSessionData, setHasSessionData] = useState(false)

  useEffect(() => {
    // Try to get data from URL parameters first
    const urlParams = new URLSearchParams(window.location.search)
    const emailFromUrl = urlParams.get("email")
    const nameFromUrl = urlParams.get("name") || urlParams.get("fullname")

    let foundSessionData = false

    if (emailFromUrl) {
      setCompanyEmail(emailFromUrl)
      sessionStorage.setItem("customerEmail", emailFromUrl)
      foundSessionData = true
    } else {
      const emailFromSession = sessionStorage.getItem("customerEmail")
      if (emailFromSession) {
        setCompanyEmail(emailFromSession)
        foundSessionData = true
      }
    }

    if (nameFromUrl) {
      setFullName(nameFromUrl)
      sessionStorage.setItem("customerName", nameFromUrl)
      foundSessionData = true
    } else {
      const nameFromSession = sessionStorage.getItem("customerName")
      if (nameFromSession) {
        setFullName(nameFromSession)
        foundSessionData = true
      }
    }

    setHasSessionData(foundSessionData)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      if (name.startsWith("day_")) {
        const day = name.replace("day_", "")
        setFormData((prev) => ({
          ...prev,
          sendingDays: { ...prev.sendingDays, [day]: checked },
        }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }))
      }
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const submissionData = {
      ...formData,
      companyEmail: companyEmail,
      fullName: fullName,
    }

    console.log("[v0] Form submitted with email and name:", submissionData)

    try {
      if (companyEmail) {
        const apiResponse = await fetch("/api/update-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: companyEmail,
            name: fullName,
            companyName: formData.companyName,
            companyDescription: formData.companyDescription,
            companyLinks: formData.companyLinks,
            salesPitch: formData.salesPitch,
            clientAvatar: formData.clientAvatar,
            leadListOption: formData.leadListOption,
            emailName: formData.emailName,
            sendingMonday: formData.sendingDays.monday,
            sendingTuesday: formData.sendingDays.tuesday,
            sendingWednesday: formData.sendingDays.wednesday,
            sendingThursday: formData.sendingDays.thursday,
            sendingFriday: formData.sendingDays.friday,
            sendingSaturday: formData.sendingDays.saturday,
            sendingSunday: formData.sendingDays.sunday,
            sendingTimeFrom: formData.sendingTimeFrom,
            sendingTimeTo: formData.sendingTimeTo,
            leadRedirection: formData.leadRedirection,
          }),
        })

        if (!apiResponse.ok) {
          console.error("[v0] External API call failed:", await apiResponse.text())
        } else {
          console.log("[v0] External API call successful")
        }
      }

      await slackNotifications.success3Completion(fullName || "Unknown Customer", companyEmail || "Unknown Email")

      // Redirect to thank you page after successful submission
      window.location.href = "/thank-you"
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      alert("There was an error submitting the form. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            We Need Information About <span className="text-blue-500">Your Business</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Let's learn more about your company and your needs so we can craft the best email strategy for you to get
            the maximum leads.
          </p>
        </div>
      </div>

      <div className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-lg font-semibold text-gray-600">
            Setting up account <span className="text-blue-600">2 of 2</span>
          </div>
        </div>
      </div>

      {/* Form Section - Comprehensive business information form */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-black mb-8">Business Information Form</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              <input type="hidden" name="companyEmail" value={companyEmail} />
              <input type="hidden" name="fullName" value={fullName} />

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={hasSessionData}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    hasSessionData ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  disabled={hasSessionData}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    hasSessionData ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Company Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Company Description *</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what your company does..."
                />
              </div>

              {/* Company Links */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Company Links</label>
                <textarea
                  name="companyLinks"
                  value={formData.companyLinks}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Website, blog, social links, LinkedIn, etc. (one per line)"
                />
              </div>

              {/* Sales Pitch */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Business Sales Pitch *</label>
                <textarea
                  name="salesPitch"
                  value={formData.salesPitch}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example: My business is a [company type] who can help you with [problem you solve] through [unique method or proposition]"
                />
              </div>

              {/* Client Avatar */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">Who is your Client Avatar? *</label>
                <textarea
                  name="clientAvatar"
                  value={formData.clientAvatar}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Example: My ideal client is a [job title] in the [industry] in [company type] in [country] and most of my clients make between [$X-$Y] and the number of employees [X-Y]"
                />
              </div>

              {/* Lead List Option */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-4">Email List Option *</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="leadListOption"
                      value="build"
                      checked={formData.leadListOption === "build"}
                      onChange={handleInputChange}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">I want to build my leads email list with this information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="leadListOption"
                      value="have"
                      checked={formData.leadListOption === "have"}
                      onChange={handleInputChange}
                      className="mr-3 w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">I already have my email leads list</span>
                  </label>
                </div>
              </div>

              {/* Email Options */}
              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Email Options</h3>

                {/* Generic Name */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-700 mb-2">Generic Name on Cold Email *</label>
                  <input
                    type="text"
                    name="emailName"
                    value={formData.emailName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John, Sarah, Marketing Team"
                  />
                </div>

                {/* Sending Days */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Which days do you want to send emails? *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(formData.sendingDays).map(([day, checked]) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          name={`day_${day}`}
                          checked={checked}
                          onChange={handleInputChange}
                          className="mr-2 w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700 capitalize">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sending Time */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">Sending Time Range *</label>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">From</label>
                      <select
                        name="sendingTimeFrom"
                        value={formData.sendingTimeFrom}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0")
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    <span className="text-gray-500 mt-6">to</span>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">To</label>
                      <select
                        name="sendingTimeTo"
                        value={formData.sendingTimeTo}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0")
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Redirection */}
              <div className="border-t pt-8">
                <label className="block text-lg font-semibold text-gray-700 mb-2">Redirection for Leads *</label>
                <input
                  type="url"
                  name="leadRedirection"
                  value={formData.leadRedirection}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="URL, calendar link, or where we should send your leads"
                />
              </div>

              {/* Agreement */}
              <div className="border-t pt-8">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreement"
                    checked={formData.agreement}
                    onChange={handleInputChange}
                    required
                    className="mr-3 mt-1 w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700 text-sm leading-relaxed">
                    I understand that my account will be set up with my information and the copywriting will be done
                    with the information I entered. I understand that the leads that will be given have not been yet
                    cleaned for bounced and could lose from 10 to 30% and results may vary by industry and offer. I
                    agree to the{" "}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      terms and conditions
                    </a>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={!formData.agreement}
                  className={`px-12 py-4 rounded-lg text-xl font-bold transition-all duration-200 ${
                    formData.agreement
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 cursor-pointer"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Submit and Launch My Cold Email System Setup
                </button>
              </div>
            </form>
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
