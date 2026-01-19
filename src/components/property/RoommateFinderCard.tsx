'use client';

/**
 * Roommate Finder Component
 * Help users find compatible roommates for shared rentals
 * Popular among students and young professionals in Zambia
 */

import { useState } from 'react';
import Link from 'next/link';

interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  occupation: string;
  budget: number;
  preferredAreas: string[];
  moveInDate: string;
  lifestyle: {
    smoking: boolean;
    pets: boolean;
    nightOwl: boolean;
    quiet: boolean;
    social: boolean;
  };
  bio: string;
  verified: boolean;
}

interface RoommateFinderCardProps {
  propertyId?: string;
  propertyTitle?: string;
  monthlyRent?: number;
}

// Mock roommate profiles
const mockRoommates: RoommateProfile[] = [
  {
    id: '1',
    name: 'Chanda M.',
    age: 26,
    gender: 'male',
    occupation: 'Software Developer',
    budget: 3000,
    preferredAreas: ['Mumbwa Town', 'Lusaka'],
    moveInDate: 'February 2026',
    lifestyle: { smoking: false, pets: false, nightOwl: false, quiet: true, social: true },
    bio: 'Working professional looking for a quiet and clean roommate. I work from home most days.',
    verified: true,
  },
  {
    id: '2',
    name: 'Natasha K.',
    age: 24,
    gender: 'female',
    occupation: 'Nurse at Mumbwa Hospital',
    budget: 2500,
    preferredAreas: ['Mumbwa Town'],
    moveInDate: 'January 2026',
    lifestyle: { smoking: false, pets: true, nightOwl: true, quiet: false, social: true },
    bio: 'Friendly nurse with flexible shifts. Looking for a female roommate to share costs.',
    verified: true,
  },
  {
    id: '3',
    name: 'Joseph B.',
    age: 22,
    gender: 'male',
    occupation: 'University Student',
    budget: 1500,
    preferredAreas: ['Nangoma', 'Mumbwa Town'],
    moveInDate: 'March 2026',
    lifestyle: { smoking: false, pets: false, nightOwl: true, quiet: false, social: true },
    bio: 'Final year student at UNZA. Need affordable accommodation near transport routes.',
    verified: false,
  },
];

export function RoommateFinderCard({ propertyId, propertyTitle, monthlyRent }: RoommateFinderCardProps) {
  const [showFinder, setShowFinder] = useState(false);
  const [filters, setFilters] = useState({
    gender: 'any',
    maxAge: 40,
    minBudget: 0,
  });

  const formatCurrency = (amount: number) => `K${amount.toLocaleString()}`;

  const filteredRoommates = mockRoommates.filter((rm) => {
    if (filters.gender !== 'any' && rm.gender !== filters.gender) return false;
    if (rm.age > filters.maxAge) return false;
    if (rm.budget < filters.minBudget) return false;
    return true;
  });

  const LifestyleTag = ({ active, label }: { active: boolean; label: string }) => (
    <span
      className={`inline-block px-2 py-1 rounded text-xs ${
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {active ? '✓' : '✗'} {label}
    </span>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <span className="text-xl">👥</span>
              Roommate Finder
            </h3>
            <p className="text-purple-100 text-sm">Split rent and find compatible housemates</p>
          </div>
          {monthlyRent && (
            <div className="text-right">
              <p className="text-sm text-purple-100">Split rent from</p>
              <p className="text-xl font-bold">{formatCurrency(Math.round(monthlyRent / 2))}</p>
              <p className="text-xs text-purple-200">per person</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {!showFinder ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Looking for a Roommate?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Find compatible roommates to share this property and split the costs.
            </p>
            <button
              onClick={() => setShowFinder(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Find Roommates
            </button>
          </div>
        ) : (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-gray-100">
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="any">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <select
                value={filters.maxAge}
                onChange={(e) => setFilters({ ...filters, maxAge: Number(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={25}>Under 25</option>
                <option value={30}>Under 30</option>
                <option value={35}>Under 35</option>
                <option value={40}>Under 40</option>
              </select>
            </div>

            {/* Roommate List */}
            <div className="space-y-4">
              {filteredRoommates.map((roommate) => (
                <div
                  key={roommate.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {roommate.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{roommate.name}</h4>
                        {roommate.verified && (
                          <span className="text-green-600 text-sm" title="Verified">✓</span>
                        )}
                        <span className="text-sm text-gray-500">
                          {roommate.age}yo • {roommate.gender}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{roommate.occupation}</p>
                      <p className="text-sm text-gray-500 mb-3">{roommate.bio}</p>

                      {/* Lifestyle Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <LifestyleTag active={!roommate.lifestyle.smoking} label="Non-smoker" />
                        <LifestyleTag active={roommate.lifestyle.quiet} label="Quiet" />
                        <LifestyleTag active={roommate.lifestyle.social} label="Social" />
                        {roommate.lifestyle.pets && (
                          <LifestyleTag active={true} label="Has pets" />
                        )}
                      </div>

                      {/* Budget & Move-in */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">Budget:</span>{' '}
                          <span className="font-medium text-gray-900">
                            {formatCurrency(roommate.budget)}/mo
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Move-in: {roommate.moveInDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Send Message
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}

              {filteredRoommates.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No roommates match your criteria.</p>
                  <button
                    onClick={() => setFilters({ gender: 'any', maxAge: 40, minBudget: 0 })}
                    className="text-purple-600 font-medium mt-2 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            {/* Register CTA */}
            <div className="mt-6 p-4 bg-purple-50 rounded-xl text-center">
              <p className="text-sm text-gray-700 mb-3">
                Looking for a roommate too? Create your profile!
              </p>
              <Link
                href="/auth/register"
                className="inline-block px-6 py-2 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Create Roommate Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoommateFinderCard;
