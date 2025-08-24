"use client"

import { Button } from "@/components/ui/button"
import { Globe, Settings, Mail, Zap, Target } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import StripePaymentForm from "@/components/stripe-payment-form"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasUserScrolled, setHasUserScrolled] = useState(false)
  const [isAdminMode, setIsAdminMode] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const adminParam = urlParams.get("admin")
    setIsAdminMode(adminParam === "99")
  }, [])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed"
    script.async = true
    script.type = "text/javascript"
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const scrollToPayment = () => {
    const paymentSection = document.getElementById("payment-section")
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleStripeCheckout = async () => {
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

    if (!stripe) {
      console.error("Stripe failed to load")
      return
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      const session = await response.json()

      if (session.error) {
        console.error("Error creating checkout session:", session.error)
        alert("There was an error processing your payment. Please try again.")
        return
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        console.error("Error redirecting to checkout:", result.error)
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("There was an error processing your payment. Please try again.")
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    console.log("[v0] Setting up video intersection observer")

    const handleScroll = () => {
      setHasUserScrolled(true)
      window.removeEventListener("scroll", handleScroll)
    }

    window.addEventListener("scroll", handleScroll)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("[v0] Video intersection:", {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            hasUserScrolled: hasUserScrolled,
          })

          if (entry.isIntersecting && hasUserScrolled) {
            console.log("[v0] Video is visible and user has scrolled, attempting to play")
            video.play().catch((error) => {
              console.log("[v0] Autoplay failed:", error)
            })
          } else if (!entry.isIntersecting) {
            console.log("[v0] Video is not visible, pausing")
            video.pause()
          } else {
            console.log("[v0] Video is visible but user hasn't scrolled yet, not playing")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    observer.observe(video)
    console.log("[v0] Video observer attached")

    return () => {
      console.log("[v0] Cleaning up video observer")
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasUserScrolled])

  return (
    <div className="min-h-screen bg-white text-black">
      <elevenlabs-convai agent-id="agent_3801k3et7mzefpd8cr12jm1ra5tk"></elevenlabs-convai>

      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-50 bg-black backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ybHbXDCwZHw6qKxMIXYIghncTFtKTU.png"
            alt="eVirtualAssistants"
            className="h-8"
          />
          <div className="flex items-center gap-4">
            {isAdminMode && (
              <>
                <a href="/success" className="text-blue-400 hover:text-blue-300 underline text-sm">
                  Success Page (Temp)
                </a>
                <a href="/success-1" className="text-blue-400 hover:text-blue-300 underline text-sm">
                  Success-1 (Temp)
                </a>
                <a href="/success-2" className="text-blue-400 hover:text-blue-300 underline text-sm">
                  Success-2 (Temp)
                </a>
                <a href="/success-3" className="text-blue-400 hover:text-blue-300 underline text-sm">
                  Success-3 (Temp)
                </a>
                <a href="/thank-you" className="text-blue-400 hover:text-blue-300 underline text-sm">
                  Thank You (Temp)
                </a>
                <a href="/follow-up" className="text-blue-400 hover:text-blue-300 underline text-sm">
                  Follow-Up (Temp)
                </a>
              </>
            )}
            <Button onClick={scrollToPayment} className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer">
              CLAIM YOUR OWN COLD EMAIL SYSTEM
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Above the Fold */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            From Zero to 1,000+ Leads — Fast
            <br />
            <span className="text-blue-400">
              Our done-for-you cold email machine delivers replies, meetings, and revenue.
            </span>
          </h1>

          <p className="text-3xl text-gray-300 mb-12 mx-auto leading-relaxed">
            Every day without a cold email strategy means missed deals and lost opportunities. Imagine waking up to a
            steady stream of warm replies from your ideal prospects. We'll build you a fully managed, ready-to-go system
            that puts new leads in your inbox—without you lifting a finger.
          </p>

          {/* Video Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-lg overflow-hidden aspect-video border-2 border-blue-500">
              <video
                ref={videoRef}
                src="https://www.evirtualassistants.com/videos/vv1.mp4"
                controls
                muted
                preload="metadata"
                className="w-full h-full object-cover"
                poster="/cold-email-system-thumbnail.png"
              >
                <p className="text-white text-center p-8">
                  Your browser does not support the video tag. Please update your browser to view this content.
                </p>
              </video>
            </div>
          </div>

          {/* Three Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-white mb-2">Always on – Outreach running 24/7 for you</h3>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-white mb-2">Scalable – Easily grow your outreach as you grow</h3>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-3"></div>
              <h3 className="font-semibold text-white mb-2">No tech headaches – We manage the entire setup</h3>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center mb-12">
            <Button
              onClick={scrollToPayment}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-2xl font-bold cursor-pointer"
            >
              Get Your Cold Email System for $97
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-blue-50 text-black">
        <div className="container mx-auto px-4 text-center">
          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-blue-900">
            500+ COLD EMAIL MACHINES BUILT IN
            <br />
            OVER 50 INDUSTRIES
          </h2>

          <p className="text-xl md:text-2xl text-gray-700 mb-16 max-w-4xl mx-auto">
            Businesses like yours are using our Cold Email Machines
            <br />
            to flood their sales teams with thousands of high-quality leads.
          </p>

          <div className="grid grid-cols-5 gap-6 mb-16 max-w-4xl mx-auto">
            {/* Top Row */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                <span className="text-blue-700 font-bold text-xs">TECH</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-200 rounded-lg flex items-center justify-center border border-blue-300">
                <span className="text-blue-800 font-bold text-xs">REAL ESTATE</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-300 rounded-lg flex items-center justify-center border border-blue-400">
                <span className="text-blue-900 font-bold text-xs">CONSULTING</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                <span className="text-blue-700 font-bold text-xs">HEALTHCARE</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-200 rounded-lg flex items-center justify-center border border-blue-300">
                <span className="text-blue-800 font-bold text-xs">FINANCE</span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-300 rounded-lg flex items-center justify-center border border-blue-400">
                <span className="text-blue-900 font-bold text-xs">MARKETING</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                <span className="text-blue-700 font-bold text-xs">E-COMMERCE</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-200 rounded-lg flex items-center justify-center border border-blue-300">
                <span className="text-blue-800 font-bold text-xs">INSURANCE</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-300 rounded-lg flex items-center justify-center border border-blue-400">
                <span className="text-blue-900 font-bold text-xs">EDUCATION</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                <span className="text-blue-700 font-bold text-xs">COACHING</span>
              </div>
            </div>
          </div>

          {/* Bottom CTA Text */}
          <h3 className="text-2xl md:text-4xl font-bold text-blue-900 mb-4 leading-tight">
            Get Your Very Own Cold Email System
            <br />
            Within 3 Days For Only $97
          </h3>

          {/* Pricing */}
          <p className="text-lg text-gray-600 mb-8">(Normally $297 - Today For Just $97)</p>

          {/* CTA Button */}
          <Button
            onClick={scrollToPayment}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-bold rounded-full cursor-pointer"
          >
            YES, GET MY COLD EMAIL SYSTEM FOR $97!
          </Button>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Headline and CTA */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-black">
                The Fastest Way to <span className="text-blue-600">Start Generating Leads with Cold Email</span>. Don't
                Waste Your Time, We Will Do It Right For <span className="text-blue-600">Just $97</span>. You Own The
                System
              </h2>

              <Button
                onClick={scrollToPayment}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold cursor-pointer"
              >
                ✅ YES, SETUP MY COLD EMAIL MACHINE!
              </Button>
            </div>

            {/* Right Side - Process Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-400"></div>

              <div className="space-y-8">
                {/* Step 1 */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">We learn about your business</h3>
                    <p className="text-gray-600">
                      Tell us about your offer and your ideal client so we can customize the system for your needs
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Set up your cold email systems</h3>
                    <p className="text-gray-600">
                      We setup your domains, DNS records, and mailboxes for perfect deliverability. We warm your
                      mailboxes for you
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">We scrape verified leads for you</h3>
                    <p className="text-gray-600">
                      We will find 10,000 B2B leads that match your customer profile and verify their emails for you
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">We write your cold email sequence</h3>
                    <p className="text-gray-600">
                      Using our proven cold email framework, we will write a 3-step cold email sequence that converts
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">Get access to our 10x Revenue Skool</h3>
                    <p className="text-gray-600">
                      Get access to our cold email course and community to learn how to scale your cold email system.
                      Join our 10x Revenue Skool with a community of entrepreneurs that are scaling their cold email
                      game.
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    6
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      Fill your calendar with qualified leads on autopilot
                    </h3>
                    <p className="text-gray-600">
                      You now own a lead generation system that drives growth while you sleep
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          {/* Main Headline */}
          <h2 className="text-4xl md:text-6xl font-bold mb-12 leading-tight">
            IS THIS UNFAIR?
            <br />
            <span className="text-blue-300">"It's Like Steroids For Your Business…"</span>
          </h2>

          {/* Pain Points */}
          <div className="max-w-3xl mx-auto mb-16 space-y-8">
            <div className="flex items-center justify-center gap-4 text-xl md:text-2xl">
              <span className="text-3xl">🤔</span>
              <p>Struggling to get leads for your business?</p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xl md:text-2xl">
              <span className="text-3xl">🤔</span>
              <p>Tired of poor-quality clients?</p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xl md:text-2xl">
              <span className="text-3xl">🤔</span>
              <p>Sick of competing on price?</p>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-2xl md:text-3xl mb-8 text-blue-100 leading-relaxed">
              Everybody thinks that cold email is oversaturated, but the reality is that cold email strategies have been
              evolving every month for the last 5 years, and we need to adapt.
            </p>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Our customers are getting results like never before as we perform better and stronger at getting into the
              inbox with cutting-edge deliverability techniques.
            </p>

            <div className="bg-blue-800 p-8 rounded-lg mb-12">
              <p className="text-2xl md:text-3xl font-bold text-blue-200">
                It's not too late to get into the cold email business - you're just using outdated strategies, and
                that's why we're here to help you succeed.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <Button
            onClick={scrollToPayment}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-bold rounded-full cursor-pointer"
          >
            Yes, Build My Cold Email Machine For Just $97!
          </Button>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-blue-900">
              But What Exactly Do I Get If I Sign Up?
            </h2>
            <p className="text-2xl text-gray-600 mb-8">Let's Dive In A Little Deeper...</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            {/* Step 1 - Domain Setup */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">1. Domain Purchase & Setup</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">$99</div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                We'll help you purchase the perfect domains for your cold email campaigns. Multiple domains are
                essential for high deliverability and protecting your main business domain.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Strategic domain selection based on your business</li>
                <li>Domain registration and management</li>
                <li>Professional domain setup for maximum credibility</li>
              </ul>
            </div>

            {/* Step 2 - DNS Configuration */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">2. DNS Records Configuration</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">$199</div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Proper DNS setup is crucial for email deliverability. We handle all the technical configurations so your
                emails land in inboxes, not spam folders.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>SPF, DKIM, and DMARC record setup</li>
                <li>MX record configuration</li>
                <li>DNS propagation monitoring</li>
              </ul>
            </div>

            {/* Step 3 - Mailbox Creation */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">3. Professional Mailbox Creation</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">$397</div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                We create multiple professional email accounts across your domains to maximize sending capacity and
                maintain high deliverability rates.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Multiple mailbox setup per domain</li>
                <li>Professional email signatures</li>
                <li>Mailbox organization and management</li>
              </ul>
            </div>

            {/* Step 4 - System Integration */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">4. Email Sending Platform Integration</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">$299</div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                We integrate everything into a powerful email sending platform that automates your entire cold email
                process with advanced tracking and analytics.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Platform setup and configuration</li>
                <li>Mailbox connection and testing</li>
                <li>Campaign automation setup</li>
              </ul>
            </div>

            {/* Step 5 - Email Warming */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">5. Email Warming Process</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">$99</div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Before sending any campaigns, we warm up your email accounts to establish sender reputation and ensure
                maximum deliverability from day one.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Automated email warming sequences</li>
                <li>Gradual sending volume increase</li>
                <li>Reputation monitoring and optimization</li>
              </ul>
            </div>

            {/* Step 6 - Lead Research & Import */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700">6. Lead Research & Data Import</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">$199</div>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                We research and compile a targeted list of 10,000+ verified B2B prospects that match your ideal customer
                profile, ready to import into your system.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Custom lead research based on your criteria</li>
                <li>Email verification and validation</li>
                <li>Data import and segmentation</li>
              </ul>
            </div>

            {/* Total Value Section */}
            <div className="bg-blue-900 text-white p-8 rounded-lg text-center">
              <h3 className="text-3xl font-bold mb-4">Total Value:</h3>
              <div className="text-4xl font-bold mb-4">
                <span className="line-through text-red-400">$1,292</span>
              </div>
              <div className="text-5xl font-bold text-green-400 mb-2">Get it for only $97!</div>
              <p className="text-xl text-blue-200">Save over $1,100 when you act today!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="payment-section" className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">GET STARTED NOW FOR ONLY $97 (SERIOUSLY...)</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Payment Form */}
            <div className="bg-white text-black p-8 rounded-lg">
              <StripePaymentForm />
            </div>

            {/* Right Side - Transparent Costs & Benefits */}
            <div className="space-y-8">
              {/* Video/Image Placeholder */}
              <div className="bg-blue-800 rounded-lg p-8 text-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6776adc1-6721-4f00-9794-19788f71c686-chWAfFznCIqqQCSLzf4LbcdzFzWqvQ.png"
                  alt="Cold Email System - Server and Email Technology"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>

              {/* Transparent Costs */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Transparent Other Costs</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      Instantly.ai <strong>$37/mo</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      Mailboxes <strong>$4/mo/mailbox</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      Domains <strong>$12/domain/year</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      Writing Your Emails <strong>100% FREE</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      Scraping Your Custom Leads <strong>100% FREE</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      Mailbox Setup Fees <strong>100% FREE</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400">✅</span>
                    <span>
                      1 Month Access to Our 10X Revenue School <strong>100% FREE</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-blue-600 text-white p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-2">👑 14-Day Moneyback Guarantee</h4>
                <p>If we can't get your machine up and running, we'll refund your payment</p>
              </div>

              {/* FAQ Reference */}
              <div className="text-center">
                <p className="text-blue-200">💬 See the FAQ below or ask your questions in the live chat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our cold email system</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">
                How long does it take to set up my cold email system?
              </h3>
              <p className="text-gray-700">
                We typically complete the full setup within 3-5 business days. This includes domain setup, DNS
                configuration, mailbox creation, email warming, and lead research. You'll receive regular updates
                throughout the process.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">
                Do I need any technical knowledge to use this system?
              </h3>
              <p className="text-gray-700">
                Not at all! We handle all the technical setup for you. Once everything is ready, we'll provide you with
                simple training on how to manage your campaigns and respond to leads.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">What if I don't get results?</h3>
              <p className="text-gray-700">
                We offer a 14-day money-back guarantee. If we can't get your system up and running as promised, we'll
                refund your payment. However, we've successfully built 500+ systems with a 98% success rate.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">How many leads will I get?</h3>
              <p className="text-gray-700">
                We provide you with 10,000 B2B leads that match your ideal customer profile. The number of responses
                depends on your industry and offer, but our clients typically see 1-7% response rates.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">What are the ongoing costs?</h3>
              <p className="text-gray-700">
                After the initial $97 setup fee, you'll have monthly costs for the email platform (~$37/mo), mailboxes
                (~$4/mo each), and annual domain costs (~$12/year each). We're completely transparent about all costs.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Can you help with follow-up sequences?</h3>
              <p className="text-gray-700">
                Yes! We write a complete 3-step cold email sequence for you. For an additional fee, we can also provide
                custom reply templates and A/B test variations to maximize your conversion rates.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Is this compliant with anti-spam laws?</h3>
              <p className="text-gray-700">
                Absolutely. We follow all CAN-SPAM and GDPR guidelines. We only target business emails for B2B purposes,
                include proper unsubscribe links, and ensure all emails are relevant to the recipient's business.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">What industries do you work with?</h3>
              <p className="text-gray-700">
                We've successfully built cold email systems for over 50 different industries including consulting,
                agencies, SaaS, real estate, insurance, coaching, and many more. We customize each system for your
                specific industry and target audience.
              </p>
            </div>

            {/* New FAQ items */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">What happens after I pay?</h3>
              <p className="text-gray-700">
                Once you pay, you'll be taken to our intake form to get some important details for setting up your cold
                email system.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">Who will write my email copy?</h3>
              <p className="text-gray-700">
                Your email copy will be written by our team using proven frameworks that have generated millions in
                revenue for our clients.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">
                What will you use to set up my cold email machine?
              </h3>
              <p className="text-gray-700">We'll use G Suite to set up the emails to ensure maximum deliverability.</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">How many emails will this send?</h3>
              <p className="text-gray-700">
                You will choose how many mailboxes to set up. We recommend sending 30 emails per day per mailbox. If you
                want to send 500 emails per day then you will need about 15 mailboxes.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-3 text-blue-800">What if I want to add domains & mailboxes?</h3>
              <p className="text-gray-700">
                If you want to add more mailboxes in the future, we can do this for you free of charge. All you need to
                do is contact us and we'll add additional mailboxes for you.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={scrollToPayment}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-bold rounded-full cursor-pointer"
            >
              Ready To Get Started? Click Here For $97!
            </Button>
          </div>
        </div>
      </section>

      {/* 100% Refund Guarantee Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <span className="text-4xl">🛡️</span>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">100% Refund Guaranteed</h2>

            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              If we do not deliver your complete cold email system within 14 days, we will refund every penny of your
              $97 investment.
            </p>

            <div className="bg-blue-700 p-6 rounded-lg mb-8">
              <p className="text-lg font-semibold">No questions asked. No hassles. No fine print.</p>
            </div>

            <p className="text-lg text-blue-100">
              We're so confident in our ability to deliver results that we're willing to put our money where our mouth
              is. Your success is our guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-blue-200 text-black text-center">
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
