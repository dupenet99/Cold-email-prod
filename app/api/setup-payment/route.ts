import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required")
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })

    const { sessionId, customerId, domainQuantity, mailboxQuantity, emailVolume } = await request.json()

    console.log("[v0] Setup payment request:", {
      sessionId,
      customerId,
      domainQuantity,
      mailboxQuantity,
      emailVolume,
    })

    let customer

    if (customerId) {
      customer = await stripe.customers.retrieve(customerId)
      console.log("[v0] Found existing customer:", customer.id)
    } else if (sessionId) {
      // Try to get customer from payment intent if session is payment intent ID
      if (sessionId.startsWith("pi_")) {
        const paymentIntent = await stripe.paymentIntents.retrieve(sessionId)
        if (paymentIntent.customer) {
          customer = await stripe.customers.retrieve(paymentIntent.customer as string)
          console.log("[v0] Retrieved customer from payment intent:", customer.id)
        }
      }
    }

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer information not found",
        },
        { status: 400 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: "price_1RwcogBP6nLFGEYdhV2FmvWE", // Domain one-time price
          quantity: domainQuantity,
        },
        {
          price: "price_1RwcrDBP6nLFGEYdQCyNWN2k", // Mailbox subscription price
          quantity: mailboxQuantity,
        },
      ],
      success_url: `https://coldemail.evirtualassistants.com/success-3?session_id={CHECKOUT_SESSION_ID}&domains=${domainQuantity}&mailboxes=${mailboxQuantity}&customer_id=${customer.id}`,
      cancel_url: `https://coldemail.evirtualassistants.com/success-2`,
      metadata: {
        type: "cold_email_setup",
        mailboxes: mailboxQuantity.toString(),
        domains: domainQuantity.toString(),
        emailVolume: emailVolume.toString(),
        original_session: sessionId,
      },
    })

    console.log("[v0] Checkout session created:", session.id)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("[v0] Setup payment error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed",
      },
      { status: 500 },
    )
  }
}
