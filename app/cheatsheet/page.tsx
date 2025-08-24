"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLink, Download, Calendar, Settings, BarChart3, Database, MessageSquare, Target } from "lucide-react"
import { useState } from "react"

export default function CheatsheetPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedItems(newChecked)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200 print:shadow-none">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Cold Email Checklist</h1>
              <p className="text-blue-600 mt-1">Your complete guide to cold email success</p>
            </div>
            <div className="flex items-center gap-4 print:hidden">
              <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <a href="/" className="text-blue-600 hover:text-blue-800 underline">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Essential Tools Section */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-5 h-5" />
              Essential Tools & Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">Lead Generation</h3>
                    <a
                      href="https://try.10xrevenue.ai/apollo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                    >
                      Apollo Lead Database <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900">Email Verification</h3>
                    <a
                      href="https://try.10xrevenue.ai/Emailverifier"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 underline flex items-center gap-1"
                    >
                      Email Verifier Tool <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-900">Community & Training</h3>
                    <a
                      href="https://www.skool.com/10x-revenue-ai-automation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline flex items-center gap-1"
                    >
                      10x Revenue Skool <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-2">💡 Pro Tip</h3>
                  <p className="text-yellow-800 text-sm">
                    Join our Skool community to connect with other entrepreneurs and get expert advice on scaling your
                    cold email campaigns.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Checklist */}
        <Card className="mb-8 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5" />📅 Weekly Cold Email Checklist (Instantly)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Campaign Maintenance */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />🔧 Campaign Maintenance
              </h3>
              <div className="space-y-3">
                {[
                  "Check sending health → Look at deliverability dashboards, spam flags, bounce rates.",
                  "Review open/reply rates → Spot underperforming campaigns (<40% open or <1% reply).",
                  "Pause underperforming subject lines → Replace with A/B test variant.",
                  "Check daily sending volume → Ensure accounts aren't maxed out too early in the day.",
                  "Confirm inbox warm-up is ON for all domains/mailboxes.",
                  "Remove bounced/invalid emails → Keep your list clean.",
                ].map((item, index) => (
                  <div key={`weekly-maintenance-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`weekly-maintenance-${index}`}
                      checked={checkedItems.has(`weekly-maintenance-${index}`)}
                      onCheckedChange={() => toggleCheck(`weekly-maintenance-${index}`)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`weekly-maintenance-${index}`}
                      className="text-gray-700 cursor-pointer leading-relaxed"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Management */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />📩 Lead Management
              </h3>
              <div className="space-y-3">
                {[
                  "Upload new lead lists (CSV or from Apollo/LinkedIn scrape).",
                  "Verify emails before upload (use NeverBounce, Bouncer, or Instantly's verification).",
                  "Segment leads (by industry, region, company size) → tailor messaging.",
                ].map((item, index) => (
                  <div key={`weekly-leads-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`weekly-leads-${index}`}
                      checked={checkedItems.has(`weekly-leads-${index}`)}
                      onCheckedChange={() => toggleCheck(`weekly-leads-${index}`)}
                      className="mt-1"
                    />
                    <label htmlFor={`weekly-leads-${index}`} className="text-gray-700 cursor-pointer leading-relaxed">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Messaging */}
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                ✍️ Messaging
              </h3>
              <div className="space-y-3">
                {[
                  "Rotate in at least 1 new subject line per campaign.",
                  "Add personalization snippets (company name, niche pain point).",
                  "Review reply inbox → tag replies as Positive / Neutral / Negative.",
                ].map((item, index) => (
                  <div key={`weekly-messaging-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`weekly-messaging-${index}`}
                      checked={checkedItems.has(`weekly-messaging-${index}`)}
                      onCheckedChange={() => toggleCheck(`weekly-messaging-${index}`)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`weekly-messaging-${index}`}
                      className="text-gray-700 cursor-pointer leading-relaxed"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Checklist */}
        <Card className="mb-8 border-green-200 shadow-lg">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="w-5 h-5" />📆 Monthly Cold Email Checklist (Instantly)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Technical Health */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />🛠 Technical Health
              </h3>
              <div className="space-y-3">
                {[
                  "Check DNS records (SPF, DKIM, DMARC) → make sure no errors.",
                  "Rotate new domains & mailboxes if hitting volume limits.",
                  "Retire overused domains (after ~3–4 months heavy sending).",
                  "Review warm-up progress for new mailboxes.",
                ].map((item, index) => (
                  <div key={`monthly-technical-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`monthly-technical-${index}`}
                      checked={checkedItems.has(`monthly-technical-${index}`)}
                      onCheckedChange={() => toggleCheck(`monthly-technical-${index}`)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`monthly-technical-${index}`}
                      className="text-gray-700 cursor-pointer leading-relaxed"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance & Strategy */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />📊 Performance & Strategy
              </h3>
              <div className="space-y-3">
                {[
                  "Review monthly stats (open rate, reply rate, positive reply rate, bounce rate).",
                  "Compare across industries/campaigns → identify top-performing niche.",
                  "Remove unresponsive leads (after 3–4 follow-ups, mark as finished).",
                  "Refresh sequences → rewrite subject lines + adjust CTAs based on feedback.",
                  "Double down on best templates (keep winners, cut losers).",
                ].map((item, index) => (
                  <div
                    key={`monthly-performance-${index}`}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Checkbox
                      id={`monthly-performance-${index}`}
                      checked={checkedItems.has(`monthly-performance-${index}`)}
                      onCheckedChange={() => toggleCheck(`monthly-performance-${index}`)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`monthly-performance-${index}`}
                      className="text-gray-700 cursor-pointer leading-relaxed"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Data & Scaling */}
            <div>
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />📂 Data & Scaling
              </h3>
              <div className="space-y-3">
                {[
                  "Add at least 1 fresh lead source (Apollo, LinkedIn, scraper, referral).",
                  "Test new segment/niche every month.",
                  "Export campaign performance → share with team/clients.",
                ].map((item, index) => (
                  <div key={`monthly-data-${index}`} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox
                      id={`monthly-data-${index}`}
                      checked={checkedItems.has(`monthly-data-${index}`)}
                      onCheckedChange={() => toggleCheck(`monthly-data-${index}`)}
                      className="mt-1"
                    />
                    <label htmlFor={`monthly-data-${index}`} className="text-gray-700 cursor-pointer leading-relaxed">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="mb-8 border-yellow-200 shadow-lg">
          <CardHeader className="bg-yellow-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-5 h-5" />⚡ Pro-Tips to Keep Campaigns Strong
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">📧 Inbox Rotation Rule</h4>
                  <p className="text-yellow-800 text-sm">1 domain = 3–5 inboxes. Rotate new ones in monthly.</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🔥 Warm-Up Never Stops</h4>
                  <p className="text-blue-800 text-sm">Always keep warm-up ON, even for active inboxes.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">📊 Reply Management</h4>
                  <p className="text-green-800 text-sm">
                    Tag every reply (Positive/Neutral/Negative). Only positives get pushed into CRM/next step.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">📈 Scaling Rule</h4>
                  <p className="text-purple-800 text-sm">
                    Don't exceed 30–40 emails/day per inbox until warmed up. Increase slowly.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-blue-200 shadow-lg print:hidden">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Ready to Build Your Cold Email Machine?</h2>
            <p className="text-gray-600 mb-6">Get your complete done-for-you cold email system set up in just 3 days</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <a href="/">Get Started for $97</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://www.skool.com/10x-revenue-ai-automation" target="_blank" rel="noopener noreferrer">
                  Join Our Community
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .container { max-width: none !important; margin: 0 !important; padding: 0 !important; }
          .shadow-lg { box-shadow: none !important; }
          .bg-gradient-to-br { background: white !important; }
        }
      `}</style>
    </div>
  )
}
