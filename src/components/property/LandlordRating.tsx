'use client';

/**
 * Landlord Rating Component
 * Rate and review landlords - building trust in the Zambian rental market
 */

import { useState } from 'react';

interface LandlordRatingProps {
  landlordId: string;
  landlordName: string;
  ratings: {
    overall: number;
    communication: number;
    maintenance: number;
    fairness: number;
    totalReviews: number;
  };
  reviews?: Array<{
    id: string;
    tenantName: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
  }>;
  onSubmitReview?: (review: { rating: number; comment: string }) => void;
}

const ratingCategories = [
  { key: 'communication', label: 'Communication', icon: '💬' },
  { key: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { key: 'fairness', label: 'Fairness', icon: '⚖️' },
];

export function LandlordRating({
  landlordId,
  landlordName,
  ratings,
  reviews = [],
  onSubmitReview,
}: LandlordRatingProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-8 h-8',
    };

    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setNewRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <svg
              className={`${sizeClasses[size]} ${
                star <= (interactive ? hoverRating || newRating : rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const handleSubmitReview = async () => {
    if (newRating === 0 || !newComment.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onSubmitReview) {
      onSubmitReview({ rating: newRating, comment: newComment });
    }
    
    setIsSubmitting(false);
    setShowReviewForm(false);
    setNewRating(0);
    setNewComment('');
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3) return 'Average';
    if (rating >= 2) return 'Below Average';
    return 'Poor';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Landlord Ratings</h3>
          {ratings.overall >= 4.5 && (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              <span>⭐</span> Superhost
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{ratings.overall.toFixed(1)}</div>
            <div className="flex justify-center mt-1">
              {renderStars(ratings.overall)}
            </div>
            <p className="text-sm text-gray-500 mt-1">{ratings.totalReviews} reviews</p>
          </div>
          <div className="flex-1">
            <p className="text-lg font-medium text-gray-900">{getRatingLabel(ratings.overall)}</p>
            <p className="text-sm text-gray-600">
              {landlordName} has maintained a high rating from tenants
            </p>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {ratingCategories.map((category) => (
            <div key={category.key} className="text-center p-3 bg-gray-50 rounded-xl">
              <span className="text-2xl">{category.icon}</span>
              <p className="text-sm text-gray-500 mt-1">{category.label}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="font-semibold text-gray-900">
                  {ratings[category.key as keyof typeof ratings]}
                </span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reviews */}
        {reviews.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-4">Recent Reviews</h4>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {review.tenantName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {review.tenantName}
                          {review.verified && (
                            <span className="ml-1 text-green-600" title="Verified Tenant">✓</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    {renderStars(review.rating, 'sm')}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write Review Button/Form */}
        {!showReviewForm ? (
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary hover:text-primary transition-colors"
          >
            ✍️ Write a Review
          </button>
        ) : (
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-4">Write Your Review</h4>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Your Rating</p>
              {renderStars(0, 'lg', true)}
            </div>

            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this landlord..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="flex-1 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={newRating === 0 || !newComment.trim() || isSubmitting}
                className="flex-1 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandlordRating;
