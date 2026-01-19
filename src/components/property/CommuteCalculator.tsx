'use client';

/**
 * Commute Calculator
 * Calculate travel time and costs to work/school
 * Important for Zambian commuters using minibuses, personal vehicles
 */

import { useState } from 'react';

interface CommuteCalculatorProps {
  propertyAddress: string;
  propertyCity: string;
}

interface CommuteResult {
  distance: number;
  duration: {
    driving: number;
    minibus: number;
    walking: number;
  };
  cost: {
    fuel: number;
    minibus: number;
  };
}

// Major destinations in Mumbwa and nearby areas
const popularDestinations = [
  // Mumbwa District
  { name: 'Mumbwa Town Centre', type: 'town' },
  { name: 'Mumbwa Boma', type: 'government' },
  { name: 'Mumbwa District Hospital', type: 'hospital' },
  { name: 'Mumbwa Secondary School', type: 'school' },
  { name: 'Mumbwa Main Market', type: 'market' },
  { name: 'Landless Corner', type: 'area' },
  // Major Villages
  { name: 'Nangoma', type: 'village' },
  { name: 'Kaindu', type: 'village' },
  { name: 'Shakumbila', type: 'village' },
  { name: 'Myooye', type: 'village' },
  { name: 'Kasip', type: 'village' },
  // Nearby Towns
  { name: 'Lusaka CBD', type: 'city' },
  { name: 'Kafue Town', type: 'town' },
  { name: 'Itezhi-Tezhi', type: 'town' },
  { name: 'Chibombo', type: 'town' },
  // Landmarks
  { name: 'Blue Lagoon National Park', type: 'landmark' },
  { name: 'Kafue National Park Gate', type: 'landmark' },
];

// Fuel price per liter in Zambia (approximate)
const FUEL_PRICE_PER_LITER = 28; // ZMW
const AVERAGE_FUEL_CONSUMPTION = 10; // liters per 100km

export function CommuteCalculator({ propertyAddress, propertyCity }: CommuteCalculatorProps) {
  const [destination, setDestination] = useState('');
  const [customDestination, setCustomDestination] = useState('');
  const [result, setResult] = useState<CommuteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateCommute = async () => {
    setIsCalculating(true);
    
    // Simulate API call - in production, integrate with Google Maps API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock calculation based on destination
    const mockDistances: Record<string, number> = {
      // Mumbwa District
      'Mumbwa Town Centre': 5,
      'Mumbwa Boma': 3,
      'Mumbwa District Hospital': 3,
      'Mumbwa Secondary School': 4,
      'Mumbwa Main Market': 5,
      'Landless Corner': 8,
      // Villages
      'Nangoma': 25,
      'Kaindu': 45,
      'Shakumbila': 60,
      'Myooye': 35,
      'Kasip': 55,
      // Nearby Towns
      'Lusaka CBD': 150,
      'Kafue Town': 80,
      'Itezhi-Tezhi': 180,
      'Chibombo': 90,
      // Landmarks
      'Blue Lagoon National Park': 45,
      'Kafue National Park Gate': 120,
    };

    const distance = mockDistances[destination] || Math.random() * 50 + 5;
    
    const result: CommuteResult = {
      distance: Math.round(distance * 10) / 10,
      duration: {
        driving: Math.round(distance * 1.5), // minutes
        minibus: Math.round(distance * 2.5), // minutes (with stops)
        walking: Math.round(distance * 12), // minutes (5km/h)
      },
      cost: {
        fuel: Math.round((distance / 100) * AVERAGE_FUEL_CONSUMPTION * FUEL_PRICE_PER_LITER * 2), // round trip
        minibus: Math.round(distance < 10 ? 10 : distance < 50 ? 30 : distance < 100 ? 80 : 150) * 2, // round trip
      },
    };

    setResult(result);
    setIsCalculating(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const formatCurrency = (amount: number) => `K${amount.toLocaleString()}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">🚗</span>
          Commute Calculator
        </h3>
        <p className="text-green-100 text-sm">Estimate travel time & costs to your destination</p>
      </div>

      <div className="p-6">
        {/* From Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-green-500">📍</span>
            <span className="text-gray-900">{propertyAddress}, {propertyCity}</span>
          </div>
        </div>

        {/* To Destination */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="space-y-2">
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setResult(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select a destination</option>
              <optgroup label="Popular Destinations">
                {popularDestinations.map((dest) => (
                  <option key={dest.name} value={dest.name}>
                    {dest.name}
                  </option>
                ))}
              </optgroup>
              <option value="custom">Enter custom address...</option>
            </select>

            {destination === 'custom' && (
              <input
                type="text"
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="Enter destination address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            )}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateCommute}
          disabled={!destination || isCalculating}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCalculating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Calculating...
            </span>
          ) : (
            'Calculate Commute'
          )}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="text-center py-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-3xl font-bold text-gray-900">{result.distance} km</p>
            </div>

            {/* Transport Options */}
            <div className="grid grid-cols-1 gap-3">
              {/* Driving */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">By Car</p>
                    <p className="text-sm text-gray-500">{formatDuration(result.duration.driving)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(result.cost.fuel)}</p>
                  <p className="text-xs text-gray-500">fuel/day</p>
                </div>
              </div>

              {/* Minibus */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚐</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">By Minibus</p>
                    <p className="text-sm text-gray-500">{formatDuration(result.duration.minibus)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(result.cost.minibus)}</p>
                  <p className="text-xs text-gray-500">fare/day</p>
                </div>
              </div>

              {/* Walking (if reasonable) */}
              {result.distance <= 5 && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🚶</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Walking</p>
                      <p className="text-sm text-gray-500">{formatDuration(result.duration.walking)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">Free!</p>
                    <p className="text-xs text-gray-500">healthy choice</p>
                  </div>
                </div>
              )}
            </div>

            {/* Monthly Cost Summary */}
            <div className="p-4 bg-primary/5 rounded-xl">
              <p className="text-sm font-medium text-gray-900 mb-2">Monthly Transport Cost (22 work days)</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">By Car:</span>
                <span className="font-medium">{formatCurrency(result.cost.fuel * 22)}/month</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600">By Minibus:</span>
                <span className="font-medium">{formatCurrency(result.cost.minibus * 22)}/month</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommuteCalculator;
