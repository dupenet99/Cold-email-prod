import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cold Email Checklist - Weekly & Monthly Tasks for Success | 10x Revenue",
  description:
    "Complete cold email checklist with weekly and monthly tasks to optimize your campaigns. Includes campaign maintenance, lead management, messaging tips, and pro strategies for maximum deliverability and results.",
  keywords:
    "cold email checklist, email marketing checklist, cold outreach tasks, email campaign optimization, lead generation checklist, email deliverability, cold email best practices, email automation checklist",
  authors: [{ name: "10x Revenue AI Automation" }],
  creator: "10x Revenue AI Automation",
  publisher: "eVirtualAssistants LLC",
  robots: "index, follow",
  openGraph: {
    title: "Cold Email Checklist - Weekly & Monthly Tasks for Success",
    description:
      "Complete cold email checklist with weekly and monthly tasks to optimize your campaigns and maximize results.",
    url: "https://coldemail.evirtualassistants.com/cheatsheet",
    siteName: "Cold Email Machine",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Email Checklist - Weekly & Monthly Tasks for Success",
    description:
      "Complete cold email checklist with weekly and monthly tasks to optimize your campaigns and maximize results.",
    creator: "@evirtualassist",
  },
  alternates: {
    canonical: "https://coldemail.evirtualassistants.com/cheatsheet",
  },
}

export default function CheatsheetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
