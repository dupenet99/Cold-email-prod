import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required")
    }

    console.log("[v0] Using Stripe secret key:", secretKey.substring(0, 20) + "...")

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })

    console.log("[v0] Starting direct setup payment...")
    const { sessionId, customerId, domainQuantity, mailboxQuantity, emailVolume } = await request.json()

    console.log("[v0] Setup payment request:", { sessionId, customerId, domainQuantity, mailboxQuantity, emailVolume })

    if (!sessionId || !customerId || !domainQuantity || !mailboxQuantity || !emailVolume) {
      throw new Error("Missing required parameters")
    }

    // Get customer information
    console.log("[v0] Retrieving customer:", customerId)
    const customer = await stripe.customers.retrieve(customerId)
    console.log("[v0] Found customer:", customerId)

    // Calculate total amount (domains one-time + mailboxes monthly setup)
    const domainPrice = 12 // $12 per domain
    const mailboxPrice = 4 // $4 per mailbox setup
    const totalAmount = (domainQuantity * domainPrice + mailboxQuantity * mailboxPrice) * 100 // Convert to cents

    console.log("[v0] Calculated total amount:", totalAmount, "cents")

    // Get customer's default payment method
    console.log("[v0] Retrieving payment methods for customer...")
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })

    console.log("[v0] Found payment methods:", paymentMethods.data.length)

    if (paymentMethods.data.length === 0) {
      throw new Error("No payment method found for customer")
    }

    console.log("[v0] Using payment method:", paymentMethods.data[0].id)

    console.log("[v0] Creating payment intent...")
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "usd",
      customer: customerId,
      payment_method_types: ["card"],
      payment_method: paymentMethods.data[0].id,
      description: `Cold Email System Setup - ${domainQuantity} domains, ${mailboxQuantity} mailboxes`,
      metadata: {
        type: "setup_payment",
        domains: domainQuantity.toString(),
        mailboxes: mailboxQuantity.toString(),
        email_volume: emailVolume.toString(),
      },
    })

    console.log("[v0] Payment intent created:", paymentIntent.id)

    console.log("[v0] Confirming payment intent...")
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id)

    console.log("[v0] Payment confirmation status:", confirmedPayment.status)

    if (confirmedPayment.status !== "succeeded") {
      throw new Error(`Payment failed with status: ${confirmedPayment.status}`)
    }

    console.log("[v0] Payment successful!")

    return NextResponse.json({
      success: true,
      paymentIntentId: confirmedPayment.id,
      amount: totalAmount,
    })
  } catch (error) {
    console.error("[v0] Setup payment error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
        details: error instanceof Error ? error.stack : "Unknown error",
      },
      { status: 500 },
    )
  }
}
