/**
 * Zambia Property - Hosting Responsibly Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const responsibilities = [
  {
    title: 'Accurate Listings',
    icon: '📝',
    description: 'Ensure your property descriptions, photos, and amenities are accurate and up-to-date.',
    tips: [
      'Use recent, high-quality photos',
      'List all amenities honestly',
      'Update availability regularly',
      'Disclose any property issues',
    ],
  },
  {
    title: 'Fair Pricing',
    icon: '💰',
    description: 'Set prices that reflect the true value of your property and market conditions.',
    tips: [
      'Research comparable properties',
      'Be transparent about all fees',
      'No hidden charges',
      'Honor advertised prices',
    ],
  },
  {
    title: 'Responsive Communication',
    icon: '💬',
    description: 'Respond to inquiries promptly and professionally.',
    tips: [
      'Reply within 24 hours',
      'Be clear and helpful',
      'Answer all questions honestly',
      'Maintain professional tone',
    ],
  },
  {
    title: 'Property Maintenance',
    icon: '🔧',
    description: 'Keep your property safe, clean, and well-maintained.',
    tips: [
      'Regular maintenance checks',
      'Address repairs promptly',
      'Ensure safety features work',
      'Keep common areas clean',
    ],
  },
  {
    title: 'Legal Compliance',
    icon: '⚖️',
    description: 'Follow all local laws and regulations for rental properties.',
    tips: [
      'Register your rental property',
      'Use proper rental agreements',
      'Pay applicable taxes',
      'Follow tenant rights laws',
    ],
  },
  {
    title: 'Respect & Inclusivity',
    icon: '🤝',
    description: 'Treat all potential tenants fairly and without discrimination.',
    tips: [
      'No discrimination based on race, religion, or gender',
      'Fair tenant selection criteria',
      'Respect tenant privacy',
      'Be culturally sensitive',
    ],
  },
];

const commitments = [
  {
    title: 'Community Standards',
    description: 'We expect all hosts to maintain high standards that benefit the entire Zambian property community.',
  },
  {
    title: 'Quality Assurance',
    description: 'Properties that consistently receive poor reviews may be removed from the platform.',
  },
  {
    title: 'Support System',
    description: 'We provide resources, guides, and support to help you succeed as a responsible host.',
  },
];

export default function ResponsibleHostingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hosting Responsibly
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Building a trusted property community in Zambia starts with responsible hosting practices.
            </p>
          </div>
        </section>

        {/* Responsibilities Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Your Responsibilities as a Host
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Being a great host means more than just listing a property. Here's what we expect from our hosting community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {responsibilities.map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Commitment to You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {commitments.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition Program */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Superhost Program</h2>
                  <p className="text-gray-600 mb-4">
                    Hosts who consistently provide exceptional experiences earn Superhost status, gaining increased visibility and trust badges on their listings.
                  </p>
                  <Link
                    href="/resources"
                    className="text-primary font-medium hover:underline"
                  >
                    Learn how to become a Superhost →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Be a Responsible Host?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of landlords who are building a trusted property community in Zambia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register?role=LANDLORD"
                className="px-8 py-3 bg-white text-green-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Start Hosting
              </Link>
              <Link
                href="/resources"
                className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                View Resources
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
