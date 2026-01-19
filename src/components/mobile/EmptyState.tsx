'use client';

/**
 * EmptyState - Beautiful empty state illustrations
 * Premium design with call-to-action
 */

import Link from 'next/link';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: 'search' | 'saved' | 'properties' | 'agents' | 'error';
  onAction?: () => void;
}

const icons = {
  search: (
    <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  saved: (
    <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  properties: (
    <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  agents: (
    <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  error: (
    <svg className="w-20 h-20 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = 'properties',
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Decorative background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gold/10 rounded-full blur-2xl scale-150" />
        <div className="relative bg-cream rounded-full p-6">
          {icons[icon]}
        </div>
      </div>

      <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
      <p className="text-muted text-sm max-w-xs mb-6">{description}</p>

      {(actionLabel && actionHref) && (
        <Link
          href={actionHref}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold text-sm shadow-soft hover:bg-primary-light transition-colors"
        >
          {actionLabel}
        </Link>
      )}

      {(actionLabel && onAction) && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold text-sm shadow-soft hover:bg-primary-light transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}

// Pre-configured empty states
export function NoPropertiesFound() {
  return (
    <EmptyState
      icon="properties"
      title="No Properties Found"
      description="We couldn't find any properties matching your criteria. Try adjusting your filters."
      actionLabel="Clear Filters"
      actionHref="/properties"
    />
  );
}

export function NoSavedProperties() {
  return (
    <EmptyState
      icon="saved"
      title="No Saved Properties"
      description="Start exploring and save properties you love to see them here."
      actionLabel="Explore Properties"
      actionHref="/properties"
    />
  );
}

export function SearchEmpty() {
  return (
    <EmptyState
      icon="search"
      title="No Results"
      description="We couldn't find anything matching your search. Try different keywords."
    />
  );
}

export function NoAgentsFound() {
  return (
    <EmptyState
      icon="agents"
      title="No Agents Found"
      description="We couldn't find any agents in this area. Try expanding your search."
      actionLabel="View All Agents"
      actionHref="/agents"
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="error"
      title="Something Went Wrong"
      description="We encountered an error loading this content. Please try again."
      actionLabel="Try Again"
      onAction={onRetry}
    />
  );
}
