/**
 * Privacy Policy Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Zambia Property platform - how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-neutral-500 mb-8">Last updated: January 19, 2026</p>

            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-600 mb-6">
                At Zambia Property, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website and use our services.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">1. Information We Collect</h2>
              
              <h3 className="text-lg font-medium text-neutral-800 mt-6 mb-3">Personal Information</h3>
              <p className="text-neutral-600 mb-4">
                We may collect personal information that you voluntarily provide when:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Creating an account (name, email, phone number)</li>
                <li>Listing a property (property details, photos, location)</li>
                <li>Making inquiries about properties</li>
                <li>Contacting our support team</li>
                <li>Subscribing to our newsletter</li>
              </ul>

              <h3 className="text-lg font-medium text-neutral-800 mt-6 mb-3">Automatically Collected Information</h3>
              <p className="text-neutral-600 mb-4">
                When you access our platform, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
                <li>Usage data (pages visited, time spent, clicks)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-neutral-600 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process property listings and inquiries</li>
                <li>Send important updates and notifications</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-neutral-600 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li><strong>Other Users:</strong> Property information and contact details are shared with interested parties</li>
                <li><strong>Service Providers:</strong> Third parties who assist in operating our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
              <p className="text-neutral-600 mb-4">
                We do not sell your personal information to third parties for marketing purposes.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">4. Data Security</h2>
              <p className="text-neutral-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, 
                including:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments</li>
                <li>Access controls and employee training</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5. Your Rights</h2>
              <p className="text-neutral-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">6. Cookies</h2>
              <p className="text-neutral-600 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Keep you signed in</li>
                <li>Remember your preferences</li>
                <li>Analyze site traffic and usage</li>
                <li>Personalize content and ads</li>
              </ul>
              <p className="text-neutral-600 mb-4">
                You can control cookies through your browser settings. Disabling cookies may affect functionality.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">7. Third-Party Services</h2>
              <p className="text-neutral-600 mb-4">
                Our platform may contain links to third-party websites and integrates with services like Google 
                for authentication. These third parties have their own privacy policies, and we encourage you to 
                review them.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">8. Children's Privacy</h2>
              <p className="text-neutral-600 mb-4">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a minor, 
                please contact us immediately.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">9. Data Retention</h2>
              <p className="text-neutral-600 mb-4">
                We retain your personal information for as long as necessary to provide our services and fulfill 
                the purposes outlined in this policy. When you delete your account, we will delete or anonymize 
                your data within 30 days, except where retention is required by law.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">10. Changes to This Policy</h2>
              <p className="text-neutral-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of significant changes 
                by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">11. Contact Us</h2>
              <p className="text-neutral-600 mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights, contact us at:
              </p>
              <p className="text-neutral-600">
                <strong>Zambia Property</strong><br />
                Email: privacy@zambiaproperty.com<br />
                Address: Cairo Road, Lusaka, Zambia
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-200">
              <Link href="/" className="text-primary hover:text-primary-dark font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
