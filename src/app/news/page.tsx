/**
 * Zambia Property - Newsroom Page
 */

import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const featuredNews = {
  title: 'Zambia Property Launches New AI-Powered Property Matching',
  description: 'Our latest feature uses advanced algorithms to match tenants with their perfect home based on preferences, budget, and lifestyle.',
  date: 'January 15, 2026',
  category: 'Product Update',
  image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
};

const newsArticles = [
  {
    title: 'Real Estate Market Report: Mumbwa District Q4 2025',
    description: 'An in-depth analysis of property trends, prices, and investment opportunities in Mumbwa District.',
    date: 'January 10, 2026',
    category: 'Market Report',
  },
  {
    title: 'Zambia Property Reaches 10,000 Active Listings',
    description: 'A milestone celebration as our platform continues to grow and serve the Zambian property market.',
    date: 'January 5, 2026',
    category: 'Company News',
  },
  {
    title: 'New Partnership with Zambian Banking Association',
    description: 'Streamlined mortgage applications now available through our platform.',
    date: 'December 28, 2025',
    category: 'Partnership',
  },
  {
    title: 'Mobile App Now Available for iOS and Android',
    description: 'Search for properties, manage listings, and communicate with landlords on the go.',
    date: 'December 20, 2025',
    category: 'Product Update',
  },
  {
    title: 'Understanding Property Registration in Zambia',
    description: 'A guide to the property registration process and why it matters.',
    date: 'December 15, 2025',
    category: 'Educational',
  },
  {
    title: 'Zambia Property Wins Tech Innovation Award',
    description: 'Recognized for transforming the real estate industry in Zambia.',
    date: 'December 10, 2025',
    category: 'Awards',
  },
];

const pressContacts = [
  {
    name: 'Media Inquiries',
    email: 'press@zambiaproperty.com',
    response: 'Response within 24 hours',
  },
  {
    name: 'Partnership Inquiries',
    email: 'partnerships@zambiaproperty.com',
    response: 'Response within 48 hours',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Newsroom
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The latest news, updates, and insights from Zambia Property.
            </p>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="#" className="group block">
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative aspect-video lg:aspect-auto">
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {featuredNews.category}
                      </span>
                      <span className="text-gray-500 text-sm">{featuredNews.date}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {featuredNews.title}
                    </h2>
                    <p className="text-gray-600 mb-6">{featuredNews.description}</p>
                    <span className="text-primary font-medium group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsArticles.map((article, index) => (
                <Link
                  key={index}
                  href="#"
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-xs">{article.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{article.description}</p>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>

        {/* Press Kit */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Press Kit</h2>
                  <p className="text-white/80">
                    Download our brand assets, logos, and company information.
                  </p>
                </div>
                <button className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Download Press Kit
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Press Contacts */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Press Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pressContacts.map((contact) => (
                <div key={contact.name} className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{contact.name}</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline block mb-2"
                  >
                    {contact.email}
                  </a>
                  <p className="text-sm text-gray-500">{contact.response}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest news and market insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
