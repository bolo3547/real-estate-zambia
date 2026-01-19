/**
 * Terms of Service Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Zambia Property platform.',
};

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-2">
              Terms of Service
            </h1>
            <p className="text-neutral-500 mb-8">Last updated: January 19, 2026</p>

            <div className="prose prose-neutral max-w-none">
              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-600 mb-4">
                By accessing and using Zambia Property ("the Platform"), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">2. Description of Service</h2>
              <p className="text-neutral-600 mb-4">
                Zambia Property is an online real estate platform that connects property buyers, sellers, renters, 
                landlords, and real estate agents in Zambia. We provide a marketplace for listing and searching 
                properties, but we do not directly participate in transactions between users.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">3. User Accounts</h2>
              <p className="text-neutral-600 mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">4. Property Listings</h2>
              <p className="text-neutral-600 mb-4">
                Users who list properties agree to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Only list properties they own or are authorized to list</li>
                <li>Provide accurate and truthful information about properties</li>
                <li>Not post misleading, fraudulent, or deceptive listings</li>
                <li>Keep listing information up-to-date</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">5. Prohibited Activities</h2>
              <p className="text-neutral-600 mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 mb-4 space-y-2">
                <li>Use the platform for any illegal purpose</li>
                <li>Post false, inaccurate, or misleading content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems to access the platform without permission</li>
                <li>Interfere with the proper working of the platform</li>
              </ul>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">6. Fees and Payments</h2>
              <p className="text-neutral-600 mb-4">
                Some features of Zambia Property may require payment. All fees are quoted in Zambian Kwacha (ZMW) 
                unless otherwise stated. Fees are non-refundable except as required by law or as explicitly stated.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">7. Intellectual Property</h2>
              <p className="text-neutral-600 mb-4">
                The Platform and its content, features, and functionality are owned by Zambia Property and are 
                protected by copyright, trademark, and other intellectual property laws. You may not reproduce, 
                distribute, or create derivative works without our express written permission.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-neutral-600 mb-4">
                The Platform is provided "as is" without warranties of any kind. We do not guarantee the accuracy, 
                completeness, or reliability of any listings or content. We are not responsible for verifying the 
                accuracy of property information posted by users.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">9. Limitation of Liability</h2>
              <p className="text-neutral-600 mb-4">
                To the maximum extent permitted by law, Zambia Property shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages resulting from your use of the Platform 
                or any transactions conducted through it.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">10. Indemnification</h2>
              <p className="text-neutral-600 mb-4">
                You agree to indemnify and hold harmless Zambia Property, its officers, directors, employees, 
                and agents from any claims, damages, losses, or expenses arising from your use of the Platform 
                or violation of these terms.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">11. Changes to Terms</h2>
              <p className="text-neutral-600 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes via email or through the Platform. Continued use of the Platform after changes 
                constitutes acceptance of the new terms.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">12. Governing Law</h2>
              <p className="text-neutral-600 mb-4">
                These terms shall be governed by and construed in accordance with the laws of the Republic of 
                Zambia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Zambia.
              </p>

              <h2 className="text-xl font-semibold text-neutral-900 mt-8 mb-4">13. Contact Us</h2>
              <p className="text-neutral-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-neutral-600">
                <strong>Zambia Property</strong><br />
                Email: legal@zambiaproperty.com<br />
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
