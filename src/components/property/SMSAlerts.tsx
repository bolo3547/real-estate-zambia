'use client';

/**
 * SMS Alert Registration
 * For users without smartphones or reliable internet
 * Get new listing alerts via SMS
 */

import { useState } from 'react';

interface SMSAlertsProps {
  onSubscribe?: (phoneNumber: string, preferences: AlertPreferences) => void;
}

interface AlertPreferences {
  propertyType: string[];
  priceMin: number;
  priceMax: number;
  areas: string[];
  bedrooms: number;
}

const propertyTypes = [
  { id: 'house', label: 'Houses', icon: '🏠' },
  { id: 'apartment', label: 'Apartments', icon: '🏢' },
  { id: 'room', label: 'Single Rooms', icon: '🚪' },
  { id: 'lodge', label: 'Lodges', icon: '🏨' },
  { id: 'land', label: 'Land/Plots', icon: '🌍' },
  { id: 'farm', label: 'Farms', icon: '🌾' },
];

const areas = [
  'Mumbwa Town',
  'Nangoma',
  'Kaindu',
  'Landless Corner',
  'Myooye',
  'Chibombo',
  'Lusaka',
];

export function SMSAlerts({ onSubscribe }: SMSAlertsProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'form' | 'preferences' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [preferences, setPreferences] = useState<AlertPreferences>({
    propertyType: ['house'],
    priceMin: 0,
    priceMax: 10000,
    areas: ['Mumbwa Town'],
    bedrooms: 2,
  });

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^0[679]\d{8}$/.test(cleaned);
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  };

  const handlePhoneSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Zambian phone number (e.g., 097 123 4567)');
      return;
    }
    setError('');
    setStep('preferences');
  };

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSubscribe) {
      onSubscribe(phoneNumber, preferences);
    }
    
    setIsSubmitting(false);
    setStep('success');
  };

  const togglePropertyType = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter(t => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const toggleArea = (area: string) => {
    setPreferences(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">📲</span>
          SMS Property Alerts
        </h3>
        <p className="text-blue-100 text-sm">
          Get new listings via SMS - no internet needed!
        </p>
      </div>

      <div className="p-6">
        {/* Step 1: Phone Number */}
        {step === 'form' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Never Miss a New Listing
              </h4>
              <p className="text-sm text-gray-600">
                Receive SMS alerts when new properties matching your criteria are listed.
                Works on any phone - even without internet!
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                placeholder="097 123 4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-wider"
                maxLength={12}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <p className="mt-2 text-xs text-gray-500">
                Works with MTN, Airtel, and Zamtel numbers
              </p>
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={!phoneNumber}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-900 mb-3">Why SMS Alerts?</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>No smartphone or internet required</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Be first to know about new listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Free service - no charges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unsubscribe anytime by replying STOP</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 'preferences' && (
          <div className="space-y-6">
            <button
              onClick={() => setStep('form')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                What type of properties are you looking for?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => togglePropertyType(type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm ${
                      preferences.propertyType.includes(type.id)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Which areas?
              </p>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`px-4 py-2 rounded-full text-sm border ${
                      preferences.areas.includes(area)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Price range (ZMW/month)
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={preferences.priceMin}
                  onChange={(e) => setPreferences({ ...preferences, priceMin: Number(e.target.value) })}
                  placeholder="Min"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="number"
                  value={preferences.priceMax}
                  onChange={(e) => setPreferences({ ...preferences, priceMax: Number(e.target.value) })}
                  placeholder="Max"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Minimum bedrooms
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPreferences({ ...preferences, bedrooms: num })}
                    className={`w-12 h-12 rounded-xl border font-medium ${
                      preferences.bedrooms === num
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isSubmitting || preferences.propertyType.length === 0 || preferences.areas.length === 0}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to SMS Alerts'}
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">You're Subscribed!</h4>
            <p className="text-gray-600 mb-6">
              We'll send SMS alerts to <strong>{phoneNumber}</strong> when new properties
              match your criteria.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Your preferences:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>📍 Areas: {preferences.areas.join(', ')}</li>
                <li>🏠 Types: {preferences.propertyType.join(', ')}</li>
                <li>💰 Budget: K{preferences.priceMin.toLocaleString()} - K{preferences.priceMax.toLocaleString()}</li>
                <li>🛏️ Bedrooms: {preferences.bedrooms}+</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500">
              Reply STOP to any SMS to unsubscribe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SMSAlerts;
