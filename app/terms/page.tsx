import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | WedCraft",
  description: "Terms and conditions for using WedCraft's digital wedding invitation platform.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: January 2025</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <p className="text-gray-600 leading-relaxed mb-8">
          By using WedCraft, you agree to these Terms of Service. Please read them carefully before
          creating an account or purchasing a template.
        </p>

        <Section title="1. What WedCraft Provides">
          <p>WedCraft is a digital wedding invitation platform. We provide:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Pre-designed, responsive wedding invitation website templates</li>
            <li>A hosted, unique URL for your invitation (e.g., wedcraft.in/invite/your-names)</li>
            <li>An RSVP system for your guests to respond</li>
            <li>A dashboard to manage your invitation and view responses</li>
          </ul>
        </Section>

        <Section title="2. Purchases and Payments">
          <p>All purchases are one-time payments processed securely via Razorpay. Prices are in Indian Rupees (₹) and are inclusive of applicable taxes.</p>
          <p><strong className="text-gray-800">No subscription:</strong> You pay once and your invitation remains active for the duration specified in your plan (Basic: 6 months, Premium: 12 months, Luxury: 24 months).</p>
          <p><strong className="text-gray-800">Refund policy:</strong> Due to the digital nature of our product, refunds are not available once your invitation URL has been generated and activated. If you experience a technical issue preventing your invitation from working, contact us within 48 hours of purchase for assistance.</p>
        </Section>

        <Section title="3. Your Content">
          <p>You are responsible for the content you add to your invitation — names, photos, venue details, and messages. By submitting content, you confirm that:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>You own or have the right to use the content</li>
            <li>The content does not violate any third-party rights</li>
            <li>The content is not illegal, defamatory, or offensive</li>
          </ul>
          <p>WedCraft does not claim ownership of your content. You grant us a limited licence to display it on your invitation page.</p>
        </Section>

        <Section title="4. Prohibited Use">
          <p>You may not use WedCraft to:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Create fake or fraudulent invitations</li>
            <li>Collect personal information from guests without their consent</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Resell or sublicense our templates or services</li>
            <li>Attempt to reverse-engineer or copy our templates for commercial use</li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property">
          <p>Our templates, designs, code, and branding are the intellectual property of WedCraft. The watermark on preview versions and the &quot;Made with WedCraft&quot; credit on paid invitations must not be removed.</p>
          <p>You may not copy, reproduce, or distribute our templates without written permission.</p>
        </Section>

        <Section title="6. Availability">
          <p>We aim to keep your invitation URL live and accessible. However, we do not guarantee 100% uptime and are not liable for temporary downtime due to maintenance, hosting issues, or circumstances beyond our control.</p>
          <p>We will provide advance notice of any planned maintenance that may affect your invitation.</p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>WedCraft is provided &quot;as is&quot;. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of our service, including but not limited to loss of data or missed wedding guests.</p>
          <p>Our total liability to you for any claim shall not exceed the amount you paid for your template.</p>
        </Section>

        <Section title="8. Privacy">
          <p>Your use of WedCraft is also governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, which explains how we collect and use your information.</p>
        </Section>

        <Section title="9. Changes to These Terms">
          <p>We may update these Terms from time to time. Material changes will be communicated via email or a notice on our website. Continued use after changes means you accept the new terms.</p>
        </Section>

        <Section title="10. Governing Law">
          <p>These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of Andhra Pradesh, India.</p>
        </Section>

        <Section title="11. Contact">
          <p>Questions about these Terms? Contact us:</p>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl text-sm">
            <p className="font-medium text-gray-900">WedCraft</p>
            <p>Email: <a href="mailto:hello@wedcraft.in" className="text-blue-600 hover:underline">hello@wedcraft.in</a></p>
          </div>
        </Section>
      </div>
    </div>
  );
}