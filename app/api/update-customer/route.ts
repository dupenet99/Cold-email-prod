import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      companyName,
      upsell1,
      upsell2,
      upsell3,
      upsell4,
      nbrMailboxes,
      nbrDomains,
      companyDescription,
      companyLinks,
      salesPitch,
      clientAvatar,
      leadListOption,
      emailName,
      sendingMonday,
      sendingTuesday,
      sendingWednesday,
      sendingThursday,
      sendingFriday,
      sendingSaturday,
      sendingSunday,
      sendingTimeFrom,
      sendingTimeTo,
      leadRedirection,
      instantlyLogin,
      instantlyPass,
      calendar,
      slackEmail,
    } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Prepare payload for external API
    const payload: any = {
      CompanyEmail: email,
    }

    // Add optional fields if provided
    if (companyName) {
      payload.CompanyName = companyName
    }

    if (upsell1 !== undefined) {
      payload.Upsell1 = upsell1
    }

    if (upsell2 !== undefined) {
      payload.Upsell2 = upsell2
    }

    if (upsell3 !== undefined) {
      payload.Upsell3 = upsell3
    }

    if (upsell4 !== undefined) {
      payload.Upsell4 = upsell4
    }

    if (nbrMailboxes !== undefined) {
      payload.NbrMailboxes = nbrMailboxes
    }

    if (nbrDomains !== undefined) {
      payload.NbrDomains = nbrDomains
    }

    if (companyDescription) {
      payload.CompanyDescription = companyDescription
    }

    if (companyLinks) {
      payload.CompanyLinks = companyLinks
    }

    if (salesPitch) {
      payload.SalesPitch = salesPitch
    }

    if (clientAvatar) {
      payload.ClientAvatar = clientAvatar
    }

    if (leadListOption) {
      payload.LeadListOption = leadListOption
    }

    if (emailName) {
      payload.EmailName = emailName
    }

    if (sendingMonday !== undefined) {
      payload.SendingMonday = sendingMonday
    }

    if (sendingTuesday !== undefined) {
      payload.SendingTuesday = sendingTuesday
    }

    if (sendingWednesday !== undefined) {
      payload.SendingWednesday = sendingWednesday
    }

    if (sendingThursday !== undefined) {
      payload.SendingThursday = sendingThursday
    }

    if (sendingFriday !== undefined) {
      payload.SendingFriday = sendingFriday
    }

    if (sendingSaturday !== undefined) {
      payload.SendingSaturday = sendingSaturday
    }

    if (sendingSunday !== undefined) {
      payload.SendingSunday = sendingSunday
    }

    if (sendingTimeFrom) {
      payload.SendingTimeFrom = sendingTimeFrom
    }

    if (sendingTimeTo) {
      payload.SendingTimeTo = sendingTimeTo
    }

    if (leadRedirection) {
      payload.LeadRedirection = leadRedirection
    }

    if (instantlyLogin) {
      payload.InstantlyLogin = instantlyLogin
    }

    if (instantlyPass) {
      payload.InstantlyPass = instantlyPass
    }

    if (calendar) {
      payload.Calendar = calendar
    }

    if (slackEmail) {
      payload.SlackEmail = slackEmail
    }

    console.log("[v0] Sending to external API:", payload)

    // Call external ASP.NET Core API
    const response = await fetch("https://ces.evirtualassistants.com/update_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("[v0] External API error:", response.status, response.statusText)
      return NextResponse.json(
        {
          error: "Failed to update customer information",
          details: `${response.status} ${response.statusText}`,
        },
        { status: 500 },
      )
    }

    const result = await response.json()
    console.log("[v0] External API success:", result)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
