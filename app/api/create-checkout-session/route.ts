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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Custom Lead Gen Machine Buildout - Ready to Send",
              description:
                "Full cold email machine buildout including custom lead list, copywriting 3 email sequence, and access to our mini-course.",
            },
            unit_amount: 9700, // $97.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/#payment-section`,
      metadata: {
        product: "cold-email-system",
      },
    })

    return NextResponse.json({ id: session.id })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: error.message || "Error creating checkout session" }, { status: 500 })
  }
}
