'use client';

/**
 * Solar Power & Load Shedding Info Component
 * Critical for Zambia due to ZESCO load shedding
 */

import { useState } from 'react';

interface SolarPowerInfoProps {
  hasSolarPanels: boolean;
  hasGenerator: boolean;
  hasInverter: boolean;
  solarCapacity?: number; // kW
  batteryBackup?: number; // hours
  loadSheddingSchedule?: string;
  area: string;
}

// Load shedding schedules by area (mock data - would come from ZESCO API)
const areaLoadShedding: Record<string, { hours: string; severity: 'low' | 'medium' | 'high' }> = {
  'Mumbwa Town': { hours: '4-8', severity: 'medium' },
  'Lusaka': { hours: '8-12', severity: 'high' },
  'Nangoma': { hours: '4-6', severity: 'medium' },
  'Kaindu': { hours: '6-10', severity: 'medium' },
  default: { hours: '4-8', severity: 'medium' },
};

export function SolarPowerInfo({
  hasSolarPanels,
  hasGenerator,
  hasInverter,
  solarCapacity,
  batteryBackup,
  loadSheddingSchedule,
  area,
}: SolarPowerInfoProps) {
  const [showDetails, setShowDetails] = useState(false);

  const loadShedding = areaLoadShedding[area] || areaLoadShedding.default;
  const hasPowerBackup = hasSolarPanels || hasGenerator || hasInverter;

  const severityColors = {
    low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    high: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  };

  const colors = severityColors[loadShedding.severity];

  // Calculate power score (0-100)
  const calculatePowerScore = () => {
    let score = 50; // Base score
    if (hasSolarPanels) score += 25;
    if (hasGenerator) score += 15;
    if (hasInverter) score += 10;
    if (batteryBackup && batteryBackup >= 8) score += 10;
    if (solarCapacity && solarCapacity >= 5) score += 10;
    return Math.min(score, 100);
  };

  const powerScore = calculatePowerScore();

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 70) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 50) return { label: 'Average', color: 'text-yellow-600' };
    return { label: 'Limited', color: 'text-red-600' };
  };

  const scoreInfo = getScoreLabel(powerScore);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h3 className={`font-semibold ${colors.text}`}>Power Situation</h3>
              <p className="text-sm opacity-80">{area}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${scoreInfo.color}`}>{powerScore}/100</p>
            <p className="text-sm text-gray-600">Power Score</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Load Shedding Alert */}
        <div className={`${colors.bg} border ${colors.border} rounded-xl p-4 mb-6`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔌</span>
            <div>
              <p className={`font-medium ${colors.text}`}>Load Shedding in {area}</p>
              <p className="text-sm mt-1">
                Expected power cuts: <strong>{loadSheddingSchedule || `${loadShedding.hours} hours/day`}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Schedule varies. Check ZESCO updates for current times.
              </p>
            </div>
          </div>
        </div>

        {/* Power Backup Features */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-gray-900">Property Power Features</h4>
          
          {/* Solar Panels */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${hasSolarPanels ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasSolarPanels ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
              <span className="text-2xl">☀️</span>
            </div>
            <div className="flex-1">
              <p className={`font-medium ${hasSolarPanels ? 'text-gray-900' : 'text-gray-500'}`}>
                Solar Panels
              </p>
              {hasSolarPanels && solarCapacity ? (
                <p className="text-sm text-green-600">{solarCapacity}kW system installed</p>
              ) : (
                <p className="text-sm text-gray-400">Not available</p>
              )}
            </div>
            {hasSolarPanels ? (
              <span className="text-green-500 text-xl">✓</span>
            ) : (
              <span className="text-gray-300 text-xl">✗</span>
            )}
          </div>

          {/* Generator */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${hasGenerator ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasGenerator ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
              <span className="text-2xl">🔋</span>
            </div>
            <div className="flex-1">
              <p className={`font-medium ${hasGenerator ? 'text-gray-900' : 'text-gray-500'}`}>
                Backup Generator
              </p>
              <p className="text-sm text-gray-400">
                {hasGenerator ? 'Available for extended outages' : 'Not available'}
              </p>
            </div>
            {hasGenerator ? (
              <span className="text-green-500 text-xl">✓</span>
            ) : (
              <span className="text-gray-300 text-xl">✗</span>
            )}
          </div>

          {/* Inverter/Battery */}
          <div className={`flex items-center gap-4 p-4 rounded-xl border ${hasInverter ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasInverter ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
              <span className="text-2xl">🔌</span>
            </div>
            <div className="flex-1">
              <p className={`font-medium ${hasInverter ? 'text-gray-900' : 'text-gray-500'}`}>
                Inverter & Battery
              </p>
              {hasInverter && batteryBackup ? (
                <p className="text-sm text-green-600">{batteryBackup}+ hours backup</p>
              ) : (
                <p className="text-sm text-gray-400">Not available</p>
              )}
            </div>
            {hasInverter ? (
              <span className="text-green-500 text-xl">✓</span>
            ) : (
              <span className="text-gray-300 text-xl">✗</span>
            )}
          </div>
        </div>

        {/* Power Tips */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-gray-900"
        >
          <span className="font-medium">💡 Power-Saving Tips</span>
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
          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• <strong>Prepaid meters:</strong> Buy ZESCO units during off-peak for savings</li>
              <li>• <strong>LED bulbs:</strong> Use 80% less electricity than traditional bulbs</li>
              <li>• <strong>Smart strips:</strong> Prevent phantom power drain</li>
              <li>• <strong>Solar water heater:</strong> Reduce geyser costs significantly</li>
              <li>• <strong>ZESCO app:</strong> Check load shedding schedule daily</li>
            </ul>
          </div>
        )}

        {/* No Backup Warning */}
        {!hasPowerBackup && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium text-orange-800">No Power Backup</p>
                <p className="text-sm text-orange-700">
                  This property doesn't have solar, generator, or inverter backup. 
                  Consider the impact of {loadShedding.hours} hours daily load shedding on your needs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SolarPowerInfo;
