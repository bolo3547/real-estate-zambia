/**
 * Zambia Property - Careers Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const benefits = [
  { icon: '💰', title: 'Competitive Salary', description: 'Market-rate compensation with annual reviews' },
  { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive medical coverage for you and family' },
  { icon: '🏠', title: 'Remote Work', description: 'Flexible work-from-home options' },
  { icon: '📚', title: 'Learning Budget', description: 'Annual allowance for courses and conferences' },
  { icon: '🌴', title: 'Paid Time Off', description: '25 days annual leave plus public holidays' },
  { icon: '📈', title: 'Stock Options', description: 'Ownership stake in the company' },
];

const openPositions = [
  {
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Lusaka / Remote',
    type: 'Full-time',
    description: 'Build and scale our property platform using Next.js, TypeScript, and PostgreSQL.',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Lusaka',
    type: 'Full-time',
    description: 'Create beautiful, intuitive experiences for property seekers and landlords.',
  },
  {
    title: 'Customer Success Manager',
    department: 'Operations',
    location: 'Lusaka',
    type: 'Full-time',
    description: 'Help landlords succeed on our platform and ensure customer satisfaction.',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Lusaka / Remote',
    type: 'Full-time',
    description: 'Drive growth through creative marketing campaigns and partnerships.',
  },
  {
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Remote',
    type: 'Full-time',
    description: 'Turn data into insights that drive product and business decisions.',
  },
  {
    title: 'Sales Representative',
    department: 'Sales',
    location: 'Mumbwa',
    type: 'Full-time',
    description: 'Build relationships with property owners and grow our listings in Mumbwa District.',
  },
];

const values = [
  {
    title: 'Customer First',
    description: 'Everything we do starts with our users\' needs.',
  },
  {
    title: 'Move Fast',
    description: 'We ship quickly, learn from feedback, and iterate.',
  },
  {
    title: 'Be Transparent',
    description: 'We communicate openly and honestly.',
  },
  {
    title: 'Think Big',
    description: 'We\'re building something that will transform real estate in Africa.',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Help us transform how Zambians find, rent, and buy property.
            </p>
            <a
              href="#positions"
              className="inline-block px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Benefits & Perks</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              We take care of our team so they can take care of our customers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="bg-white rounded-2xl p-6 shadow-sm flex items-start gap-4"
                >
                  <span className="text-3xl">{benefit.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Open Positions</h2>
            <p className="text-gray-600 text-center mb-12">
              {openPositions.length} roles available
            </p>
            <div className="space-y-4">
              {openPositions.map((position) => (
                <div
                  key={position.title}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{position.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{position.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {position.department}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {position.location}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors whitespace-nowrap">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* No Match CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Don't See a Perfect Match?</h2>
            <p className="text-gray-400 mb-8">
              We're always looking for talented people. Send us your CV and we'll keep you in mind for future opportunities.
            </p>
            <a
              href="mailto:careers@zambiaproperty.com"
              className="inline-block px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition-colors"
            >
              Send Your CV
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
