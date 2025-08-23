interface UpdateInfoPayload {
  CompanyEmail: string
  CompanyName?: string
  SendingSchedule?: string
  UpsellOne?: boolean
  UpsellTwo?: boolean
  UpsellThree?: boolean
  InstantlyLogin?: string
  InstantlyPassword?: string
  CalendarUrl?: string
  SlackEmail?: string
}

export async function updateCustomerInfo(payload: UpdateInfoPayload) {
  try {
    console.log("[v0] Updating customer info:", payload)

    const response = await fetch("https://ces.evirtualassistants.com/update_info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log("[v0] Customer info updated successfully:", result)
    return result
  } catch (error) {
    console.error("[v0] Failed to update customer info:", error)
    // Don't throw error to avoid breaking the user flow
    return null
  }
}
