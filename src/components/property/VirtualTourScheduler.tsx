'use client';

/**
 * Virtual Tour Scheduler
 * Schedule WhatsApp video calls for remote property viewing
 * Essential for diaspora Zambians and busy professionals
 */

import { useState } from 'react';

interface VirtualTourSchedulerProps {
  propertyId: string;
  propertyTitle: string;
  landlordName: string;
  landlordPhone: string;
}

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

// Generate available time slots for the next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });

    times.forEach((time, idx) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: `${dayName}, ${dayNum} ${month}`,
        time,
        available: Math.random() > 0.3, // 70% availability
      });
    });
  }
  return slots;
};

export function VirtualTourScheduler({
  propertyId,
  propertyTitle,
  landlordName,
  landlordPhone,
}: VirtualTourSchedulerProps) {
  const [step, setStep] = useState<'info' | 'schedule' | 'confirm' | 'success'>('info');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', notes: '' });
  const [tourType, setTourType] = useState<'whatsapp' | 'zoom' | 'physical'>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateTimeSlots();

  // Group slots by date
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4 text-white">
        <h3 className="font-semibold flex items-center gap-2">
          <span className="text-xl">📹</span>
          Virtual Property Tour
        </h3>
        <p className="text-pink-100 text-sm">
          Can't visit in person? Schedule a video tour!
        </p>
      </div>

      <div className="p-6">
        {/* Step 1: Tour Type Selection */}
        {step === 'info' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏠</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Schedule a Property Viewing
              </h4>
              <p className="text-sm text-gray-600">
                Choose how you'd like to view this property
              </p>
            </div>

            {/* Tour Type Options */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setTourType('whatsapp');
                  setStep('schedule');
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">WhatsApp Video Call</p>
                  <p className="text-sm text-gray-500">Free • Most popular option</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  setTourType('zoom');
                  setStep('schedule');
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📹</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Zoom/Google Meet</p>
                  <p className="text-sm text-gray-500">For longer detailed tours</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => {
                  setTourType('physical');
                  setStep('schedule');
                }}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🚶</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Physical Visit</p>
                  <p className="text-sm text-gray-500">Visit the property in person</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Benefits */}
            <div className="p-4 bg-pink-50 rounded-xl">
              <p className="text-sm font-medium text-pink-900 mb-2">
                ✨ Why schedule a virtual tour?
              </p>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>• Perfect for Zambians living abroad</li>
                <li>• Save time on multiple property visits</li>
                <li>• See the property from any angle</li>
                <li>• Ask questions in real-time</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Select Time */}
        {step === 'schedule' && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('info')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
              <span className="text-2xl">
                {tourType === 'whatsapp' && '📱'}
                {tourType === 'zoom' && '📹'}
                {tourType === 'physical' && '🚶'}
              </span>
              <div>
                <p className="font-medium text-gray-900 capitalize">{tourType} Tour</p>
                <p className="text-sm text-gray-500">{propertyTitle}</p>
              </div>
            </div>

            <h4 className="font-medium text-gray-900">Select a time slot</h4>

            <div className="max-h-64 overflow-y-auto space-y-4">
              {Object.entries(slotsByDate).map(([date, slots]) => (
                <div key={date}>
                  <p className="text-sm font-medium text-gray-700 mb-2">{date}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.available && setSelectedSlot(slot)}
                        disabled={!slot.available}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedSlot?.id === slot.id
                            ? 'bg-pink-500 text-white'
                            : slot.available
                            ? 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('confirm')}
              disabled={!selectedSlot}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Confirm Details */}
        {step === 'confirm' && selectedSlot && (
          <div className="space-y-4">
            <button
              onClick={() => setStep('schedule')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Selected Time Summary */}
            <div className="p-4 bg-pink-50 rounded-xl">
              <p className="text-sm text-pink-600 mb-1">Your appointment</p>
              <p className="font-bold text-gray-900 text-lg">{selectedSlot.date}</p>
              <p className="text-gray-600">{selectedSlot.time} (Zambia Time)</p>
            </div>

            {/* User Details Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  placeholder="097 123 4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questions for the landlord (optional)
                </label>
                <textarea
                  value={userInfo.notes}
                  onChange={(e) => setUserInfo({ ...userInfo, notes: e.target.value })}
                  placeholder="Any specific areas you want to see?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !userInfo.name || !userInfo.phone}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Scheduling...' : 'Confirm Booking'}
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && selectedSlot && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Tour Scheduled!</h4>
            <p className="text-gray-600 mb-6">
              Your {tourType} tour has been booked for:
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="font-bold text-lg text-gray-900">{selectedSlot.date}</p>
              <p className="text-gray-600">{selectedSlot.time} (Zambia Time)</p>
            </div>

            <div className="text-left p-4 bg-blue-50 rounded-xl mb-6">
              <p className="text-sm font-medium text-blue-900 mb-2">What's next?</p>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• You'll receive a confirmation SMS</li>
                <li>• {landlordName} will contact you before the tour</li>
                {tourType === 'whatsapp' && (
                  <li>• Keep your WhatsApp ready for the video call</li>
                )}
                {tourType === 'zoom' && (
                  <li>• Meeting link will be sent via SMS/WhatsApp</li>
                )}
                {tourType === 'physical' && (
                  <li>• Address and directions will be sent to you</li>
                )}
              </ul>
            </div>

            <button
              onClick={() => {
                setStep('info');
                setSelectedSlot(null);
                setUserInfo({ name: '', phone: '', notes: '' });
              }}
              className="text-pink-600 font-medium hover:underline"
            >
              Schedule another tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VirtualTourScheduler;
