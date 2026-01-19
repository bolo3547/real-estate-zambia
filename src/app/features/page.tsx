/**
 * Zambia Property - New Features Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const newFeatures = [
  {
    title: 'AI-Powered Property Matching',
    description: 'Our smart algorithm learns your preferences and suggests properties that match your lifestyle and budget.',
    status: 'New',
    date: 'January 2026',
    icon: '🤖',
  },
  {
    title: 'Virtual Property Tours',
    description: '360° virtual tours let you explore properties from the comfort of your home.',
    status: 'New',
    date: 'January 2026',
    icon: '🎥',
  },
  {
    title: 'Instant Messaging',
    description: 'Real-time chat with landlords and agents directly within the platform.',
    status: 'Improved',
    date: 'December 2025',
    icon: '💬',
  },
  {
    title: 'Price History & Trends',
    description: 'See how property prices have changed over time to make informed decisions.',
    status: 'New',
    date: 'December 2025',
    icon: '📈',
  },
  {
    title: 'Saved Searches',
    description: 'Save your search criteria and get notified when new matching properties are listed.',
    status: 'Improved',
    date: 'November 2025',
    icon: '🔔',
  },
  {
    title: 'Neighborhood Insights',
    description: 'Detailed information about schools, hospitals, shops, and transport in each area.',
    status: 'New',
    date: 'November 2025',
    icon: '🏘️',
  },
];

const upcomingFeatures = [
  {
    title: 'Mortgage Calculator',
    description: 'Calculate monthly payments and compare loan options from multiple banks.',
    eta: 'Q1 2026',
  },
  {
    title: 'Rental Application System',
    description: 'Apply for rentals online with automatic document verification.',
    eta: 'Q1 2026',
  },
  {
    title: 'Property Valuation Tool',
    description: 'Get an instant estimate of your property\'s market value.',
    eta: 'Q2 2026',
  },
  {
    title: 'Tenant Screening Service',
    description: 'Background checks and credit reports for landlords.',
    eta: 'Q2 2026',
  },
];

const changelog = [
  { version: '2.5.0', date: 'Jan 15, 2026', changes: ['AI property matching', 'Virtual tours support', 'Performance improvements'] },
  { version: '2.4.0', date: 'Dec 20, 2025', changes: ['New messaging system', 'Price history charts', 'Bug fixes'] },
  { version: '2.3.0', date: 'Nov 15, 2025', changes: ['Neighborhood insights', 'Improved search filters', 'Mobile app updates'] },
  { version: '2.2.0', date: 'Oct 10, 2025', changes: ['Saved searches', 'Email notifications', 'Dashboard redesign'] },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              What's New
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              New Features
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We're constantly improving Zambia Property to help you find your perfect home.
            </p>
          </div>
        </section>

        {/* New Features Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recently Launched</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{feature.icon}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        feature.status === 'New'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <p className="text-xs text-gray-400">{feature.date}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                        {feature.eta}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Changelog */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Changelog</h2>
            <div className="space-y-6">
              {changelog.map((release) => (
                <div
                  key={release.version}
                  className="bg-white border border-gray-200 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium">
                      v{release.version}
                    </span>
                    <span className="text-gray-500 text-sm">{release.date}</span>
                  </div>
                  <ul className="space-y-2">
                    {release.changes.map((change, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Request */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Have a Feature Idea?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              We love hearing from our users! Let us know what features would make your experience better.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Submit a Feature Request
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
