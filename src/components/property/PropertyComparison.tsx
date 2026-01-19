'use client';

/**
 * Property Comparison Tool
 * Compare multiple properties side by side
 * Help users make informed decisions
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  image: string;
  price: number;
  listingType: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  propertyType: string;
  features: string[];
  verified: boolean;
  landlordRating?: number;
  powerBackup?: boolean;
  waterSource?: string;
}

interface PropertyComparisonProps {
  properties: Property[];
  onRemove?: (propertyId: string) => void;
}

export function PropertyComparison({ properties, onRemove }: PropertyComparisonProps) {
  const formatCurrency = (amount: number) => `K${amount.toLocaleString()}`;

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚖️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Compare Properties</h3>
        <p className="text-gray-600 mb-4">
          Add properties to compare them side by side
        </p>
        <Link
          href="/properties"
          className="inline-block px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  const ComparisonRow = ({
    label,
    icon,
    values,
    highlight,
  }: {
    label: string;
    icon: string;
    values: (string | number | boolean | undefined)[];
    highlight?: 'lowest' | 'highest';
  }) => {
    const numericValues = values.map((v) => (typeof v === 'number' ? v : null));
    const minValue = Math.min(...numericValues.filter((v): v is number => v !== null));
    const maxValue = Math.max(...numericValues.filter((v): v is number => v !== null));

    return (
      <tr className="border-b border-gray-100">
        <td className="py-4 px-4 text-sm font-medium text-gray-700 bg-gray-50">
          <span className="mr-2">{icon}</span>
          {label}
        </td>
        {values.map((value, index) => {
          let isHighlighted = false;
          if (typeof value === 'number') {
            if (highlight === 'lowest' && value === minValue) isHighlighted = true;
            if (highlight === 'highest' && value === maxValue) isHighlighted = true;
          }

          return (
            <td
              key={index}
              className={`py-4 px-4 text-center ${
                isHighlighted ? 'bg-green-50 font-medium text-green-700' : ''
              }`}
            >
              {typeof value === 'boolean' ? (
                value ? (
                  <span className="text-green-500 text-xl">✓</span>
                ) : (
                  <span className="text-gray-300 text-xl">✗</span>
                )
              ) : (
                <span className={isHighlighted ? '' : 'text-gray-900'}>{value || '-'}</span>
              )}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          Property Comparison
        </h3>
        <p className="text-cyan-100 text-sm">
          Comparing {properties.length} properties
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Property Cards Header */}
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-40 py-4 px-4 text-left bg-gray-50"></th>
              {properties.map((property) => (
                <th key={property.id} className="py-4 px-4 min-w-[200px]">
                  <div className="relative">
                    {onRemove && (
                      <button
                        onClick={() => onRemove(property.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 z-10"
                      >
                        ×
                      </button>
                    )}
                    <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={property.image || '/placeholder-property.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      {property.verified && (
                        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {property.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{property.location}</p>
                    <Link
                      href={`/properties/${property.id}`}
                      className="mt-2 inline-block text-xs text-primary hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Price */}
            <ComparisonRow
              label="Price"
              icon="💰"
              values={properties.map((p) =>
                p.listingType === 'rent'
                  ? `${formatCurrency(p.price)}/mo`
                  : formatCurrency(p.price)
              )}
            />

            {/* Price per sqm (for sale) */}
            {properties.some((p) => p.listingType === 'sale') && (
              <ComparisonRow
                label="Price/sqm"
                icon="📐"
                values={properties.map((p) =>
                  p.listingType === 'sale' && p.area
                    ? formatCurrency(Math.round(p.price / p.area))
                    : '-'
                )}
                highlight="lowest"
              />
            )}

            {/* Bedrooms */}
            <ComparisonRow
              label="Bedrooms"
              icon="🛏️"
              values={properties.map((p) => p.bedrooms)}
              highlight="highest"
            />

            {/* Bathrooms */}
            <ComparisonRow
              label="Bathrooms"
              icon="🚿"
              values={properties.map((p) => p.bathrooms)}
              highlight="highest"
            />

            {/* Area */}
            <ComparisonRow
              label="Area (sqm)"
              icon="📏"
              values={properties.map((p) => p.area)}
              highlight="highest"
            />

            {/* Property Type */}
            <ComparisonRow
              label="Type"
              icon="🏠"
              values={properties.map((p) => p.propertyType)}
            />

            {/* Verified */}
            <ComparisonRow
              label="Verified"
              icon="✅"
              values={properties.map((p) => p.verified)}
            />

            {/* Power Backup */}
            <ComparisonRow
              label="Power Backup"
              icon="⚡"
              values={properties.map((p) => p.powerBackup)}
            />

            {/* Water Source */}
            <ComparisonRow
              label="Water"
              icon="💧"
              values={properties.map((p) => p.waterSource)}
            />

            {/* Landlord Rating */}
            <ComparisonRow
              label="Landlord Rating"
              icon="⭐"
              values={properties.map((p) =>
                p.landlordRating ? `${p.landlordRating}/5` : '-'
              )}
              highlight="highest"
            />
          </tbody>
        </table>
      </div>

      {/* Features Comparison */}
      <div className="p-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Features</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <tbody>
              {/* Get all unique features */}
              {Array.from(new Set(properties.flatMap((p) => p.features))).map(
                (feature) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="py-2 px-4 text-sm text-gray-700 bg-gray-50 w-40">
                      {feature}
                    </td>
                    {properties.map((property) => (
                      <td key={property.id} className="py-2 px-4 text-center">
                        {property.features.includes(feature) ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-gray-300">✗</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Winner Summary */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
        <h4 className="font-medium text-gray-900 mb-3">💡 Quick Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-gray-500">Best Value (Price/sqm)</p>
            <p className="font-medium text-gray-900">
              {properties.reduce((best, p) => {
                if (p.listingType !== 'sale' || !p.area) return best;
                const priceSqm = p.price / p.area;
                const bestPriceSqm = best.area ? best.price / best.area : Infinity;
                return priceSqm < bestPriceSqm ? p : best;
              }, properties[0])?.title || '-'}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-gray-500">Most Space</p>
            <p className="font-medium text-gray-900">
              {properties.reduce((max, p) => (p.area > max.area ? p : max), properties[0])?.title || '-'}
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-gray-500">Most Affordable</p>
            <p className="font-medium text-gray-900">
              {properties.reduce((min, p) => (p.price < min.price ? p : min), properties[0])?.title || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyComparison;
