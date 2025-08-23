"use client"
import { useState, useEffect } from "react"
import type React from "react"

export default function FollowUpPage() {
  const [companyEmail, setCompanyEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [hasSessionData, setHasSessionData] = useState(false)
  const [instantlyLogin, setInstantlyLogin] = useState("")
  const [instantlyPassword, setInstantlyPassword] = useState("")
  const [calendarUrl, setCalendarUrl] = useState("")
  const [dedicatedAccountEmail, setDedicatedAccountEmail] = useState("")

  useEffect(() => {
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

    console.log("[v0] URL parameters - email:", emailFromUrl, "name:", nameFromUrl)
    console.log(
      "[v0] Session data - email:",
      emailFromUrl || sessionStorage.getItem("customerEmail"),
      "name:",
      nameFromUrl || sessionStorage.getItem("customerName"),
    )
  }, [])

  const tasks = [
    {
      id: "instantly_access",
      title: "We Need Access to Instantly.ai",
      description:
        "This is the software we use to send cold email. Please follow this link to create an account and we'll need the login password to set up everything.",
      priority: "High",
    },
    {
      id: "calendar_info",
      title: "Provide Your Calendar Information",
      description:
        "Share your calendar link so we can schedule meetings and coordinate campaign timing. If you don't have a calendar system, we recommend using Calendly.",
      priority: "Medium",
    },
    {
      id: "dedicated_account",
      title: "Dedicated Account Information",
      description:
        "If you have upgraded your package to 'All Done For You', enter your email account to be invited to our Slack workspace for direct communication with your dedicated team.",
      priority: "Medium",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleInstantlySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!instantlyLogin || !instantlyPassword) {
      alert("Please fill in both login and password fields")
      return
    }

    const clientName = fullName || "Unknown Client"
    const clientEmail = companyEmail || "No email provided"

    try {
      if (companyEmail) {
        await fetch("/api/update-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: companyEmail,
            name: fullName,
            instantlyLogin: instantlyLogin,
            instantlyPass: instantlyPassword,
          }),
        })
      }

      const response = await fetch("/api/slack-notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🔐 Instantly.ai Credentials Submitted:\nClient: ${clientName} (${clientEmail})\nLogin: ${instantlyLogin}\nPassword: ${instantlyPassword}`,
        }),
      })

      if (response.ok) {
        alert("Credentials submitted successfully! Our team will set up your account.")
        setInstantlyLogin("")
        setInstantlyPassword("")
      } else {
        alert("There was an error submitting your credentials. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting credentials:", error)
      alert("There was an error submitting your credentials. Please try again.")
    }
  }

  const handleCalendarSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!calendarUrl) {
      alert("Please provide your calendar URL")
      return
    }

    const clientName = fullName || "Unknown Client"
    const clientEmail = companyEmail || "No email provided"

    try {
      if (companyEmail) {
        await fetch("/api/update-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: companyEmail,
            name: fullName,
            calendar: calendarUrl,
          }),
        })
      }

      const response = await fetch("/api/slack-notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `📅 Calendar Information Submitted:\nClient: ${clientName} (${clientEmail})\nCalendar URL: ${calendarUrl}`,
        }),
      })

      if (response.ok) {
        alert("Calendar information submitted successfully! Our team will coordinate with your schedule.")
        setCalendarUrl("")
      } else {
        alert("There was an error submitting your calendar information. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting calendar info:", error)
      alert("There was an error submitting your calendar information. Please try again.")
    }
  }

  const handleDedicatedAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!dedicatedAccountEmail) {
      alert("Please provide your email address")
      return
    }

    const clientName = fullName || "Unknown Client"
    const clientEmail = companyEmail || "No email provided"

    console.log("[v0] Dedicated Account Submit - Starting")
    console.log("[v0] URL Parameter Email (CompanyEmail):", companyEmail)
    console.log("[v0] Form Input Email (SlackEmail):", dedicatedAccountEmail)
    console.log("[v0] Client Name:", clientName)

    try {
      if (companyEmail) {
        const apiPayload = {
          email: companyEmail, // URL parameter email for CompanyEmail
          name: fullName,
          slackEmail: dedicatedAccountEmail, // Entered email for SlackEmail
        }

        console.log("[v0] Sending API payload:", JSON.stringify(apiPayload))

        const apiResponse = await fetch("/api/update-customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiPayload),
        })

        console.log("[v0] API Response Status:", apiResponse.status)

        if (apiResponse.ok) {
          const apiResult = await apiResponse.json()
          console.log("[v0] API Response Data:", JSON.stringify(apiResult))
        } else {
          const errorText = await apiResponse.text()
          console.log("[v0] API Error Response:", errorText)
        }
      } else {
        console.log("[v0] No company email found, skipping API call")
      }

      const slackPayload = {
        message: `👥 Dedicated Account Email Submitted:\nClient: ${clientName} (${clientEmail})\nDedicated Account Email: ${dedicatedAccountEmail}\nRequesting Slack workspace invitation for All Done For You package.`,
      }

      console.log("[v0] Sending Slack payload:", JSON.stringify(slackPayload))

      const response = await fetch("/api/slack-notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slackPayload),
      })

      console.log("[v0] Slack Response Status:", response.status)

      if (response.ok) {
        const slackResult = await response.json()
        console.log("[v0] Slack Response Data:", JSON.stringify(slackResult))
        alert("Email submitted successfully! You will receive a Slack invitation within 24 hours.")
        setDedicatedAccountEmail("")
      } else {
        const slackError = await response.text()
        console.log("[v0] Slack Error Response:", slackError)
        alert("There was an error submitting your email. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Error in handleDedicatedAccountSubmit:", error)
      alert("There was an error submitting your email. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            This is Your <span className="text-blue-500">To-Do List</span> for Us to Start Building Your Campaign
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Complete these tasks to help us create the most effective cold email campaign for your business.
          </p>
        </div>
      </div>

      <div className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-lg font-semibold text-gray-600">
            Campaign setup <span className="text-blue-600">Action Items</span>
          </div>
          {hasSessionData && (
            <div className="mt-2 text-sm text-gray-500">
              Welcome back, {fullName} ({companyEmail})
            </div>
          )}
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-black mb-8">Campaign Setup Tasks</h2>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                📋 Please complete these tasks to ensure we can build the most effective campaign for you.
              </p>
            </div>

            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{task.description}</p>

                      {task.id === "instantly_access" && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="mb-4">
                            <a
                              href="https://instantly.ai"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Create Instantly.ai Account →
                            </a>
                          </div>

                          <form onSubmit={handleInstantlySubmit} className="space-y-4">
                            <div>
                              <label htmlFor="instantly-login" className="block text-sm font-medium text-gray-700 mb-1">
                                Instantly.ai Login/Email
                              </label>
                              <input
                                type="email"
                                id="instantly-login"
                                value={instantlyLogin}
                                onChange={(e) => setInstantlyLogin(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your-email@company.com"
                                required
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="instantly-password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Instantly.ai Password
                              </label>
                              <input
                                type="password"
                                id="instantly-password"
                                value={instantlyPassword}
                                onChange={(e) => setInstantlyPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Your password"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Submit Instantly.ai Credentials
                            </button>
                          </form>
                        </div>
                      )}

                      {task.id === "calendar_info" && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="mb-4">
                            <a
                              href="https://calendly.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Create Free Calendly Account →
                            </a>
                          </div>

                          <form onSubmit={handleCalendarSubmit} className="space-y-4">
                            <div>
                              <label htmlFor="calendar-url" className="block text-sm font-medium text-gray-700 mb-1">
                                Calendar URL (Calendly, Google Calendar, etc.)
                              </label>
                              <input
                                type="url"
                                id="calendar-url"
                                value={calendarUrl}
                                onChange={(e) => setCalendarUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://calendly.com/your-name or your calendar link"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Submit Calendar Information
                            </button>
                          </form>
                        </div>
                      )}

                      {task.id === "dedicated_account" && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                              If you haven't upgraded to our "All Done For You" package yet, you can upgrade here:
                            </p>
                            <a
                              href={`/success?fullname=${encodeURIComponent(fullName)}&email=${encodeURIComponent(companyEmail)}`}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Upgrade to All Done For You Package →
                            </a>
                          </div>

                          <form onSubmit={handleDedicatedAccountSubmit} className="space-y-4">
                            <div>
                              <label htmlFor="dedicated-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email for Slack Workspace Invitation
                              </label>
                              <input
                                type="email"
                                id="dedicated-email"
                                value={dedicatedAccountEmail}
                                onChange={(e) => setDedicatedAccountEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="your-email@company.com"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                This email will be used to invite you to our private Slack workspace for direct
                                communication with your dedicated team.
                              </p>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Submit Email for Slack Invitation
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Next Steps</h3>
              <p className="text-green-700">
                Once you've completed these tasks, our team will begin building your campaign. We'll reach out within
                24-48 hours to confirm all details and start the setup process.
              </p>
            </div>
          </div>
        </div>
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
