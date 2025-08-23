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

    const { email, name, paymentMethodId } = await request.json()

    if (!email || !name || !paymentMethodId) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, name, and payment method ID are required",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Creating customer with email:", email)

    // Create customer
    const customer = await stripe.customers.create({
      email: email,
      name: name,
      metadata: {
        source: "cold_email_system",
        created_via: "fallback_payment_form",
      },
    })

    console.log("[v0] Customer created:", customer.id)

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    })

    console.log("[v0] Payment method attached to customer")

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    console.log("[v0] Default payment method set")

    return NextResponse.json({
      success: true,
      customerId: customer.id,
    })
  } catch (error: any) {
    console.error("Create customer error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create customer",
      },
      { status: 500 },
    )
  }
}
