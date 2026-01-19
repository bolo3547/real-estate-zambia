'use client';

/**
 * Mobile Money Payment Component
 * Support for MTN MoMo, Airtel Money, and Zamtel Kwacha
 */

import { useState } from 'react';

interface MobileMoneyPaymentProps {
  amount: number;
  currency?: string;
  propertyTitle: string;
  onPaymentComplete?: (transactionId: string) => void;
}

type PaymentProvider = 'mtn' | 'airtel' | 'zamtel';

const providers = {
  mtn: {
    name: 'MTN Mobile Money',
    color: '#FFCC00',
    textColor: '#000000',
    icon: '📱',
    shortCode: '*303#',
  },
  airtel: {
    name: 'Airtel Money',
    color: '#FF0000',
    textColor: '#FFFFFF',
    icon: '📲',
    shortCode: '*778#',
  },
  zamtel: {
    name: 'Zamtel Kwacha',
    color: '#00A651',
    textColor: '#FFFFFF',
    icon: '💳',
    shortCode: '*422#',
  },
};

export function MobileMoneyPayment({
  amount,
  currency = 'ZMW',
  propertyTitle,
  onPaymentComplete,
}: MobileMoneyPaymentProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'confirm' | 'success'>('select');
  const [error, setError] = useState('');

  const formatAmount = (amt: number) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 0,
    }).format(amt);
  };

  const validatePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    // Zambian phone numbers: 09x, 07x, 06x (10 digits)
    return /^0[679]\d{8}$/.test(cleaned);
  };

  const handleProviderSelect = (provider: PaymentProvider) => {
    setSelectedProvider(provider);
    setStep('details');
    setError('');
  };

  const handleSubmit = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Zambian phone number (e.g., 097XXXXXXX)');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production, this would integrate with actual mobile money APIs
    const transactionId = `TXN${Date.now()}`;
    
    setIsProcessing(false);
    setStep('success');
    
    if (onPaymentComplete) {
      onPaymentComplete(transactionId);
    }
  };

  const resetPayment = () => {
    setSelectedProvider(null);
    setPhoneNumber('');
    setStep('select');
    setError('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Pay with Mobile Money</h3>
        <p className="text-sm text-gray-500">Secure, instant payments</p>
      </div>

      <div className="p-6">
        {/* Step 1: Select Provider */}
        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">Select your mobile money provider:</p>
            <div className="grid grid-cols-1 gap-3">
              {(Object.entries(providers) as [PaymentProvider, typeof providers.mtn][]).map(
                ([key, provider]) => (
                  <button
                    key={key}
                    onClick={() => handleProviderSelect(key)}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-primary transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                      style={{ backgroundColor: provider.color }}
                    >
                      {provider.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{provider.name}</div>
                      <div className="text-sm text-gray-500">Dial {provider.shortCode}</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {step === 'details' && selectedProvider && (
          <div className="space-y-6">
            <button
              onClick={() => setStep('select')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change provider
            </button>

            <div
              className="p-4 rounded-xl flex items-center gap-4"
              style={{ backgroundColor: `${providers[selectedProvider].color}20` }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: providers[selectedProvider].color }}
              >
                {providers[selectedProvider].icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {providers[selectedProvider].name}
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatAmount(amount)}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="097XXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Enter your phone number</li>
                    <li>You'll receive a prompt on your phone</li>
                    <li>Enter your PIN to confirm</li>
                    <li>Payment confirmed instantly</li>
                  </ol>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isProcessing || !phoneNumber}
              className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay ${formatAmount(amount)}`
              )}
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">
              Your payment of {formatAmount(amount)} has been received.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500">Transaction Reference</p>
              <p className="font-mono font-medium text-gray-900">TXN{Date.now()}</p>
            </div>
            <button
              onClick={resetPayment}
              className="text-primary font-medium hover:underline"
            >
              Make another payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileMoneyPayment;
