'use client';

/**
 * Premium Mobile Agent Card Component
 * Compact agent preview card
 */

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MobileAgentCardProps {
  id: string;
  name: string;
  title: string;
  company?: string;
  image: string;
  rating: number;
  reviews: number;
  listings: number;
  sold?: number;
  verified?: boolean;
  superAgent?: boolean;
  areas?: string[];
  phone?: string;
  whatsapp?: string;
  compact?: boolean;
}

export default function MobileAgentCard({
  id,
  name,
  title,
  company,
  image,
  rating,
  reviews,
  listings,
  sold,
  verified = false,
  superAgent = false,
  areas = [],
  phone,
  whatsapp,
  compact = false,
}: MobileAgentCardProps) {
  if (compact) {
    return (
      <Link
        href={`/agents/${id}`}
        className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-soft"
      >
        <div className="relative">
          <Image
            src={image}
            alt={name}
            width={48}
            height={48}
            className="rounded-xl object-cover"
          />
          {verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-dark text-sm truncate">{name}</h4>
            {superAgent && (
              <span className="flex-shrink-0 text-gold text-xs">⭐</span>
            )}
          </div>
          <p className="text-xs text-muted truncate">{title}</p>
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium text-dark">{rating}</span>
            <span className="text-xs text-muted">({reviews})</span>
          </div>
        </div>
        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-3xl p-4 shadow-soft"
    >
      <Link href={`/agents/${id}`}>
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src={image}
              alt={name}
              width={72}
              height={72}
              className="rounded-2xl object-cover"
            />
            {verified && (
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
              <h3 className="font-bold text-dark truncate">{name}</h3>
              {superAgent && (
                <span className="flex-shrink-0 px-2 py-0.5 bg-gold/20 text-gold text-xs font-medium rounded-full">
                  ⭐ Super
                </span>
              )}
            </div>
            <p className="text-sm text-primary">{title}</p>
            {company && <p className="text-xs text-muted">{company}</p>}

            {/* Rating */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-dark text-sm">{rating}</span>
                <span className="text-xs text-muted">({reviews})</span>
              </div>
              {sold && (
                <>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs text-muted">{sold}+ sold</span>
                </>
              )}
            </div>

            {/* Areas */}
            {areas.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {areas.slice(0, 2).map((area) => (
                  <span key={area} className="px-2 py-0.5 bg-cream text-muted text-xs rounded-full">
                    📍 {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex-1 text-center">
            <p className="text-lg font-bold text-primary">{listings}</p>
            <p className="text-xs text-muted">Listings</p>
          </div>
          {sold && (
            <div className="flex-1 text-center border-l border-gray-100">
              <p className="text-lg font-bold text-primary">{sold}+</p>
              <p className="text-xs text-muted">Sold</p>
            </div>
          )}
          <div className="flex-1 text-center border-l border-gray-100">
            <p className="text-lg font-bold text-primary">{reviews}</p>
            <p className="text-xs text-muted">Reviews</p>
          </div>
        </div>
      </Link>

      {/* Contact Buttons */}
      {(phone || whatsapp) && (
        <div className="flex gap-2 mt-4">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
          )}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
