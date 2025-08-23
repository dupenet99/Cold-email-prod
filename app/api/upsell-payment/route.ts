import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { sendSlackNotification } from "@/lib/slack-notifications"

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required")
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })

    const {
      sessionId,
      domainPriceId,
      domainQuantity,
      mailboxPriceId,
      mailboxQuantity,
      priceId,
      quantity = 1,
    } = await request.json()

    let customerId: string | null = null

    if (sessionId.startsWith("customer_cus_")) {
      customerId = sessionId.replace("customer_", "")
      console.log("[v0] Using direct customer ID (with prefix):", customerId)
    } else if (sessionId.startsWith("cus_")) {
      customerId = sessionId
      console.log("[v0] Using direct customer ID:", customerId)
    } else if (sessionId.startsWith("pi_")) {
      const paymentIntent = await stripe.paymentIntents.retrieve(sessionId)
      customerId = paymentIntent.customer as string
      console.log("[v0] Retrieved customer from payment intent:", customerId)
    } else {
      console.log("[v0] Attempting to retrieve checkout session:", sessionId)
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      customerId = session.customer as string
      console.log("[v0] Retrieved customer from checkout session:", customerId)
    }

    if (!customerId) {
      return NextResponse.json({ success: false, error: "No customer found" })
    }

    console.log("[v0] Found customer:", customerId)

    const customer = await stripe.customers.retrieve(customerId)

    if (!customer || customer.deleted) {
      return NextResponse.json({ success: false, error: "Customer not found" })
    }

    // Handle legacy single price ID format for backward compatibility
    if (priceId && !domainPriceId && !mailboxPriceId) {
      const price = await stripe.prices.retrieve(priceId)

      if (!price.unit_amount) {
        return NextResponse.json({ success: false, error: "Invalid price configuration" })
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      })

      if (paymentMethods.data.length === 0) {
        return NextResponse.json({ success: false, error: "No payment method found for customer" })
      }

      const totalAmount = price.unit_amount * quantity

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
        customer: customerId,
        payment_method: paymentMethods.data[0].id,
        confirm: true,
        return_url: `${request.nextUrl.origin}/success-2`,
        metadata: {
          type: "upsell",
          original_session: sessionId,
          product: "full_implementation",
          price_id: priceId,
          quantity: quantity.toString(),
        },
      })

      console.log("[v0] Payment intent created:", paymentIntent.id)

      return NextResponse.json({
        success: true,
        paymentIntent: paymentIntent.id,
      })
    }

    // Handle new format with separate domain and mailbox products
    if (!domainPriceId || !mailboxPriceId) {
      return NextResponse.json({
        success: false,
        error: "Both domain and mailbox price IDs are required.",
      })
    }

    const domainPrice = await stripe.prices.retrieve(domainPriceId)
    if (!domainPrice.unit_amount) {
      return NextResponse.json({ success: false, error: "Invalid domain price configuration" })
    }

    const domainAmount = domainPrice.unit_amount * domainQuantity

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })

    if (paymentMethods.data.length === 0) {
      return NextResponse.json({ success: false, error: "No payment method found for customer" })
    }

    const domainPaymentIntent = await stripe.paymentIntents.create({
      amount: domainAmount,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      confirm: true,
      return_url: `${request.nextUrl.origin}/success-3`,
      metadata: {
        type: "domain_setup",
        original_session: sessionId,
        product: "domains",
        price_id: domainPriceId,
        quantity: domainQuantity.toString(),
      },
    })

    console.log("[v0] Domain payment intent created:", domainPaymentIntent.id)

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: mailboxPriceId,
          quantity: mailboxQuantity,
        },
      ],
      default_payment_method: paymentMethods.data[0].id,
      metadata: {
        type: "mailbox_subscription",
        original_session: sessionId,
        product: "mailboxes",
        quantity: mailboxQuantity.toString(),
      },
    })

    console.log("[v0] Mailbox subscription created:", subscription.id)

    const customerEmail = typeof customer === "object" && !customer.deleted ? customer.email : "Unknown"
    const domainTotal = (domainAmount / 100).toFixed(2)
    const mailboxTotal = (
      ((await stripe.prices.retrieve(mailboxPriceId)).unit_amount! * mailboxQuantity) /
      100
    ).toFixed(2)

    await sendSlackNotification({
      message: `Upsell purchase completed! Customer: ${customerEmail} | Domains: $${domainTotal} (${domainQuantity}x) | Mailboxes: $${mailboxTotal}/month (${mailboxQuantity}x)`,
      type: "payment",
    })

    return NextResponse.json({
      success: true,
      domainPaymentIntent: domainPaymentIntent.id,
      subscription: subscription.id,
    })
  } catch (error: any) {
    console.error("Upsell payment error:", error)
    return NextResponse.json({
      success: false,
      error: error.message,
    })
  }
}
