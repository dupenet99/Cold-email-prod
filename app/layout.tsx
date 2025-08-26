import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1605832390395801');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1605832390395801&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
