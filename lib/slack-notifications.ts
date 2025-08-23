// Utility functions for sending Slack notifications

export interface SlackNotification {
  message: string
  type?: "success" | "payment" | "form" | "error" | "info"
  channel?: string
}

export async function sendSlackNotification({ message, type = "info", channel }: SlackNotification) {
  try {
    const response = await fetch("/api/slack-notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, type, channel }),
    })

    const result = await response.json()

    if (!result.success) {
      console.error("[v0] Failed to send Slack notification:", result.error)
    }

    return result.success
  } catch (error) {
    console.error("[v0] Slack notification error:", error)
    return false
  }
}

// Pre-configured notification functions for common events
export const slackNotifications = {
  paymentSuccess: (customerName: string, amount: string, product: string) =>
    sendSlackNotification({
      message: `New payment received! ${customerName} paid ${amount} for ${product}`,
      type: "payment",
    }),

  formSubmission: (customerName: string, formType: string) =>
    sendSlackNotification({
      message: `${customerName} submitted ${formType} form`,
      type: "form",
    }),

  customerSignup: (customerName: string, email: string) =>
    sendSlackNotification({
      message: `New customer signup: ${customerName} (${email})`,
      type: "success",
    }),

  upsellPurchase: (customerName: string, product: string, amount: string) =>
    sendSlackNotification({
      message: `Upsell purchase: ${customerName} bought ${product} for ${amount}`,
      type: "payment",
    }),

  subscriptionCreated: (customerName: string, plan: string) =>
    sendSlackNotification({
      message: `New subscription: ${customerName} subscribed to ${plan}`,
      type: "success",
    }),

  // Homepage payment notification
  homepagePayment: (
    customerName: string,
    email: string,
    baseAmount: string,
    upsellLevel: number,
    totalAmount: string,
  ) =>
    sendSlackNotification({
      message: `🏠 Homepage Payment: ${customerName} (${email}) paid $${baseAmount} base + upgraded to upsell ${upsellLevel}. Total: $${totalAmount}`,
      type: "payment",
    }),

  // Success page upsell notification
  successPageUpsell: (customerName: string, email: string, amount: string) =>
    sendSlackNotification({
      message: `🎯 Success Page Upsell: ${customerName} (${email}) purchased upsell for $${amount}`,
      type: "payment",
    }),

  // Success-1 page upsell notification
  success1Upsell: (customerName: string, email: string, amount: string) =>
    sendSlackNotification({
      message: `🚀 Success-1 Upsell: ${customerName} (${email}) purchased managed service for $${amount}`,
      type: "payment",
    }),

  // Success-3 form completion notification
  success3Completion: (customerName: string, email: string) =>
    sendSlackNotification({
      message: `📋 Cold Email Setup: ${customerName} (${email}) has submitted their information for the cold email system setup`,
      type: "form",
    }),
}

export default slackNotifications
