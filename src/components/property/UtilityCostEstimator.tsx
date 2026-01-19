'use client';

/**
 * Utility Cost Estimator
 * Estimate ZESCO electricity, water, and other utility costs by area
 * Important for Zambia due to load shedding and varying utility costs
 */

import { useState } from 'react';

interface UtilityCostEstimatorProps {
  area: string;
  propertyType: string;
  bedrooms: number;
}

interface UtilityEstimate {
  electricity: { min: number; max: number; loadShedding: string };
  water: { min: number; max: number };
  internet: { min: number; max: number };
  security: { min: number; max: number };
  waste: number;
}

// Utility costs vary by area in Zambia (Mumbwa District focus)
const areaUtilityData: Record<string, UtilityEstimate> = {
  // Mumbwa Town Areas
  'Mumbwa Town': {
    electricity: { min: 400, max: 800, loadShedding: '4-8 hours/day' },
    water: { min: 150, max: 300 },
    internet: { min: 300, max: 600 },
    security: { min: 200, max: 500 },
    waste: 50,
  },
  'Mumbwa Boma': {
    electricity: { min: 350, max: 750, loadShedding: '4-6 hours/day' },
    water: { min: 120, max: 280 },
    internet: { min: 300, max: 600 },
    security: { min: 150, max: 400 },
    waste: 50,
  },
  'Landless Corner': {
    electricity: { min: 380, max: 780, loadShedding: '6-10 hours/day' },
    water: { min: 100, max: 250 },
    internet: { min: 250, max: 500 },
    security: { min: 200, max: 450 },
    waste: 40,
  },
  // Villages - Lower costs, more load shedding
  'Nangoma': {
    electricity: { min: 250, max: 500, loadShedding: '8-12 hours/day' },
    water: { min: 50, max: 150 }, // borehole common
    internet: { min: 200, max: 400 },
    security: { min: 100, max: 250 },
    waste: 30,
  },
  'Kaindu': {
    electricity: { min: 200, max: 450, loadShedding: '10-14 hours/day' },
    water: { min: 30, max: 100 }, // well/borehole
    internet: { min: 200, max: 400 },
    security: { min: 80, max: 200 },
    waste: 20,
  },
  'Shakumbila': {
    electricity: { min: 220, max: 480, loadShedding: '10-14 hours/day' },
    water: { min: 40, max: 120 },
    internet: { min: 200, max: 400 },
    security: { min: 100, max: 250 },
    waste: 25,
  },
  'Myooye': {
    electricity: { min: 180, max: 400, loadShedding: '12-16 hours/day' },
    water: { min: 20, max: 80 }, // mostly borehole
    internet: { min: 200, max: 400 },
    security: { min: 50, max: 150 },
    waste: 20,
  },
  // Farming Areas - Solar often needed
  'Farming Block': {
    electricity: { min: 150, max: 350, loadShedding: 'Often unavailable - solar recommended' },
    water: { min: 0, max: 50 }, // borehole
    internet: { min: 200, max: 400 },
    security: { min: 100, max: 300 },
    waste: 0, // burn/compost
  },
  // City comparison
  'Lusaka': {
    electricity: { min: 500, max: 1200, loadShedding: '6-12 hours/day' },
    water: { min: 200, max: 500 },
    internet: { min: 400, max: 800 },
    security: { min: 300, max: 800 },
    waste: 80,
  },
  default: {
    electricity: { min: 300, max: 600, loadShedding: '8-12 hours/day' },
    water: { min: 80, max: 200 },
    internet: { min: 200, max: 400 },
    security: { min: 100, max: 300 },
    waste: 30,
  },
};

const bedroomMultiplier: Record<number, number> = {
  1: 0.7,
  2: 0.85,
  3: 1,
  4: 1.2,
  5: 1.4,
};

export function UtilityCostEstimator({ area, propertyType, bedrooms }: UtilityCostEstimatorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const utilities = areaUtilityData[area] || areaUtilityData.default;
  const multiplier = bedroomMultiplier[bedrooms] || 1;

  const calculateCost = (min: number, max: number) => ({
    min: Math.round(min * multiplier),
    max: Math.round(max * multiplier),
  });

  const electricity = calculateCost(utilities.electricity.min, utilities.electricity.max);
  const water = calculateCost(utilities.water.min, utilities.water.max);
  const internet = utilities.internet;
  const security = utilities.security;
  const waste = utilities.waste;

  const totalMin = electricity.min + water.min + internet.min + security.min + waste;
  const totalMax = electricity.max + water.max + internet.max + security.max + waste;

  const formatCurrency = (amount: number) => `K${amount.toLocaleString()}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Monthly Utility Estimate</h3>
            <p className="text-blue-100 text-sm">{area} • {bedrooms} bedroom</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {formatCurrency(totalMin)} - {formatCurrency(totalMax)}
            </p>
            <p className="text-blue-100 text-sm">per month</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Load Shedding Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-medium text-yellow-800">Load Shedding Alert</p>
              <p className="text-sm text-yellow-700">
                Expected power cuts: <strong>{utilities.electricity.loadShedding}</strong>
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Consider properties with solar backup or generators
              </p>
            </div>
          </div>
        </div>

        {/* Utility Breakdown */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-gray-900"
        >
          <span className="font-medium">View breakdown</span>
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
          <div className="mt-4 space-y-4">
            {/* ZESCO Electricity */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">ZESCO Electricity</p>
                  <p className="text-sm text-gray-500">Prepaid units</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(electricity.min)} - {formatCurrency(electricity.max)}
              </p>
            </div>

            {/* Water */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💧</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Water</p>
                  <p className="text-sm text-gray-500">Municipal/Borehole</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(water.min)} - {formatCurrency(water.max)}
              </p>
            </div>

            {/* Internet */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📶</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Internet</p>
                  <p className="text-sm text-gray-500">Fiber/4G LTE</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(internet.min)} - {formatCurrency(internet.max)}
              </p>
            </div>

            {/* Security */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔒</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Security</p>
                  <p className="text-sm text-gray-500">Guard/Alarm service</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">
                {formatCurrency(security.min)} - {formatCurrency(security.max)}
              </p>
            </div>

            {/* Waste Collection */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🗑️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Waste Collection</p>
                  <p className="text-sm text-gray-500">Municipal service</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">{formatCurrency(waste)}</p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm font-medium text-gray-900 mb-2">💡 Money-Saving Tips</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Buy ZESCO units in bulk during off-peak hours</li>
            <li>• Consider solar panels to reduce electricity costs</li>
            <li>• Use energy-efficient appliances</li>
            <li>• Check if property has a borehole (saves on water bills)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UtilityCostEstimator;
