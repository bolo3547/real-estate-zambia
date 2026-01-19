'use client';

/**
 * Premium Agent Profile Page
 * Detailed agent information with listings and reviews
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeInView, SlideIn, StaggerChildren, StaggerItem } from '@/components/mobile/PageTransition';
import { StickyContactBar } from '@/components/mobile/StickyContactBar';

// Mock agent data
const agent = {
  id: '1',
  name: 'Sarah Mwape',
  title: 'Senior Property Consultant',
  company: 'ZamReal Properties',
  image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=400&fit=crop',
  phone: '+260971234567',
  email: 'sarah.mwape@zamreal.com',
  whatsapp: '+260971234567',
  verified: true,
  superAgent: true,
  bio: 'With over 8 years of experience in Zambian real estate, I specialize in luxury properties in Lusaka and Copperbelt regions. My passion is helping families find their dream homes and investors secure profitable deals.',
  languages: ['English', 'Nyanja', 'Bemba'],
  areas: ['Kabulonga', 'Woodlands', 'Rhodes Park', 'Northmead'],
  specializations: ['Residential', 'Luxury Homes', 'Investment Properties'],
  stats: {
    listings: 24,
    sold: 156,
    reviews: 89,
    rating: 4.9,
    responseTime: '< 1 hour',
    experience: '8+ years',
  },
  socials: {
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  },
};

// Mock listings
const agentListings = [
  {
    id: '1',
    title: 'Luxury Villa in Kabulonga',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
    beds: 5,
    baths: 4,
    type: 'For Sale',
  },
  {
    id: '2',
    title: 'Modern Apartment Woodlands',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
    beds: 3,
    baths: 2,
    type: 'For Rent',
  },
  {
    id: '3',
    title: 'Executive Townhouse',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
    beds: 4,
    baths: 3,
    type: 'For Sale',
  },
];

// Mock reviews
const reviews = [
  {
    id: '1',
    user: 'James Phiri',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Sarah helped us find the perfect family home in Kabulonga. Her knowledge of the market and negotiation skills saved us a lot of money. Highly recommended!',
  },
  {
    id: '2',
    user: 'Grace Banda',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    date: '1 month ago',
    comment: 'Professional, responsive, and genuinely cares about her clients. Made the entire process seamless.',
  },
  {
    id: '3',
    user: 'Michael Chanda',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    rating: 4,
    date: '2 months ago',
    comment: 'Great experience working with Sarah on my investment property purchase. She provided valuable insights into the market.',
  },
];

export default function AgentProfilePage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');
  const [showFullBio, setShowFullBio] = useState(false);

  const tabs = [
    { id: 'listings', label: 'Listings', count: agent.stats.listings },
    { id: 'reviews', label: 'Reviews', count: agent.stats.reviews },
    { id: 'about', label: 'About' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream pb-28">
        {/* Cover Image */}
        <div className="relative h-48">
          <Image
            src={agent.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          
          {/* Back Button */}
          <Link href="/agents" className="absolute top-12 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          
          {/* Share Button */}
          <button className="absolute top-12 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-4 -mt-16 relative z-10">
          <FadeInView>
            <div className="bg-white rounded-3xl p-5 shadow-premium">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    width={80}
                    height={80}
                    className="rounded-2xl object-cover border-4 border-white shadow-soft"
                  />
                  {agent.verified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-dark">{agent.name}</h1>
                    {agent.superAgent && (
                      <span className="px-2 py-0.5 bg-gold/20 text-gold text-xs font-medium rounded-full">
                        ⭐ Super Agent
                      </span>
                    )}
                  </div>
                  <p className="text-primary text-sm font-medium">{agent.title}</p>
                  <p className="text-muted text-sm">{agent.company}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold text-dark">{agent.stats.rating}</span>
                    </div>
                    <span className="text-muted text-sm">({agent.stats.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{agent.stats.sold}+</p>
                  <p className="text-xs text-muted">Properties Sold</p>
                </div>
                <div className="text-center border-x border-gray-100">
                  <p className="text-2xl font-bold text-primary">{agent.stats.experience}</p>
                  <p className="text-xs text-muted">Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{agent.stats.responseTime}</p>
                  <p className="text-xs text-muted">Response Time</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 mt-5">
                {Object.entries(agent.socials).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center text-muted hover:text-primary transition-colors"
                  >
                    {platform === 'facebook' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {platform === 'linkedin' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    )}
                    {platform === 'twitter' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </FadeInView>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-6">
          <div className="flex bg-white rounded-2xl p-1.5 shadow-soft">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-muted'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className={`ml-1 ${activeTab === tab.id ? 'text-white/80' : 'text-muted'}`}>
                    ({tab.count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 mt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'listings' && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {agentListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/properties/${listing.id}`}
                    className="flex bg-white rounded-2xl overflow-hidden shadow-soft"
                  >
                    <div className="relative w-28 h-24">
                      <Image
                        src={listing.image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                        listing.type === 'For Sale' ? 'bg-primary text-white' : 'bg-gold text-dark'
                      }`}>
                        {listing.type}
                      </span>
                    </div>
                    <div className="flex-1 p-3">
                      <h3 className="font-semibold text-dark text-sm line-clamp-1">{listing.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <span>{listing.beds} beds</span>
                        <span>•</span>
                        <span>{listing.baths} baths</span>
                      </div>
                      <p className="text-primary font-bold mt-2">
                        {listing.type === 'For Rent' ? `$${listing.price.toLocaleString()}/mo` : `$${listing.price.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center pr-3">
                      <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
                
                <Link
                  href={`/properties?agent=${agent.id}`}
                  className="block text-center py-4 bg-primary/10 text-primary rounded-2xl font-medium"
                >
                  View All {agent.stats.listings} Listings
                </Link>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Rating Summary */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-dark">{agent.stats.rating}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(agent.stats.rating) ? 'text-gold' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-muted mt-1">{agent.stats.reviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs text-muted w-3">{rating}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gold rounded-full"
                              style={{
                                width: `${rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 5 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-4 shadow-soft">
                    <div className="flex items-start gap-3">
                      <Image
                        src={review.avatar}
                        alt={review.user}
                        width={40}
                        height={40}
                        className="rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-dark">{review.user}</h4>
                          <span className="text-xs text-muted">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3 h-3 ${star <= review.rating ? 'text-gold' : 'text-gray-200'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-muted mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Bio */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <h3 className="font-bold text-dark mb-3">About</h3>
                  <p className={`text-muted text-sm leading-relaxed ${!showFullBio && 'line-clamp-3'}`}>
                    {agent.bio}
                  </p>
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="text-primary text-sm font-medium mt-2"
                  >
                    {showFullBio ? 'Show less' : 'Read more'}
                  </button>
                </div>

                {/* Specializations */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <h3 className="font-bold text-dark mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.specializations.map((spec) => (
                      <span key={spec} className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Service Areas */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <h3 className="font-bold text-dark mb-3">Service Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.areas.map((area) => (
                      <span key={area} className="px-3 py-1.5 bg-cream text-dark text-sm rounded-full">
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <h3 className="font-bold text-dark mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.languages.map((lang) => (
                      <span key={lang} className="px-3 py-1.5 bg-cream text-dark text-sm rounded-full">
                        🗣️ {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-white rounded-2xl p-5 shadow-soft">
                  <h3 className="font-bold text-dark mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-dark">{agent.phone}</span>
                    </a>
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-dark">{agent.email}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky Contact Bar */}
        <StickyContactBar
          agentName={agent.name}
          phone={agent.phone}
          whatsapp={agent.whatsapp}
        />
      </div>
    </PageTransition>
  );
}
