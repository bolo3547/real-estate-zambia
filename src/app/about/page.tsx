/**
 * Zambia Property - About Page
 */

import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'About Us | Zambia Property',
  description: 'Learn about Zambia Property - the leading real estate platform connecting buyers, sellers, and renters across Zambia.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Properties Listed', value: '5,000+' },
    { label: 'Happy Clients', value: '10,000+' },
    { label: 'Cities Covered', value: '50+' },
    { label: 'Years Experience', value: '5+' },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in honest, clear communication. Every listing is verified to ensure accuracy.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'Trust',
      description: 'Building lasting relationships through reliable service and verified agents.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'Using technology to make property search easier and more efficient for everyone.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Community',
      description: 'Supporting local communities and contributing to Zambia\'s real estate development.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-cream">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                About Zambia Property
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                We're on a mission to transform the real estate experience in Zambia by connecting 
                buyers, sellers, and renters through a modern, trusted platform.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-premium p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-neutral-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-6 text-center">Our Story</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <p className="text-neutral-600 mb-4 text-lg leading-relaxed">
                  Zambia Property was founded with a simple vision: to make finding and listing properties 
                  in Zambia easier, more transparent, and more accessible to everyone.
                </p>
                <p className="text-neutral-600 mb-4 text-lg leading-relaxed">
                  We noticed that the real estate market in Zambia was fragmented, with information scattered 
                  across multiple platforms and agents. Buyers struggled to find reliable listings, and sellers 
                  had difficulty reaching the right audience.
                </p>
                <p className="text-neutral-600 text-lg leading-relaxed">
                  Today, we're proud to be the leading property platform in Zambia, connecting thousands of 
                  buyers and sellers every month. We focus particularly on emerging markets like Mumbwa District, 
                  helping drive economic development in growing communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-neutral-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                  <p className="text-neutral-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 text-center text-white max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif font-bold mb-4">Ready to Find Your Dream Property?</h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of satisfied customers who found their perfect home through Zambia Property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/properties" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-cream transition-colors"
                >
                  Browse Properties
                </a>
                <a 
                  href="/auth/register" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  List Your Property
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
