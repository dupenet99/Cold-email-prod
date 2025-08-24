import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required")
    }

    if (!secretKey.startsWith("sk_live_") && !secretKey.startsWith("sk_test_")) {
      throw new Error("Invalid Stripe secret key format")
    }

    if (secretKey.length < 100) {
      throw new Error(`Stripe secret key appears truncated (${secretKey.length} chars, expected ~107)`)
    }

    console.log("[v0] Using Stripe secret key:", secretKey.substring(0, 20) + "...")
    console.log("[v0] Key length:", secretKey.length)

    const stripe = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    })

    console.log("[v0] Starting payment intent creation...")
    const { priceId, email, name, upsells } = await request.json()
    console.log("[v0] Request data:", { priceId, email, name, upsells })

    let amount: number

    if (upsells && (upsells.domains > 0 || upsells.mailboxes > 0)) {
      // Calculate amount from upsells (domains + mailboxes)
      const domainPrice = 1200 // $12 per domain in cents
      const mailboxPrice = 400 // $4 per mailbox in cents

      const domains = upsells.domains || 0
      const mailboxes = upsells.mailboxes || 0

      const domainTotal = domains * domainPrice
      const mailboxTotal = mailboxes * mailboxPrice
      amount = domainTotal + mailboxTotal

      console.log("[v0] Upsell pricing calculation:", {
        domains,
        mailboxes,
        domainTotal: domainTotal / 100,
        mailboxTotal: mailboxTotal / 100,
        totalAmount: amount / 100,
      })
    } else {
      // Use base price from Stripe price object
      console.log("[v0] Retrieving base price from Stripe...")
      const price = await stripe.prices.retrieve(priceId)
      amount = price.unit_amount || 39700 // Fallback to $397 if price not found

      console.log("[v0] Base price calculation:", {
        priceId,
        amount: amount / 100,
      })
    }

    if (amount < 50) {
      // Stripe minimum is $0.50
      console.log("[v0] Amount too low, using fallback price")
      amount = 39700 // $397 fallback
    }

    let customer
    if (email) {
      console.log("[v0] Checking for existing customer...")
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
        console.log("[v0] Found existing customer:", customer.id)
      } else {
        console.log("[v0] Creating new customer...")
        customer = await stripe.customers.create({
          email: email,
          name: name || undefined,
          metadata: {
            source: "cold-email-system-website",
          },
        })
        console.log("[v0] Created new customer:", customer.id)
      }
    }

    console.log("[v0] Creating payment intent...")
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      customer: customer?.id,
      metadata: {
        product: "cold-email-system",
        priceId: priceId,
        customerEmail: email || "",
        customerName: name || "",
        domains: (upsells?.domains || 0).toString(),
        mailboxes: (upsells?.mailboxes || 0).toString(),
        calculatedAmount: (amount / 100).toString(),
        premiumLeads: upsells?.premiumLeads ? "true" : "false",
        prioritySetup: upsells?.prioritySetup ? "true" : "false",
      },
      amount: amount,
    })

    if (customer?.id) {
      console.log("[v0] Setting up future usage...")
      await stripe.paymentIntents.update(paymentIntent.id, {
        setup_future_usage: "off_session", // Allows charging from dashboard later
      })
    }

    console.log("[v0] Payment intent created successfully:", paymentIntent.id)
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer?.id,
      priceId: priceId,
    })
  } catch (error: any) {
    console.error("[v0] Error creating payment intent:", error.message)
    console.error("[v0] Error details:", error.message)
    return NextResponse.json(
      {
        error: error.message || "Error creating payment intent",
      },
      { status: 500 },
    )
  }
}
