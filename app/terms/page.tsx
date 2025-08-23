"use client"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ybHbXDCwZHw6qKxMIXYIghncTFtKTU.png"
            alt="eVirtualAssistants"
            className="h-8"
          />
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-400 hover:text-blue-300 underline text-sm">
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Terms Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">Terms of Service</h1>
        <p className="text-gray-600 text-center mb-12">Last updated August 1, 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* Agreement to Legal Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">AGREEMENT TO OUR LEGAL TERMS</h2>
            <p>
              We are eVirtualAssistants LLC ("Company," "we," "us," "our"), located at 4801 Lang Ave NE, Ste 110-1088,
              Albuquerque, NM 87109. We operate the website https://www.evirtualassistants.com/ ("Site") and provide
              digital content, software, consulting, cold email marketing services, and related products (collectively,
              "Services"). You may contact us by email at support@evirtualassistants.com or by mail at the above
              address.
            </p>
            <p className="mt-4">
              By accessing or purchasing our Services, you agree to these legally binding Terms of Service ("Terms"). If
              you do not agree, you are prohibited from using or purchasing the Services and must discontinue
              immediately. We may modify these Terms with notice via email, effective upon posting. Continued use after
              changes constitutes acceptance. The Services are for users 18 years and older. We recommend you retain a
              copy of these Terms.
            </p>
          </section>

          {/* Our Services */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">1. OUR SERVICES</h2>
            <p>
              The Services include digital content, software, consulting, and other products designed for lead
              generation, cold email marketing, and business development, as detailed in separate purchase agreements.
              Services are not intended for use in jurisdictions where such use violates local law; you are responsible
              for compliance. Services are not designed to comply with industry-specific regulations (e.g., HIPAA,
              FISMA).
            </p>
            <p className="mt-4">
              All sales are final unless explicitly stated otherwise in these Terms. You acknowledge that business
              outcomes depend on your implementation, your audience, and other market factors beyond our control. No
              specific results are guaranteed except as expressly provided in a purchase agreement.
            </p>
          </section>

          {/* Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">2. INTELLECTUAL PROPERTY RIGHTS</h2>
            <p>
              We own or license all intellectual property in the Services, including source code, databases, templates,
              strategies, and trademarks ("Content and Marks"). You receive a non-exclusive, non-transferable, revocable
              license to access and use the Content and Marks solely for your internal business purposes as authorized
              by your purchase agreement.
            </p>
            <p className="mt-4">
              You may not copy, resell, distribute, reverse-engineer, or otherwise exploit our Content and Marks without
              express written consent. Violations incur liquidated damages of $10,000 per incident and may entitle us to
              immediate injunctive relief.
            </p>
            <p className="mt-4">
              You may not develop or sell competing products or services using our proprietary methods within a 100-mile
              radius of Albuquerque, New Mexico, for 1 year following termination of access. We reserve the right to
              audit usage of our Services for compliance.
            </p>
          </section>

          {/* User Representations */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">3. USER REPRESENTATIONS</h2>
            <p>By using the Services, you represent and warrant that:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>All registration and purchase information is true, accurate, and current.</li>
              <li>You will maintain and update such information as needed.</li>
              <li>You have legal capacity to agree to these Terms.</li>
              <li>You are not a minor in your jurisdiction.</li>
              <li>You will not access Services via automated or non-human means.</li>
              <li>You will not use Services for unlawful purposes.</li>
              <li>Your use complies with all applicable laws.</li>
            </ul>
            <p className="mt-4">Providing false information may result in immediate termination without refund.</p>
          </section>

          {/* User Registration */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">4. USER REGISTRATION</h2>
            <p>
              You may be required to register to use the Services. You must keep login credentials confidential and are
              responsible for all activities under your account. We may remove usernames deemed inappropriate at our
              sole discretion.
            </p>
          </section>

          {/* Purchases and Payment */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">5. PURCHASES AND PAYMENT</h2>
            <p>
              We accept Visa, Mastercard, American Express, PayPal, Discover, and ACH. You must provide accurate,
              up-to-date billing information. Prices are in U.S. dollars and subject to change without notice.
            </p>
            <p className="mt-4">
              Full payment is due upfront unless a written payment plan is agreed. Missing payments may result in late
              fees, interest charges, and revoked access until paid in full. You authorize us to charge your payment
              method for all charges, including recurring fees, until canceled.
            </p>
            <p className="mt-4">
              Unauthorized chargebacks or disputes will make you liable for our legal and collection costs.
            </p>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">6. REFUND POLICY</h2>
            <p>Refunds are not guaranteed and are subject to the following:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Requests must be submitted in writing within 14 days of purchase.</li>
              <li>You must have completed all required Service components (e.g., minimum engagement hours).</li>
              <li>You must declare in writing that no value was received.</li>
              <li>Accessing bonus materials voids refund eligibility.</li>
              <li>Payment plans must be paid in full to qualify.</li>
              <li>Upon refund, access to all Services, materials, and bonuses is permanently revoked.</li>
            </ul>
          </section>

          {/* Software and Support */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">7. SOFTWARE AND SUPPORT</h2>
            <p>
              Software provided with Services is licensed on a limited, revocable basis. Support is only offered if
              specified in your purchase agreement. You are responsible for maintaining your own data backups.
            </p>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">8. PROHIBITED ACTIVITIES</h2>
            <p>You may not:</p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Copy, resell, or reverse-engineer our Services.</li>
              <li>Solicit our community members for competing services for 1 year post-access.</li>
              <li>
                Develop or sell competing products using our proprietary methods within 100 miles of Albuquerque, NM,
                for 1 year post-termination.
              </li>
              <li>Use Services for illegal or harmful activities.</li>
              <li>Make false or defamatory statements about our company (liquidated damages: $1,000 per incident).</li>
            </ul>
            <p className="mt-4">Violations result in immediate termination and forfeiture of payments.</p>
          </section>

          {/* Confidentiality */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">9. CONFIDENTIALITY</h2>
            <p>
              All strategies, templates, and data provided are confidential and may not be shared, disclosed, or used
              outside the scope of your purchase agreement.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">10. DISPUTE RESOLUTION</h2>
            <p>
              All disputes shall be resolved by binding arbitration in Albuquerque, New Mexico, under AAA Commercial
              Rules. Each party bears its own fees unless otherwise awarded. We may seek injunctive relief in court for
              irreparable harm (e.g., IP violations).
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">11. INDEMNIFICATION</h2>
            <p>
              You agree to indemnify and hold us harmless from claims, damages, or liabilities arising from your use of
              Services, breach of Terms, or violation of third-party rights.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">12. TERMINATION</h2>
            <p>
              We may suspend or terminate access to Services at our discretion, with or without cause. Upon termination,
              all access ends immediately, and no refund will be provided unless stated in Section 6.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">13. LIMITATION OF LIABILITY</h2>
            <p>
              Our total liability shall not exceed the amount you paid for Services in the prior 12 months. We are not
              liable for indirect or consequential damages.
            </p>
          </section>

          {/* Force Majeure */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">14. FORCE MAJEURE</h2>
            <p>
              We are not liable for delays or interruptions caused by circumstances beyond our control, including
              natural disasters, cyber-attacks, or government actions.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">15. PRIVACY POLICY</h2>
            <p>
              Review our Privacy Policy at https://www.evirtualassistants.com/privacy-policy. By using our Services, you
              agree to its terms.
            </p>
          </section>

          {/* Modifications and Interruptions */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">16. MODIFICATIONS AND INTERRUPTIONS</h2>
            <p>We may modify, suspend, or discontinue Services at any time without liability.</p>
          </section>

          {/* General Terms */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">17. GENERAL TERMS</h2>
            <p>
              These Terms constitute the entire agreement. Amendments must be in writing and signed. If any provision is
              found unenforceable, the remainder shall remain in effect.
            </p>
          </section>

          {/* California Users */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">18. CALIFORNIA USERS</h2>
            <p>
              If unresolved, you may contact the Complaint Assistance Unit, Division of Consumer Services, California
              Department of Consumer Affairs.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">19. CONTACT US</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p>
                <strong>eVirtualAssistants LLC</strong>
              </p>
              <p>4801 Lang Ave NE, Ste 110-1088</p>
              <p>Albuquerque, NM 87109</p>
              <p>
                <strong>Email:</strong> support@evirtualassistants.com
              </p>
            </div>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
