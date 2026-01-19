/**
 * Zambia Property - Investors Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const stats = [
  { label: 'Monthly Active Users', value: '150K+' },
  { label: 'Property Listings', value: '10,000+' },
  { label: 'Transactions Facilitated', value: '$50M+' },
  { label: 'Year-over-Year Growth', value: '180%' },
];

const milestones = [
  { year: '2022', event: 'Founded in Lusaka, Zambia' },
  { year: '2023', event: 'Launched mobile app, reached 1,000 listings' },
  { year: '2024', event: 'Expanded to all 10 provinces, 50,000 users' },
  { year: '2025', event: 'AI matching launched, 100,000+ users' },
  { year: '2026', event: 'Expanding to neighboring countries' },
];

const investors = [
  {
    name: 'Seed Round',
    amount: '$500K',
    date: '2022',
    lead: 'Angel Investors',
  },
  {
    name: 'Series A',
    amount: '$3M',
    date: '2024',
    lead: 'African Tech Ventures',
  },
];

const leadership = [
  {
    name: 'David Mwamba',
    role: 'CEO & Co-Founder',
    bio: 'Former property developer with 15 years experience in Zambian real estate.',
  },
  {
    name: 'Sarah Chanda',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer, built scalable platforms serving millions.',
  },
  {
    name: 'Michael Banda',
    role: 'CFO',
    bio: 'Former investment banker with expertise in African markets.',
  },
];

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Investor Relations
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Building Africa's leading property platform, one listing at a time.
            </p>
            <a
              href="mailto:investors@zambiaproperty.com"
              className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Contact Investor Relations
            </a>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Key Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p>
                Zambia Property was founded in 2022 with a simple mission: make finding a home in Zambia easier. 
                The Zambian property market has traditionally been fragmented, with listings scattered across 
                classifieds, social media, and word of mouth. We saw an opportunity to create a unified platform 
                that connects property seekers with landlords and agents.
              </p>
              <p>
                Today, we're the leading property platform in Zambia with over 10,000 active listings and 150,000 
                monthly users. We've facilitated over $50 million in property transactions and are growing at 180% 
                year-over-year.
              </p>
              <p>
                Our vision extends beyond Zambia. We're building technology that can transform property markets 
                across Africa, starting with expansion into neighboring countries in 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div
                      className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}
                    >
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="text-primary font-bold mb-1">{milestone.year}</div>
                        <div className="text-gray-600 text-sm">{milestone.event}</div>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Funding */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Funding History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {investors.map((round) => (
                <div
                  key={round.name}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{round.amount}</div>
                  <div className="text-lg font-semibold text-gray-900">{round.name}</div>
                  <div className="text-gray-600">Led by {round.lead}</div>
                  <div className="text-gray-400 text-sm mt-2">{round.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((person) => (
                <div key={person.name} className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{person.name}</h3>
                  <p className="text-primary text-sm mb-2">{person.role}</p>
                  <p className="text-gray-600 text-sm">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Investing?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              We're always open to conversations with investors who share our vision for transforming 
              African real estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:investors@zambiaproperty.com"
                className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Email Investor Relations
              </a>
              <button className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors">
                Download Investor Deck
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
