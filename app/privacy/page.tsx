import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WedCraft",
  description: "How WedCraft collects, uses, and protects your personal information.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
  </div>
);

export default function PrivacyPage() {
  const lastUpdated = "January 2025";

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <p className="text-gray-600 leading-relaxed mb-8">
          WedCraft (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This policy
          explains what information we collect, how we use it, and how we keep it safe when you
          use our digital wedding invitation platform.
        </p>

        <Section title="1. Information We Collect">
          <p><strong className="text-gray-800">Account information:</strong> When you sign up, we collect your name, email address, and password (encrypted). If you sign in with Google, we receive your name, email, and profile photo from Google.</p>
          <p><strong className="text-gray-800">Wedding details:</strong> When you purchase a template, we collect your wedding information — couple names, date, venue, events schedule, and personal message — to generate your invitation.</p>
          <p><strong className="text-gray-800">Payment information:</strong> Payments are processed by Razorpay. We do not store your card number, CVV, or banking details. We only receive a transaction ID confirming payment.</p>
          <p><strong className="text-gray-800">RSVP responses:</strong> When guests submit RSVPs on your invitation, we store their name, phone number, attendance status, and any message they leave.</p>
          <p><strong className="text-gray-800">Usage data:</strong> We may collect basic analytics such as pages visited and time spent on the site to improve our service.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use your information to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600">
            <li>Create and display your wedding invitation</li>
            <li>Process your payment and generate your unique invite URL</li>
            <li>Send you your invitation link after purchase</li>
            <li>Allow your guests to submit RSVPs and display responses to you</li>
            <li>Allow you to edit your invitation details</li>
            <li>Improve our templates and features</li>
            <li>Respond to your support requests</li>
          </ul>
          <p>We do <strong className="text-gray-800">not</strong> sell your personal information to third parties or use it for advertising.</p>
        </Section>

        <Section title="3. Data Storage and Security">
          <p>Your data is stored securely in MongoDB Atlas (cloud database) with encryption in transit (HTTPS/TLS). We use industry-standard security practices to protect your information.</p>
          <p>Session authentication uses encrypted cookies that expire after 7 days. Passwords are hashed and never stored in plain text.</p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>We use the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600">
            <li><strong className="text-gray-800">Razorpay</strong> — payment processing. Subject to <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Razorpay&apos;s privacy policy</a>.</li>
            <li><strong className="text-gray-800">Google OAuth</strong> — optional sign-in. Subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google&apos;s privacy policy</a>.</li>
            <li><strong className="text-gray-800">Google Fonts</strong> — fonts used in invite templates. No personal data is shared.</li>
            <li><strong className="text-gray-800">Vercel</strong> — hosting platform. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel&apos;s privacy policy</a>.</li>
          </ul>
        </Section>

        <Section title="5. Your Invitation URL">
          <p>Your invitation URL (e.g., wedcraft.in/invite/rahul-weds-priya) is publicly accessible — anyone with the link can view your invitation. Do not include sensitive personal information in your invitation that you would not want publicly visible.</p>
          <p>Your RSVP responses are only visible to you in your dashboard and are not shown to other guests.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your invitation and account data for as long as your account is active. Purchased invitations remain active for the period indicated in your plan (6, 12, or 24 months).</p>
          <p>You may request deletion of your account and data by contacting us at the email below.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-gray-600">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your data</li>
            <li>Update your wedding details at any time via your dashboard</li>
          </ul>
        </Section>

        <Section title="8. Cookies">
          <p>We use a single session cookie to keep you logged in. This cookie expires after 7 days or when you log out. We do not use advertising or tracking cookies.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify registered users by email of material changes. Continued use of WedCraft after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>If you have any questions about this Privacy Policy or your data, please contact us:</p>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl text-sm">
            <p className="font-medium text-gray-900">WedCraft</p>
            <p>Email: <a href="mailto:wedcraft@gmail.com" className="text-blue-600 hover:underline">wedcraft@gmail.com</a></p>
          </div>
        </Section>
      </div>
    </div>
  );
}