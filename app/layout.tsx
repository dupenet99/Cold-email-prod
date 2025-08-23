import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cold Email Machine - Done-For-You Cold Email System | $97",
  description:
    "Get your complete cold email system set up in 24 hours. Done-for-you domains, mailboxes, lead lists, and email sequences. Start generating leads immediately with our proven cold email machine.",
  keywords:
    "cold email, lead generation, email marketing, done for you email system, cold outreach, business leads, email automation, cold email setup",
  authors: [{ name: "eVirtualAssistants LLC" }],
  creator: "eVirtualAssistants LLC",
  publisher: "eVirtualAssistants LLC",
  robots: "index, follow",
  openGraph: {
    title: "Cold Email Machine - Done-For-You Cold Email System",
    description:
      "Get your complete cold email system set up in 24 hours. Done-for-you domains, mailboxes, lead lists, and email sequences.",
    url: "https://coldemail.evirtualassistants.com",
    siteName: "Cold Email Machine",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Email Machine - Done-For-You Cold Email System",
    description: "Get your complete cold email system set up in 24 hours. Start generating leads immediately.",
    creator: "@evirtualassist",
  },
  alternates: {
    canonical: "https://coldemail.evirtualassistants.com",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
