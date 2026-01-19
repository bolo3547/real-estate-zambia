'use client';

/**
 * Property Verification Badge
 * Shows verification status of property - crucial for trust in Zambian market
 */

import { useState } from 'react';

interface PropertyVerificationBadgeProps {
  verificationStatus: 'verified' | 'pending' | 'unverified';
  verificationDate?: string;
  verifiedBy?: string;
  verificationType?: ('documents' | 'physical' | 'owner' | 'photos')[];
}

const verificationTypes = {
  documents: {
    label: 'Documents Verified',
    description: 'Title deed and ownership documents verified',
    icon: '📄',
  },
  physical: {
    label: 'Physical Inspection',
    description: 'Property visited and inspected by our team',
    icon: '🏠',
  },
  owner: {
    label: 'Owner Verified',
    description: 'Landlord identity confirmed via NRC',
    icon: '👤',
  },
  photos: {
    label: 'Photos Verified',
    description: 'Photos match the actual property',
    icon: '📷',
  },
};

export function PropertyVerificationBadge({
  verificationStatus,
  verificationDate,
  verifiedBy,
  verificationType = [],
}: PropertyVerificationBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = {
    verified: {
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '✓',
      label: 'Verified Property',
      description: 'This property has been verified by Zambia Property',
    },
    pending: {
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      icon: '⏳',
      label: 'Verification Pending',
      description: 'Verification in progress',
    },
    unverified: {
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-200',
      icon: '○',
      label: 'Not Yet Verified',
      description: 'This property has not been verified',
    },
  };

  const config = statusConfig[verificationStatus];

  return (
    <div className="relative">
      {/* Badge Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`inline-flex items-center gap-2 px-4 py-2 ${config.bgColor} ${config.textColor} rounded-full text-sm font-medium border ${config.borderColor} hover:shadow-md transition-shadow`}
      >
        <span className="text-lg">{config.icon}</span>
        <span>{config.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Details Dropdown */}
      {showDetails && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className={`${config.bgColor} px-4 py-3`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <p className={`font-semibold ${config.textColor}`}>{config.label}</p>
                  <p className="text-sm opacity-80">{config.description}</p>
                </div>
              </div>
            </div>

            {/* Verification Details */}
            <div className="p-4">
              {verificationStatus === 'verified' && (
                <>
                  {verificationDate && (
                    <p className="text-sm text-gray-600 mb-3">
                      Verified on {verificationDate}
                      {verifiedBy && ` by ${verifiedBy}`}
                    </p>
                  )}

                  <div className="space-y-3">
                    {verificationType.map((type) => (
                      <div key={type} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span>{verificationTypes[type].icon}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {verificationTypes[type].label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {verificationTypes[type].description}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {verificationStatus === 'pending' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Our team is currently verifying this property. This usually takes 2-3 business days.
                  </p>
                </div>
              )}

              {verificationStatus === 'unverified' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    This property has not been verified. Exercise caution and verify details independently before making any payments.
                  </p>
                  <p className="text-xs text-gray-500">
                    💡 Tip: Look for verified properties for added peace of mind
                  </p>
                </div>
              )}

              {/* Trust Tips */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Trust & Safety Tips
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Always view the property in person</li>
                  <li>• Verify ownership documents</li>
                  <li>• Never pay before signing an agreement</li>
                  <li>• Report suspicious listings</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyVerificationBadge;
