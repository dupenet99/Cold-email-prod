import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, type = "info" } = await request.json()

    const slackWebhookUrl =
      process.env.SLACK_WEBHOOK_URL || "https://hooks.slack.com/services/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"

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
    console.log("[v0] Webhook URL:", slackWebhookUrl.substring(0, 50) + "...")
    console.log("[v0] Payload:", JSON.stringify(slackPayload))

    // Send to Slack
    const slackResponse = await fetch(slackWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackPayload),
    })

    const responseText = await slackResponse.text()

    if (!slackResponse.ok) {
      console.error("[v0] Slack API error details:", {
        status: slackResponse.status,
        statusText: slackResponse.statusText,
        body: responseText,
        webhookUrl: slackWebhookUrl.substring(0, 50) + "...",
      })

      // Check for common Slack webhook errors
      if (slackResponse.status === 404) {
        console.error("[v0] Slack webhook URL not found - webhook may be expired or invalid")
      } else if (slackResponse.status === 403) {
        console.error("[v0] Slack webhook forbidden - webhook may be disabled")
      }

      throw new Error(`Slack API error: ${slackResponse.status} - ${responseText}`)
    }

    console.log("[v0] Slack notification sent successfully")
    console.log("[v0] Slack response:", responseText)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Slack notification error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
