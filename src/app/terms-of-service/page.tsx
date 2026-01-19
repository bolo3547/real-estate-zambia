/**
 * Zambia Property - Terms of Service Page
 */

import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Terms of Service | Zambia Property',
  description: 'Read the terms and conditions for using Zambia Property platform.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-6">
              <strong>Last Updated:</strong> January 2026
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-neutral-600 mb-4">
                By accessing or using Zambia Property, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Description of Service</h2>
              <p className="text-neutral-600 mb-4">
                Zambia Property is an online platform that connects property buyers, sellers, landlords, and tenants 
                in Zambia. We provide a marketplace for listing and searching for real estate properties.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. User Accounts</h2>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One person may not maintain multiple accounts</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Property Listings</h2>
              <p className="text-neutral-600 mb-4">When creating property listings, you agree to:</p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Provide accurate and truthful information about properties</li>
                <li>Only list properties you have the legal right to sell or rent</li>
                <li>Use only photos that accurately represent the property</li>
                <li>Keep listing information up to date</li>
                <li>Remove listings promptly when properties are no longer available</li>
                <li>Comply with all applicable Zambian real estate laws and regulations</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Prohibited Activities</h2>
              <p className="text-neutral-600 mb-4">You may not:</p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Post false, misleading, or fraudulent listings</li>
                <li>Use the platform for illegal activities</li>
                <li>Harass, threaten, or abuse other users</li>
                <li>Scrape or collect user data without permission</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Circumvent any security measures</li>
                <li>Post discriminatory content</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Fees and Payments</h2>
              <p className="text-neutral-600 mb-4">
                Basic listing services are free. Premium features may require payment. 
                All fees are non-refundable unless otherwise stated. We reserve the right to 
                modify our pricing at any time with reasonable notice.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-neutral-600 mb-4">
                Zambia Property acts as a platform connecting buyers and sellers. We do not:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Verify the accuracy of property listings</li>
                <li>Guarantee the quality or condition of properties</li>
                <li>Participate in or guarantee transactions between users</li>
                <li>Provide legal, financial, or real estate advice</li>
              </ul>
              <p className="text-neutral-600 mt-4">
                Users are responsible for conducting their own due diligence before entering into any transactions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-neutral-600 mb-4">
                To the maximum extent permitted by law, Zambia Property shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising from your 
                use of the platform or any transactions conducted through it.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">9. Intellectual Property</h2>
              <p className="text-neutral-600 mb-4">
                All content on Zambia Property, including logos, designs, and software, is owned by 
                or licensed to us. You may not copy, modify, or distribute our content without permission.
                By posting content, you grant us a license to use it on our platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">10. Modifications to Terms</h2>
              <p className="text-neutral-600 mb-4">
                We may modify these terms at any time. Continued use of the platform after changes 
                constitutes acceptance of the new terms. We will notify users of significant changes 
                via email or platform notification.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">11. Governing Law</h2>
              <p className="text-neutral-600 mb-4">
                These terms are governed by the laws of the Republic of Zambia. Any disputes shall 
                be resolved in the courts of Zambia.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">12. Contact Information</h2>
              <p className="text-neutral-600 mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none text-neutral-600 space-y-2">
                <li><strong>Email:</strong> legal@zambiaproperty.com</li>
                <li><strong>Phone:</strong> +260 97 123 4567</li>
                <li><strong>Address:</strong> Lusaka, Zambia</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
