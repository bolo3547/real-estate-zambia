'use client';

/**
 * Rent-to-Own Calculator
 * Help users understand rent-to-own options
 * Partnership concept with banks for property financing in Zambia
 */

import { useState, useEffect } from 'react';

interface RentToOwnCalculatorProps {
  propertyPrice: number;
  monthlyRent: number;
  propertyTitle: string;
}

interface CalculationResult {
  monthlyPayment: number;
  totalRentPortion: number;
  totalInterest: number;
  totalCost: number;
  equityBuiltPerMonth: number;
  timeToOwnership: number; // months
}

// Partner banks (mock data)
const partnerBanks = [
  { name: 'Zanaco', logo: '🏦', interestRate: 24, maxTerm: 240 },
  { name: 'Stanbic', logo: '🏛️', interestRate: 22, maxTerm: 300 },
  { name: 'FNB Zambia', logo: '💰', interestRate: 23, maxTerm: 240 },
  { name: 'Atlas Mara', logo: '🌍', interestRate: 25, maxTerm: 180 },
];

export function RentToOwnCalculator({ propertyPrice, monthlyRent, propertyTitle }: RentToOwnCalculatorProps) {
  const [downPayment, setDownPayment] = useState(20); // percentage
  const [loanTerm, setLoanTerm] = useState(120); // months (10 years)
  const [selectedBank, setSelectedBank] = useState(partnerBanks[0]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const formatCurrency = (amount: number) => {
    return `K${amount.toLocaleString('en-ZM', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const calculateMortgage = () => {
    const downPaymentAmount = (propertyPrice * downPayment) / 100;
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyInterestRate = selectedBank.interestRate / 100 / 12;
    
    // Monthly payment calculation (EMI formula)
    const monthlyPayment = 
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    
    const totalCost = monthlyPayment * loanTerm + downPaymentAmount;
    const totalInterest = totalCost - propertyPrice;
    const equityBuiltPerMonth = loanAmount / loanTerm;

    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalRentPortion: Math.round(monthlyRent * loanTerm),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      equityBuiltPerMonth: Math.round(equityBuiltPerMonth),
      timeToOwnership: loanTerm,
    };
  };

  useEffect(() => {
    setResult(calculateMortgage());
  }, [downPayment, loanTerm, selectedBank, propertyPrice]);

  const rentVsBuyDifference = result ? result.monthlyPayment - monthlyRent : 0;
  const yearsToOwn = loanTerm / 12;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">🏠</span>
          Rent-to-Own Calculator
        </h3>
        <p className="text-amber-100 text-sm">
          See how you could own this property
        </p>
      </div>

      <div className="p-6">
        {/* Property Summary */}
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl mb-6">
          <div>
            <p className="text-sm text-gray-600">Property Price</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(propertyPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Rent</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyRent)}/mo</p>
          </div>
        </div>

        {/* Bank Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Partner Bank
          </label>
          <div className="grid grid-cols-2 gap-2">
            {partnerBanks.map((bank) => (
              <button
                key={bank.name}
                onClick={() => setSelectedBank(bank)}
                className={`p-3 rounded-xl border text-left ${
                  selectedBank.name === bank.name
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{bank.logo}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{bank.name}</p>
                    <p className="text-xs text-gray-500">{bank.interestRate}% p.a.</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Down Payment Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Down Payment</label>
            <span className="text-sm font-bold text-amber-600">
              {downPayment}% ({formatCurrency((propertyPrice * downPayment) / 100)})
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Loan Term Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Loan Term</label>
            <span className="text-sm font-bold text-amber-600">
              {yearsToOwn} years ({loanTerm} months)
            </span>
          </div>
          <input
            type="range"
            min="60"
            max={selectedBank.maxTerm}
            step="12"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5 years</span>
            <span>{selectedBank.maxTerm / 12} years</span>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Monthly Payment Comparison */}
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
              <p className="text-amber-100 text-sm">Your Monthly Payment</p>
              <p className="text-4xl font-bold">{formatCurrency(result.monthlyPayment)}</p>
              <div className="flex items-center gap-2 mt-2">
                {rentVsBuyDifference > 0 ? (
                  <>
                    <span className="text-amber-200 text-sm">
                      {formatCurrency(rentVsBuyDifference)} more than current rent
                    </span>
                  </>
                ) : (
                  <span className="text-green-200 text-sm">
                    {formatCurrency(Math.abs(rentVsBuyDifference))} less than current rent! 🎉
                  </span>
                )}
              </div>
            </div>

            {/* Ownership Journey */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <p className="text-sm text-gray-600">You'll Own This In</p>
                <p className="text-3xl font-bold text-green-600">{yearsToOwn}</p>
                <p className="text-sm text-gray-600">years</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-sm text-gray-600">Monthly Equity Built</p>
                <p className="text-3xl font-bold text-blue-600">
                  {formatCurrency(result.equityBuiltPerMonth)}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>

            {/* Breakdown Toggle */}
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between py-3 text-gray-700 hover:text-gray-900"
            >
              <span className="font-medium">View Full Breakdown</span>
              <svg
                className={`w-5 h-5 transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showBreakdown && (
              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment</span>
                  <span className="font-medium">{formatCurrency((propertyPrice * downPayment) / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="font-medium">
                    {formatCurrency(propertyPrice - (propertyPrice * downPayment) / 100)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="font-medium">{selectedBank.interestRate}% per annum</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest Paid</span>
                  <span className="font-medium text-red-600">{formatCurrency(result.totalInterest)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg">
                  <span className="font-medium text-gray-900">Total Cost</span>
                  <span className="font-bold text-gray-900">{formatCurrency(result.totalCost)}</span>
                </div>

                {/* Rent Comparison */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">If you keep renting instead:</p>
                  <div className="flex justify-between text-sm">
                    <span>Total rent over {yearsToOwn} years</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(monthlyRent * loanTerm)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    * And you would own nothing at the end
                  </p>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-gray-700 mb-3">
                Interested in owning this property? Get pre-qualified!
              </p>
              <button className="w-full py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors">
                Apply for Pre-Qualification
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Free • No obligation • Takes 5 minutes
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RentToOwnCalculator;
