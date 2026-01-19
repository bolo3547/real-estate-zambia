'use client';

/**
 * Zambia Property - Report a Listing Page
 */

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const reportReasons = [
  { id: 'scam', label: 'Scam or fraud', description: 'The listing appears to be fraudulent or deceptive' },
  { id: 'misleading', label: 'Misleading information', description: 'Photos or description don\'t match the actual property' },
  { id: 'unavailable', label: 'Property unavailable', description: 'The property has already been rented or sold' },
  { id: 'duplicate', label: 'Duplicate listing', description: 'This property is listed multiple times' },
  { id: 'inappropriate', label: 'Inappropriate content', description: 'Contains offensive or inappropriate material' },
  { id: 'wrong-location', label: 'Wrong location', description: 'The property location is incorrect' },
  { id: 'illegal', label: 'Illegal activity', description: 'The listing promotes illegal activities' },
  { id: 'other', label: 'Other', description: 'Another issue not listed above' },
];

export default function ReportPage() {
  const [formData, setFormData] = useState({
    listingUrl: '',
    reason: '',
    details: '',
    email: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Report Submitted</h1>
            <p className="text-gray-600 mb-8">
              Thank you for helping keep Zambia Property safe. We'll review your report and take appropriate action within 24-48 hours.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-red-600 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Report a Listing</h1>
            <p className="text-white/90">Help us keep the platform safe and trustworthy</p>
          </div>
        </section>

        {/* Report Form */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Listing URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listing URL or Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.listingUrl}
                  onChange={(e) => setFormData({ ...formData, listingUrl: e.target.value })}
                  placeholder="Paste the listing URL or enter the property name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Why are you reporting this listing? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {reportReasons.map((reason) => (
                    <label
                      key={reason.id}
                      className={`relative flex cursor-pointer rounded-xl border p-4 hover:bg-gray-50 ${
                        formData.reason === reason.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={formData.reason === reason.id}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="sr-only"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{reason.label}</span>
                        <span className="text-sm text-gray-500">{reason.description}</span>
                      </div>
                      {formData.reason === reason.id && (
                        <svg className="absolute top-4 right-4 w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional details *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Please provide as much detail as possible about the issue..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email (optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Provide your email if you'd like updates on your report.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.listingUrl || !formData.reason || !formData.details}
                  className="w-full px-8 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  By submitting this report, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
