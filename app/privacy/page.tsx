import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-structural-grid">
      <div className="max-w-6xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-8 text-stone-100">Privacy Policy</h1>
        
        <div className="space-y-6 text-base leading-relaxed text-stone-200">
          <p className="text-sm text-stone-300 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Name and email address when you preorder or sign up for our newsletter</li>
              <li>Shipping address for print editions</li>
              <li>Order preferences and special instructions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Process and fulfill your preorders</li>
              <li>Send you order confirmations and payment instructions</li>
              <li>Communicate about Console access and updates</li>
              <li>Send newsletter updates (if you've subscribed)</li>
              <li>Respond to your inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Data Storage and Security</h2>
            <p className="mb-4">
              Your information is stored securely and is not shared with third parties except as necessary to process your order (e.g., payment processors, shipping services). We use Formspree for form submissions and do not store payment information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Your Rights</h2>
            <p className="mb-4">
              You can request access to, correction of, or deletion of your personal information by contacting us at <a href="mailto:gigi@gigistardust.com" className="text-cyan-300 hover:text-cyan-200 underline">gigi@gigistardust.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-stone-100">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:gigi@gigistardust.com" className="text-cyan-300 hover:text-cyan-200 underline">gigi@gigistardust.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-300/30">
          <Link href="/" className="text-cyan-300 hover:text-cyan-200 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
