import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, type = "info" } = await request.json()

    const slackWebhookUrl = "https://hooks.slack.com/services/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"

    if (!slackWebhookUrl) {
      console.error("[v0] Slack webhook URL not configured")
      return NextResponse.json({ success: false, error: "Slack not configured" })
    }

    // Format message based on type
    const formatMessage = (msg: string, msgType: string) => {
      const icons = {
        success: "✅",
        payment: "💰",
        form: "📝",
        error: "❌",
        info: "ℹ️",
      }

      const icon = icons[msgType as keyof typeof icons] || icons.info
      return `${icon} ${msg}`
    }

    const slackPayload = {
      text: formatMessage(message, type),
    }

    console.log("[v0] Sending Slack notification:", message)
    console.log("[v0] Webhook URL:", slackWebhookUrl)
    console.log("[v0] Payload:", JSON.stringify(slackPayload))

    // Send to Slack
    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackPayload),
    })

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text()
      console.error("[v0] Slack API error details:", {
        status: slackResponse.status,
        statusText: slackResponse.statusText,
        body: errorText,
      })
      throw new Error(`Slack API error: ${slackResponse.status} - ${errorText}`)
    }

    console.log("[v0] Slack notification sent successfully")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Slack notification error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
