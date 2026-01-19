/**
 * Zambia Property - Privacy Policy Page
 */

import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

export const metadata = {
  title: 'Privacy Policy | Zambia Property',
  description: 'Learn how Zambia Property collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm prose prose-neutral max-w-none">
            <p className="text-neutral-600 mb-6">
              <strong>Last Updated:</strong> January 2026
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Introduction</h2>
              <p className="text-neutral-600 mb-4">
                Welcome to Zambia Property. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Information We Collect</h2>
              <p className="text-neutral-600 mb-4">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Name, email address, and phone number when you create an account</li>
                <li>Property listing information including photos, descriptions, and pricing</li>
                <li>Messages and inquiries you send through our platform</li>
                <li>Payment information for premium services</li>
                <li>Location data to provide relevant property listings</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-neutral-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent activities</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Information Sharing</h2>
              <p className="text-neutral-600 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Service providers who assist in our operations</li>
                <li>Other users when you make your contact information public on listings</li>
                <li>Law enforcement when required by law</li>
                <li>Business partners with your consent</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Data Security</h2>
              <p className="text-neutral-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, 
                and regular security assessments.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Your Rights</h2>
              <p className="text-neutral-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-neutral-600 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Cookies</h2>
              <p className="text-neutral-600 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our platform. 
                You can control cookies through your browser settings.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Contact Us</h2>
              <p className="text-neutral-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none text-neutral-600 space-y-2">
                <li><strong>Email:</strong> privacy@zambiaproperty.com</li>
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
