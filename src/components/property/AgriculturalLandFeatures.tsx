'use client';

/**
 * Agricultural Land Features Component
 * Display farming-specific information for land and farm properties
 * Important for Mumbwa District - known for farming
 */

import { useState } from 'react';

interface AgriculturalLandFeaturesProps {
  landSize: number; // hectares
  soilType?: 'loam' | 'clay' | 'sandy' | 'red-soil' | 'black-cotton';
  waterSource?: ('borehole' | 'river' | 'dam' | 'well' | 'municipal')[];
  irrigation?: boolean;
  fenced?: boolean;
  roadAccess?: 'tarred' | 'gravel' | 'dirt' | 'seasonal';
  electricity?: boolean;
  titleDeed?: boolean;
  suitableCrops?: string[];
  distanceFromTown?: number; // km
  existingStructures?: string[];
}

const soilTypes = {
  'loam': {
    label: 'Loam Soil',
    description: 'Excellent for most crops',
    rating: 5,
    crops: ['Maize', 'Vegetables', 'Groundnuts', 'Cotton'],
  },
  'clay': {
    label: 'Clay Soil',
    description: 'Good water retention',
    rating: 4,
    crops: ['Rice', 'Wheat', 'Vegetables'],
  },
  'sandy': {
    label: 'Sandy Soil',
    description: 'Good drainage, needs more water',
    rating: 3,
    crops: ['Groundnuts', 'Cassava', 'Sweet Potatoes'],
  },
  'red-soil': {
    label: 'Red Soil',
    description: 'Rich in iron, good for many crops',
    rating: 4,
    crops: ['Maize', 'Tobacco', 'Cotton'],
  },
  'black-cotton': {
    label: 'Black Cotton Soil',
    description: 'Very fertile, can be challenging',
    rating: 4,
    crops: ['Cotton', 'Sunflower', 'Sorghum'],
  },
};

const waterSources = {
  'borehole': { label: 'Borehole', icon: '🔵', reliability: 'High' },
  'river': { label: 'River Access', icon: '🏞️', reliability: 'Seasonal' },
  'dam': { label: 'Dam', icon: '💧', reliability: 'High' },
  'well': { label: 'Well', icon: '⭕', reliability: 'Medium' },
  'municipal': { label: 'Municipal Water', icon: '🚰', reliability: 'High' },
};

export function AgriculturalLandFeatures({
  landSize,
  soilType,
  waterSource = [],
  irrigation,
  fenced,
  roadAccess,
  electricity,
  titleDeed,
  suitableCrops = [],
  distanceFromTown,
  existingStructures = [],
}: AgriculturalLandFeaturesProps) {
  const [showDetails, setShowDetails] = useState(false);

  const soil = soilType ? soilTypes[soilType] : null;

  // Calculate farm value score
  const calculateFarmScore = () => {
    let score = 50;
    if (soilType && soilTypes[soilType].rating >= 4) score += 15;
    if (waterSource.length > 0) score += 10;
    if (waterSource.includes('borehole') || waterSource.includes('dam')) score += 5;
    if (irrigation) score += 10;
    if (fenced) score += 5;
    if (roadAccess === 'tarred' || roadAccess === 'gravel') score += 5;
    if (electricity) score += 5;
    if (titleDeed) score += 10;
    return Math.min(score, 100);
  };

  const farmScore = calculateFarmScore();

  const formatArea = (hectares: number) => {
    const acres = hectares * 2.471;
    return {
      hectares: hectares.toFixed(1),
      acres: acres.toFixed(1),
    };
  };

  const area = formatArea(landSize);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <span className="text-xl">🌾</span>
              Agricultural Land Features
            </h3>
            <p className="text-green-100 text-sm">Farming potential analysis</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{farmScore}</p>
            <p className="text-sm text-green-100">Farm Score</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Land Size */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-green-50 rounded-xl">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-700">{area.hectares}</p>
            <p className="text-sm text-green-600">hectares</p>
          </div>
          <div className="text-gray-300">|</div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-700">{area.acres}</p>
            <p className="text-sm text-green-600">acres</p>
          </div>
          {distanceFromTown && (
            <>
              <div className="text-gray-300">|</div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">{distanceFromTown}</p>
                <p className="text-sm text-green-600">km from town</p>
              </div>
            </>
          )}
        </div>

        {/* Soil Type */}
        {soil && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Soil Quality</h4>
            <div className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪴</span>
                  <div>
                    <p className="font-medium text-gray-900">{soil.label}</p>
                    <p className="text-sm text-gray-500">{soil.description}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= soil.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {soil.crops.map((crop) => (
                  <span
                    key={crop}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Water Sources */}
        {waterSource.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Water Sources</h4>
            <div className="grid grid-cols-2 gap-2">
              {waterSource.map((source) => (
                <div
                  key={source}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl"
                >
                  <span className="text-2xl">{waterSources[source].icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {waterSources[source].label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {waterSources[source].reliability} reliability
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-xl border ${fenced ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🚧</span>
              <span className="font-medium text-gray-900">Fenced</span>
            </div>
            <p className={`text-sm ${fenced ? 'text-green-600' : 'text-gray-400'}`}>
              {fenced ? 'Yes - Perimeter fenced' : 'No fencing'}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${irrigation ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💦</span>
              <span className="font-medium text-gray-900">Irrigation</span>
            </div>
            <p className={`text-sm ${irrigation ? 'text-green-600' : 'text-gray-400'}`}>
              {irrigation ? 'System installed' : 'Not available'}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${electricity ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">⚡</span>
              <span className="font-medium text-gray-900">Electricity</span>
            </div>
            <p className={`text-sm ${electricity ? 'text-green-600' : 'text-gray-400'}`}>
              {electricity ? 'ZESCO connected' : 'No connection'}
            </p>
          </div>

          <div className={`p-4 rounded-xl border ${titleDeed ? 'bg-green-50 border-green-200' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📜</span>
              <span className="font-medium text-gray-900">Title Deed</span>
            </div>
            <p className={`text-sm ${titleDeed ? 'text-green-600' : 'text-yellow-600'}`}>
              {titleDeed ? 'Available' : 'Traditional land'}
            </p>
          </div>
        </div>

        {/* Road Access */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Road Access</h4>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <span className="text-2xl">🛣️</span>
            <div>
              <p className="font-medium text-gray-900 capitalize">
                {roadAccess || 'Unknown'} Road
              </p>
              <p className="text-sm text-gray-500">
                {roadAccess === 'tarred' && 'Year-round access'}
                {roadAccess === 'gravel' && 'Good access, some dust'}
                {roadAccess === 'dirt' && 'May be difficult in rainy season'}
                {roadAccess === 'seasonal' && 'Limited access during rains'}
              </p>
            </div>
          </div>
        </div>

        {/* Existing Structures */}
        {existingStructures.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Structures</h4>
            <div className="flex flex-wrap gap-2">
              {existingStructures.map((structure) => (
                <span
                  key={structure}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {structure}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suitable Crops */}
        {suitableCrops.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recommended Crops</h4>
            <div className="flex flex-wrap gap-2">
              {suitableCrops.map((crop) => (
                <span
                  key={crop}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  🌱 {crop}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Farming Tips */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-gray-900"
        >
          <span className="font-medium">🌾 Mumbwa Farming Tips</span>
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
          <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>Rainy season:</strong> November to April - best for planting</li>
              <li>• <strong>Cotton zone:</strong> Mumbwa is in Zambia's prime cotton belt</li>
              <li>• <strong>Maize farming:</strong> Most common crop in the area</li>
              <li>• <strong>Groundnuts:</strong> Good cash crop for the region</li>
              <li>• <strong>Livestock:</strong> Cattle and goat farming also viable</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgriculturalLandFeatures;
