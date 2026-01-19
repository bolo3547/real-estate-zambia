'use client';

/**
 * Zambia Property - Status Badge Component
 * 
 * Reusable status badges for users, properties, and approvals
 */

interface StatusBadgeProps {
  status: string;
  variant?: 'user' | 'property' | 'approval' | 'role';
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<string, Record<string, string>> = {
  user: {
    ACTIVE: 'bg-green-100 text-green-700 border-green-200',
    INACTIVE: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    SUSPENDED: 'bg-red-100 text-red-700 border-red-200',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  property: {
    DRAFT: 'bg-neutral-100 text-neutral-600 border-neutral-200',
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    SOLD: 'bg-blue-100 text-blue-700 border-blue-200',
    RENTED: 'bg-purple-100 text-purple-700 border-purple-200',
    UNAVAILABLE: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  },
  approval: {
    SUBMITTED: 'bg-blue-100 text-blue-700 border-blue-200',
    APPROVED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    REVISION_REQUESTED: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  role: {
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    AGENT: 'bg-blue-100 text-blue-700 border-blue-200',
    LANDLORD: 'bg-green-100 text-green-700 border-green-200',
    TENANT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    BUYER: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  },
};

const statusLabels: Record<string, Record<string, string>> = {
  user: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    SUSPENDED: 'Suspended',
    PENDING: 'Pending',
    PENDING_VERIFICATION: 'Pending Verification',
  },
  property: {
    DRAFT: 'Draft',
    PENDING: 'Pending Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    SOLD: 'Sold',
    RENTED: 'Rented',
    UNAVAILABLE: 'Unavailable',
  },
  approval: {
    SUBMITTED: 'Submitted',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    REVISION_REQUESTED: 'Revision Needed',
  },
  role: {
    ADMIN: 'Admin',
    AGENT: 'Agent',
    LANDLORD: 'Landlord',
    TENANT: 'Tenant',
    BUYER: 'Buyer',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function StatusBadge({ 
  status, 
  variant = 'user',
  size = 'md' 
}: StatusBadgeProps) {
  const colors = statusColors[variant]?.[status] || 'bg-neutral-100 text-neutral-600 border-neutral-200';
  const label = statusLabels[variant]?.[status] || status;
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colors} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}

/**
 * Verification Badge
 */
interface VerificationBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({ isVerified, size = 'md' }: VerificationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${
        isVerified
          ? 'bg-green-100 text-green-700 border-green-200'
          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
      } ${sizeClasses[size]}`}
    >
      {isVerified ? (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      {isVerified ? 'Verified' : 'Unverified'}
    </span>
  );
}

/**
 * Featured Badge
 */
interface FeaturedBadgeProps {
  tier?: 'BASIC' | 'PREMIUM' | 'SPOTLIGHT';
  size?: 'sm' | 'md' | 'lg';
}

export function FeaturedBadge({ tier = 'BASIC', size = 'md' }: FeaturedBadgeProps) {
  const tierStyles = {
    BASIC: 'bg-blue-100 text-blue-700 border-blue-200',
    PREMIUM: 'bg-gold/20 text-yellow-700 border-yellow-300',
    SPOTLIGHT: 'bg-purple-100 text-purple-700 border-purple-200',
  };
  
  const tierLabels = {
    BASIC: 'Featured',
    PREMIUM: 'Premium',
    SPOTLIGHT: 'Spotlight',
  };
  
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${tierStyles[tier]} ${sizeClasses[size]}`}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {tierLabels[tier]}
    </span>
  );
}
