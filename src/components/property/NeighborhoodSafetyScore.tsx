'use client';

/**
 * Neighborhood Safety Score
 * Display area safety information and local amenities
 * Build trust with transparent safety data
 */

import { useState } from 'react';

interface NeighborhoodSafetyScoreProps {
  area: string;
  city: string;
}

interface AreaData {
  safetyScore: number;
  crimeLevel: 'low' | 'medium' | 'high';
  lighting: 'good' | 'moderate' | 'poor';
  policeStation: { distance: number; name: string };
  hospital: { distance: number; name: string };
  school: { distance: number; name: string };
  market: { distance: number; name: string };
  transport: string;
  community: string;
}

// Mock area safety data for Mumbwa District areas
const areaData: Record<string, AreaData> = {
  'Mumbwa Town': {
    safetyScore: 78,
    crimeLevel: 'low',
    lighting: 'good',
    policeStation: { distance: 1.2, name: 'Mumbwa Central Police' },
    hospital: { distance: 0.8, name: 'Mumbwa District Hospital' },
    school: { distance: 0.5, name: 'Mumbwa Secondary School' },
    market: { distance: 0.3, name: 'Mumbwa Main Market' },
    transport: 'Good - Regular buses to Lusaka',
    community: 'Active neighborhood watch program',
  },
  'Mumbwa Boma': {
    safetyScore: 80,
    crimeLevel: 'low',
    lighting: 'good',
    policeStation: { distance: 0.5, name: 'Mumbwa Central Police' },
    hospital: { distance: 0.3, name: 'Mumbwa District Hospital' },
    school: { distance: 0.8, name: 'Mumbwa Basic School' },
    market: { distance: 0.2, name: 'Boma Market' },
    transport: 'Excellent - Main transport hub',
    community: 'Government administrative area',
  },
  'Nangoma': {
    safetyScore: 72,
    crimeLevel: 'low',
    lighting: 'moderate',
    policeStation: { distance: 5, name: 'Nangoma Police Post' },
    hospital: { distance: 3, name: 'Nangoma Health Centre' },
    school: { distance: 1, name: 'Nangoma Basic School' },
    market: { distance: 0.5, name: 'Nangoma Trading Area' },
    transport: 'Moderate - Buses during daytime',
    community: 'Close-knit farming community',
  },
  'Kaindu': {
    safetyScore: 70,
    crimeLevel: 'low',
    lighting: 'moderate',
    policeStation: { distance: 8, name: 'Kaindu Police Post' },
    hospital: { distance: 6, name: 'Kaindu Rural Health Centre' },
    school: { distance: 2, name: 'Kaindu Primary School' },
    market: { distance: 1, name: 'Kaindu Market' },
    transport: 'Limited - Occasional transport',
    community: 'Traditional chiefdom area',
  },
  'Landless Corner': {
    safetyScore: 68,
    crimeLevel: 'medium',
    lighting: 'moderate',
    policeStation: { distance: 3, name: 'Mumbwa Central Police' },
    hospital: { distance: 4, name: 'Mumbwa District Hospital' },
    school: { distance: 1.5, name: 'Landless Basic School' },
    market: { distance: 0.5, name: 'Landless Trading Area' },
    transport: 'Good - On main road',
    community: 'Growing settlement area',
  },
  'Shakumbila': {
    safetyScore: 71,
    crimeLevel: 'low',
    lighting: 'moderate',
    policeStation: { distance: 12, name: 'Shakumbila Police Post' },
    hospital: { distance: 10, name: 'Shakumbila Health Centre' },
    school: { distance: 2, name: 'Shakumbila Secondary School' },
    market: { distance: 1, name: 'Shakumbila Market' },
    transport: 'Limited - Main road access',
    community: 'Chief Shakumbila traditional area',
  },
  'Myooye': {
    safetyScore: 69,
    crimeLevel: 'low',
    lighting: 'poor',
    policeStation: { distance: 15, name: 'Mumbwa Central Police' },
    hospital: { distance: 12, name: 'Myooye Health Post' },
    school: { distance: 3, name: 'Myooye Basic School' },
    market: { distance: 2, name: 'Myooye Trading Post' },
    transport: 'Limited - Seasonal road',
    community: 'Agricultural farming community',
  },
  'Blue Lagoon': {
    safetyScore: 75,
    crimeLevel: 'low',
    lighting: 'poor',
    policeStation: { distance: 25, name: 'National Parks Rangers' },
    hospital: { distance: 30, name: 'Mumbwa District Hospital' },
    school: { distance: 20, name: 'Nearest basic school' },
    market: { distance: 25, name: 'Mumbwa Main Market' },
    transport: 'Limited - 4x4 recommended',
    community: 'Wildlife conservation area',
  },
  'Kasip': {
    safetyScore: 67,
    crimeLevel: 'low',
    lighting: 'poor',
    policeStation: { distance: 18, name: 'Mumbwa Central Police' },
    hospital: { distance: 15, name: 'Kasip Health Post' },
    school: { distance: 4, name: 'Kasip Basic School' },
    market: { distance: 3, name: 'Kasip Trading Area' },
    transport: 'Limited - Dry season only',
    community: 'Remote farming community',
  },
  'Chibombo': {
    safetyScore: 74,
    crimeLevel: 'low',
    lighting: 'moderate',
    policeStation: { distance: 2, name: 'Chibombo Police' },
    hospital: { distance: 3, name: 'Chibombo District Hospital' },
    school: { distance: 1, name: 'Chibombo Secondary' },
    market: { distance: 0.5, name: 'Chibombo Market' },
    transport: 'Good - On Great North Road',
    community: 'District headquarters',
  },
  default: {
    safetyScore: 65,
    crimeLevel: 'medium',
    lighting: 'moderate',
    policeStation: { distance: 10, name: 'Nearest Police Post' },
    hospital: { distance: 8, name: 'Nearest Health Centre' },
    school: { distance: 3, name: 'Nearest School' },
    market: { distance: 2, name: 'Nearest Market' },
    transport: 'Variable',
    community: 'Rural community',
  },
};

export function NeighborhoodSafetyScore({ area, city }: NeighborhoodSafetyScoreProps) {
  const [showDetails, setShowDetails] = useState(false);

  const data = areaData[area] || areaData.default;

  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Excellent' };
    if (score >= 70) return { bg: 'bg-blue-500', text: 'text-blue-600', label: 'Good' };
    if (score >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Fair' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'Needs Attention' };
  };

  const scoreInfo = getScoreColor(data.safetyScore);

  const crimeConfig = {
    low: { color: 'text-green-600', bg: 'bg-green-100', label: 'Low Crime Area' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Moderate Crime' },
    high: { color: 'text-red-600', bg: 'bg-red-100', label: 'High Crime Area' },
  };

  const lightingConfig = {
    good: { icon: '💡', label: 'Well Lit Streets' },
    moderate: { icon: '🌙', label: 'Some Street Lighting' },
    poor: { icon: '🌑', label: 'Limited Lighting' },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          Neighborhood Safety
        </h3>
        <p className="text-indigo-100 text-sm">{area}, {city}</p>
      </div>

      <div className="p-6">
        {/* Safety Score Circle */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(data.safetyScore / 100) * 251} 251`}
                className={scoreInfo.text}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{data.safetyScore}</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>
          <div>
            <p className={`text-xl font-bold ${scoreInfo.text}`}>{scoreInfo.label}</p>
            <p className="text-sm text-gray-600">Safety Score for {area}</p>
            <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 ${crimeConfig[data.crimeLevel].bg} ${crimeConfig[data.crimeLevel].color} rounded-full text-sm`}>
              {data.crimeLevel === 'low' && '✓'}
              {crimeConfig[data.crimeLevel].label}
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span>{lightingConfig[data.lighting].icon}</span>
              <span className="text-sm font-medium text-gray-900">Street Lighting</span>
            </div>
            <p className="text-sm text-gray-600">{lightingConfig[data.lighting].label}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span>👮</span>
              <span className="text-sm font-medium text-gray-900">Police Station</span>
            </div>
            <p className="text-sm text-gray-600">{data.policeStation.distance}km away</p>
          </div>
        </div>

        {/* Nearby Amenities */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-gray-900"
        >
          <span className="font-medium">📍 Nearby Amenities</span>
          <svg
            className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-3">
            {/* Hospital */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🏥</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{data.hospital.name}</p>
                  <p className="text-xs text-gray-500">Hospital/Clinic</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">{data.hospital.distance}km</span>
            </div>

            {/* School */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🏫</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{data.school.name}</p>
                  <p className="text-xs text-gray-500">School</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">{data.school.distance}km</span>
            </div>

            {/* Market */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🏪</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{data.market.name}</p>
                  <p className="text-xs text-gray-500">Shopping/Market</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">{data.market.distance}km</span>
            </div>

            {/* Police */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👮</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{data.policeStation.name}</p>
                  <p className="text-xs text-gray-500">Police Station</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">{data.policeStation.distance}km</span>
            </div>

            {/* Transport Info */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🚌</span>
                <span className="font-medium text-gray-900">Transport</span>
              </div>
              <p className="text-sm text-gray-600">{data.transport}</p>
            </div>

            {/* Community Info */}
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">👥</span>
                <span className="font-medium text-gray-900">Community</span>
              </div>
              <p className="text-sm text-gray-600">{data.community}</p>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm font-medium text-yellow-800 mb-2">💡 Safety Tips</p>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Always visit properties during daylight</li>
            <li>• Talk to neighbors about the area</li>
            <li>• Check road conditions during rainy season</li>
            <li>• Verify property ownership before paying</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NeighborhoodSafetyScore;
