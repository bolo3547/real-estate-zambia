/**
 * Zambia Property - Help Center Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const helpCategories = [
  {
    title: 'Getting Started',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    articles: [
      { title: 'How to create an account', href: '#create-account' },
      { title: 'Searching for properties', href: '#search' },
      { title: 'Understanding listing types', href: '#listing-types' },
      { title: 'Making an inquiry', href: '#inquiry' },
    ],
  },
  {
    title: 'For Renters & Buyers',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    articles: [
      { title: 'How to schedule a viewing', href: '#viewing' },
      { title: 'Understanding pricing', href: '#pricing' },
      { title: 'Payment methods accepted', href: '#payments' },
      { title: 'Document requirements', href: '#documents' },
    ],
  },
  {
    title: 'For Landlords & Agents',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    articles: [
      { title: 'How to list a property', href: '#list-property' },
      { title: 'Pricing your property', href: '#property-pricing' },
      { title: 'Managing inquiries', href: '#manage-inquiries' },
      { title: 'Verification process', href: '#verification' },
    ],
  },
  {
    title: 'Account & Security',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    articles: [
      { title: 'Changing your password', href: '#password' },
      { title: 'Two-factor authentication', href: '#2fa' },
      { title: 'Deleting your account', href: '#delete-account' },
      { title: 'Privacy settings', href: '#privacy-settings' },
    ],
  },
];

const popularArticles = [
  { title: 'How do I contact a landlord?', views: '12.5k views' },
  { title: 'What documents do I need to rent?', views: '8.2k views' },
  { title: 'How to report a suspicious listing', views: '6.8k views' },
  { title: 'Understanding deposit requirements', views: '5.4k views' },
  { title: 'How to verify a property', views: '4.9k views' },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How can we help you?
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary rounded-full text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {helpCategories.map((category) => (
                <div
                  key={category.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-primary mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.title}>
                        <Link
                          href={article.href}
                          className="text-sm text-gray-600 hover:text-primary hover:underline"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular articles</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {popularArticles.map((article, index) => (
                <Link
                  key={article.title}
                  href="#"
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    index !== popularArticles.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-900 font-medium">{article.title}</span>
                  <span className="text-sm text-gray-500">{article.views}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-8">
              Our support team is here to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@zambiaproperty.com"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
