'use client';

/**
 * Premium Agents Listing Page
 * Browse all real estate agents
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, FadeInView, SlideIn, StaggerChildren, StaggerItem } from '@/components/mobile/PageTransition';
import { AgentCardSkeleton } from '@/components/mobile/Skeleton';
import { NoAgentsFound } from '@/components/mobile/EmptyState';

// Mock agents
const agents = [
  {
    id: '1',
    name: 'Sarah Mwape',
    title: 'Senior Property Consultant',
    company: 'ZamReal Properties',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop',
    rating: 4.9,
    reviews: 89,
    listings: 24,
    sold: 156,
    verified: true,
    superAgent: true,
    areas: ['Kabulonga', 'Woodlands'],
    specializations: ['Residential', 'Luxury'],
  },
  {
    id: '2',
    name: 'James Phiri',
    title: 'Investment Specialist',
    company: 'Prime Estates',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 64,
    listings: 18,
    sold: 98,
    verified: true,
    superAgent: false,
    areas: ['Northmead', 'Roma'],
    specializations: ['Commercial', 'Investment'],
  },
  {
    id: '3',
    name: 'Grace Banda',
    title: 'Rental Specialist',
    company: 'ZamReal Properties',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    rating: 4.7,
    reviews: 52,
    listings: 32,
    sold: 74,
    verified: true,
    superAgent: true,
    areas: ['Rhodes Park', 'Longacres'],
    specializations: ['Rentals', 'Apartments'],
  },
  {
    id: '4',
    name: 'Michael Chanda',
    title: 'Property Consultant',
    company: 'Lusaka Homes',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    rating: 4.6,
    reviews: 38,
    listings: 15,
    sold: 45,
    verified: false,
    superAgent: false,
    areas: ['Chelston', 'Chawama'],
    specializations: ['Residential'],
  },
  {
    id: '5',
    name: 'Mary Ngosa',
    title: 'Luxury Property Expert',
    company: 'Elite Realty',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    rating: 4.9,
    reviews: 112,
    listings: 28,
    sold: 189,
    verified: true,
    superAgent: true,
    areas: ['Ibex Hill', 'Kabulonga'],
    specializations: ['Luxury', 'Villas'],
  },
];

// Filter options
const filterOptions = {
  specializations: ['All', 'Residential', 'Commercial', 'Luxury', 'Rentals', 'Investment', 'Apartments'],
  areas: ['All Areas', 'Kabulonga', 'Woodlands', 'Rhodes Park', 'Northmead', 'Roma', 'Ibex Hill'],
  sortBy: ['Most Relevant', 'Highest Rated', 'Most Reviews', 'Most Sales'],
};

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter agents
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'All' ||
      agent.specializations.includes(selectedSpecialization);
    const matchesArea = selectedArea === 'All Areas' ||
      agent.areas.includes(selectedArea);
    return matchesSearch && matchesSpecialization && matchesArea;
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream pb-24">
        {/* Header */}
        <div className="bg-white shadow-soft sticky top-0 z-30">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold text-dark">Find Agents</h1>
            <p className="text-sm text-muted">Connect with top real estate professionals</p>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agents..."
                  className="w-full pl-11 pr-4 py-3 bg-cream border border-gray-200 rounded-2xl text-dark placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {filterOptions.specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedSpecialization === spec
                      ? 'bg-primary text-white'
                      : 'bg-cream text-muted border border-gray-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 py-3">
          <p className="text-sm text-muted">
            <span className="font-semibold text-dark">{filteredAgents.length}</span> agents found
            {selectedSpecialization !== 'All' && ` in ${selectedSpecialization}`}
          </p>
        </div>

        {/* Agents List */}
        <div className="px-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <AgentCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAgents.length === 0 ? (
            <NoAgentsFound />
          ) : (
            <StaggerChildren>
              <div className="space-y-4">
                {filteredAgents.map((agent) => (
                  <StaggerItem key={agent.id}>
                    <Link
                      href={`/agents/${agent.id}`}
                      className="block bg-white rounded-3xl p-4 shadow-soft"
                    >
                      <div className="flex gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <Image
                            src={agent.image}
                            alt={agent.name}
                            width={72}
                            height={72}
                            className="rounded-2xl object-cover"
                          />
                          {agent.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-dark truncate">{agent.name}</h3>
                            {agent.superAgent && (
                              <span className="flex-shrink-0 px-2 py-0.5 bg-gold/20 text-gold text-xs font-medium rounded-full">
                                ⭐ Super
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary">{agent.title}</p>
                          <p className="text-xs text-muted">{agent.company}</p>

                          {/* Rating */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-semibold text-dark text-sm">{agent.rating}</span>
                              <span className="text-xs text-muted">({agent.reviews})</span>
                            </div>
                            <span className="text-xs text-muted">•</span>
                            <span className="text-xs text-muted">{agent.sold}+ sold</span>
                          </div>

                          {/* Areas */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agent.areas.slice(0, 2).map((area) => (
                              <span key={area} className="px-2 py-0.5 bg-cream text-muted text-xs rounded-full">
                                📍 {area}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex-1 text-center">
                          <p className="text-lg font-bold text-primary">{agent.listings}</p>
                          <p className="text-xs text-muted">Active Listings</p>
                        </div>
                        <div className="flex-1 text-center border-x border-gray-100">
                          <p className="text-lg font-bold text-primary">{agent.sold}+</p>
                          <p className="text-xs text-muted">Properties Sold</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="text-lg font-bold text-primary">{agent.reviews}</p>
                          <p className="text-xs text-muted">Reviews</p>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </div>
            </StaggerChildren>
          )}
        </div>

        {/* Filter Bottom Sheet */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle */}
                <div className="py-3 flex justify-center">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                <div className="px-4 pb-8 max-h-[calc(85vh-60px)] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-dark">Filters</h2>
                    <button
                      onClick={() => {
                        setSelectedSpecialization('All');
                        setSelectedArea('All Areas');
                      }}
                      className="text-primary text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Specialization */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-dark mb-3">Specialization</h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.specializations.map((spec) => (
                        <button
                          key={spec}
                          onClick={() => setSelectedSpecialization(spec)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedSpecialization === spec
                              ? 'bg-primary text-white'
                              : 'bg-cream text-muted border border-gray-200'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Area */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-dark mb-3">Service Area</h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.areas.map((area) => (
                        <button
                          key={area}
                          onClick={() => setSelectedArea(area)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedArea === area
                              ? 'bg-primary text-white'
                              : 'bg-cream text-muted border border-gray-200'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg shadow-soft"
                  >
                    Show {filteredAgents.length} Agents
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
