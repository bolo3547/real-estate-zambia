/**
 * Zambia Property - Cancellation Options Page
 */

import Link from 'next/link';
import { Navigation } from '@/components/navigation/Navigation';
import { Footer } from '@/components/navigation/Footer';

const cancellationPolicies = [
  {
    title: 'Flexible',
    color: 'green',
    description: 'Full refund if cancelled within 48 hours of booking confirmation.',
    details: [
      'Cancel within 48 hours for full refund',
      'After 48 hours, 50% refund if more than 7 days before move-in',
      'No refund if less than 7 days before move-in',
    ],
  },
  {
    title: 'Moderate',
    color: 'yellow',
    description: 'Full refund if cancelled within 24 hours and more than 14 days before move-in.',
    details: [
      'Cancel within 24 hours for full refund (if 14+ days out)',
      '50% refund if cancelled 7-14 days before move-in',
      'No refund if less than 7 days before move-in',
    ],
  },
  {
    title: 'Strict',
    color: 'red',
    description: '50% refund if cancelled at least 7 days before move-in.',
    details: [
      '50% refund if cancelled 7+ days before move-in',
      'No refund if cancelled less than 7 days before move-in',
      'Service fees are non-refundable',
    ],
  },
];

const faqItems = [
  {
    question: 'How do I cancel my rental agreement?',
    answer: 'You can cancel your rental agreement by going to your Dashboard > My Bookings > Select the booking > Click "Cancel Booking". Make sure to review the cancellation policy before proceeding.',
  },
  {
    question: 'When will I receive my refund?',
    answer: 'Refunds are typically processed within 5-7 business days. The amount refunded depends on the cancellation policy of the property and when you cancel.',
  },
  {
    question: 'Can I modify my booking instead of cancelling?',
    answer: 'Yes, in many cases you can modify your booking dates or terms. Contact the landlord through our messaging system to discuss changes.',
  },
  {
    question: 'What if the landlord cancels?',
    answer: 'If a landlord cancels, you will receive a full refund of any payments made. We may also help you find a similar property if available.',
  },
  {
    question: 'Are service fees refundable?',
    answer: 'Service fees may be partially or fully refundable depending on the circumstances and timing of the cancellation. Check the specific policy for your booking.',
  },
];

export default function CancellationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cancellation Options
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Understand our cancellation policies and your options when plans change.
            </p>
          </div>
        </section>

        {/* Cancellation Policies */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Cancellation Policies
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Each property has its own cancellation policy set by the landlord. Here are the standard policy types:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cancellationPolicies.map((policy) => (
                <div
                  key={policy.title}
                  className={`bg-white border-2 rounded-2xl p-6 ${
                    policy.color === 'green'
                      ? 'border-green-200'
                      : policy.color === 'yellow'
                      ? 'border-yellow-200'
                      : 'border-red-200'
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${
                      policy.color === 'green'
                        ? 'bg-green-100 text-green-700'
                        : policy.color === 'yellow'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {policy.title}
                  </div>
                  <p className="text-gray-700 mb-4">{policy.description}</p>
                  <ul className="space-y-2">
                    {policy.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Cancel */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How to Cancel a Booking
            </h2>
            <div className="space-y-6">
              {[
                { step: 1, title: 'Go to Your Dashboard', description: 'Log in to your account and navigate to your Dashboard.' },
                { step: 2, title: 'Find Your Booking', description: 'Click on "My Bookings" and select the booking you want to cancel.' },
                { step: 3, title: 'Review the Policy', description: 'Check the cancellation policy to understand any fees or refund amounts.' },
                { step: 4, title: 'Confirm Cancellation', description: 'Click "Cancel Booking" and confirm your decision.' },
                { step: 5, title: 'Receive Confirmation', description: 'You\'ll receive an email confirming your cancellation and any refund details.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden group"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    {item.question}
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Need Help */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with a Cancellation?</h2>
            <p className="text-white/80 mb-8">
              Our support team is available to help you with any cancellation questions.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
