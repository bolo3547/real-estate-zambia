/**
 * Zambia Property - Resources for Landlords Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const resources = [
  {
    category: 'Getting Started',
    items: [
      {
        title: 'How to Create Your First Listing',
        description: 'A step-by-step guide to creating an effective property listing that attracts quality tenants.',
        icon: '📝',
        href: '#first-listing',
      },
      {
        title: 'Setting the Right Price',
        description: 'Learn how to research market rates and price your property competitively.',
        icon: '💰',
        href: '#pricing',
      },
      {
        title: 'Taking Great Photos',
        description: 'Tips for capturing photos that showcase your property in the best light.',
        icon: '📸',
        href: '#photos',
      },
    ],
  },
  {
    category: 'Legal & Compliance',
    items: [
      {
        title: 'Zambian Tenancy Laws',
        description: 'Understanding your rights and obligations as a landlord in Zambia.',
        icon: '⚖️',
        href: '#laws',
      },
      {
        title: 'Rental Agreement Templates',
        description: 'Download free, legally compliant rental agreement templates.',
        icon: '📄',
        href: '#agreements',
      },
      {
        title: 'Tax Guide for Landlords',
        description: 'What you need to know about rental income tax in Zambia.',
        icon: '🧾',
        href: '#taxes',
      },
    ],
  },
  {
    category: 'Property Management',
    items: [
      {
        title: 'Tenant Screening Guide',
        description: 'How to properly vet potential tenants and avoid problematic rentals.',
        icon: '🔍',
        href: '#screening',
      },
      {
        title: 'Maintenance & Repairs',
        description: 'Best practices for property maintenance and handling repair requests.',
        icon: '🔧',
        href: '#maintenance',
      },
      {
        title: 'Handling Disputes',
        description: 'How to resolve common landlord-tenant disputes professionally.',
        icon: '🤝',
        href: '#disputes',
      },
    ],
  },
];

const guides = [
  {
    title: 'The Complete Landlord Guide',
    description: 'Everything you need to know about being a successful landlord in Zambia.',
    pages: '42 pages',
    format: 'PDF',
  },
  {
    title: 'Rental Agreement Pack',
    description: 'Three professionally drafted rental agreement templates.',
    pages: '15 pages',
    format: 'DOCX',
  },
  {
    title: 'Property Inspection Checklist',
    description: 'Comprehensive checklist for move-in and move-out inspections.',
    pages: '8 pages',
    format: 'PDF',
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Resources for Landlords
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Everything you need to successfully list, manage, and profit from your property.
            </p>
          </div>
        </section>

        {/* Resources Grid */}
        {resources.map((section) => (
          <section key={section.category} className="py-12 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{section.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                  >
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Downloadable Guides */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Downloadable Guides</h2>
              <p className="text-gray-600">Download our comprehensive guides to help you succeed as a landlord.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <div key={guide.title} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{guide.pages} • {guide.format}</span>
                    <button className="text-primary font-medium text-sm hover:underline">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Webinars Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-gold/20 to-gold/10 rounded-3xl p-8 md:p-12">
              <div className="max-w-2xl">
                <span className="text-gold font-medium text-sm uppercase tracking-wide">Coming Soon</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                  Free Landlord Webinars
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our expert-led webinars covering topics like tenant screening, legal compliance, property marketing, and more.
                </p>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Get Notified
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to List Your Property?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Put your knowledge into action. Create your listing today and start reaching thousands of potential tenants.
            </p>
            <Link
              href="/auth/register?role=LANDLORD"
              className="inline-block px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              List Your Property
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
