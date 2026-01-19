'use client';

/**
 * Zambia Property - Admin Settings Page
 * 
 * Platform configuration and settings management
 */

import { useState, useEffect } from 'react';
import { useRequireRole } from '@/contexts/AuthContext';

interface PlatformSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    supportEmail: string;
    defaultCurrency: string;
    defaultLanguage: string;
  };
  features: {
    enableRegistration: boolean;
    enableGuestInquiries: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    autoApproveAgents: boolean;
    autoApproveProperties: boolean;
    enableFeaturedListings: boolean;
    enablePropertyReviews: boolean;
  };
  limits: {
    maxImagesPerProperty: number;
    maxPropertiesPerAgent: number;
    maxPropertiesPerLandlord: number;
    featuredDurationDays: number;
    inquiryRateLimitPerHour: number;
  };
  pricing: {
    basicFeaturePrice: number;
    premiumFeaturePrice: number;
    spotlightFeaturePrice: number;
    agentSubscriptionMonthly: number;
    agentSubscriptionYearly: number;
  };
  notifications: {
    sendWelcomeEmail: boolean;
    sendPropertyApprovalEmail: boolean;
    sendInquiryNotifications: boolean;
    sendWeeklyReports: boolean;
    adminEmailForAlerts: string;
  };
}

// Default settings (would come from API in production)
const defaultSettings: PlatformSettings = {
  general: {
    siteName: 'Zambia Property',
    siteDescription: 'Find your perfect home in Zambia',
    contactEmail: 'info@zambiaproperty.com',
    contactPhone: '+260 97 XXX XXXX',
    supportEmail: 'support@zambiaproperty.com',
    defaultCurrency: 'ZMW',
    defaultLanguage: 'en',
  },
  features: {
    enableRegistration: true,
    enableGuestInquiries: true,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    autoApproveAgents: false,
    autoApproveProperties: false,
    enableFeaturedListings: true,
    enablePropertyReviews: true,
  },
  limits: {
    maxImagesPerProperty: 20,
    maxPropertiesPerAgent: 100,
    maxPropertiesPerLandlord: 50,
    featuredDurationDays: 30,
    inquiryRateLimitPerHour: 10,
  },
  pricing: {
    basicFeaturePrice: 500,
    premiumFeaturePrice: 1000,
    spotlightFeaturePrice: 2000,
    agentSubscriptionMonthly: 500,
    agentSubscriptionYearly: 5000,
  },
  notifications: {
    sendWelcomeEmail: true,
    sendPropertyApprovalEmail: true,
    sendInquiryNotifications: true,
    sendWeeklyReports: true,
    adminEmailForAlerts: 'admin@zambiaproperty.com',
  },
};

type SettingsSection = keyof PlatformSettings;

export default function AdminSettingsPage() {
  const { isAuthorized, isLoading: authLoading } = useRequireRole(['ADMIN']);
  
  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<PlatformSettings>(defaultSettings);
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Check for changes
  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);
  
  // Handle toggle change
  const handleToggle = (section: SettingsSection, key: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof typeof prev[typeof section]],
      },
    }));
  };
  
  // Handle input change
  const handleInputChange = (section: SettingsSection, key: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };
  
  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      // In production, this would call an API endpoint
      // const response = await fetch('/api/admin/settings', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset changes
  const handleReset = () => {
    setSettings(originalSettings);
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthorized) return null;
  
  const sections: { key: SettingsSection; label: string; icon: React.ReactNode }[] = [
    {
      key: 'general',
      label: 'General',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      key: 'features',
      label: 'Features',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      key: 'limits',
      label: 'Limits',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      key: 'pricing',
      label: 'Pricing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ];
  
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-neutral-600">Configure platform settings and preferences</p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
      
      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-neutral-100 p-2">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === section.key
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {section.icon}
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-neutral-100 p-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Site Name"
                    value={settings.general.siteName}
                    onChange={(v) => handleInputChange('general', 'siteName', v)}
                  />
                  <InputField
                    label="Site Description"
                    value={settings.general.siteDescription}
                    onChange={(v) => handleInputChange('general', 'siteDescription', v)}
                  />
                  <InputField
                    label="Contact Email"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(v) => handleInputChange('general', 'contactEmail', v)}
                  />
                  <InputField
                    label="Contact Phone"
                    value={settings.general.contactPhone}
                    onChange={(v) => handleInputChange('general', 'contactPhone', v)}
                  />
                  <InputField
                    label="Support Email"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(v) => handleInputChange('general', 'supportEmail', v)}
                  />
                  <SelectField
                    label="Default Currency"
                    value={settings.general.defaultCurrency}
                    options={[
                      { value: 'ZMW', label: 'Zambian Kwacha (ZMW)' },
                      { value: 'USD', label: 'US Dollar (USD)' },
                    ]}
                    onChange={(v) => handleInputChange('general', 'defaultCurrency', v)}
                  />
                </div>
              </div>
            )}
            
            {/* Features Settings */}
            {activeSection === 'features' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">Feature Settings</h2>
                
                <div className="space-y-4">
                  <ToggleField
                    label="Enable User Registration"
                    description="Allow new users to register on the platform"
                    enabled={settings.features.enableRegistration}
                    onChange={() => handleToggle('features', 'enableRegistration')}
                  />
                  <ToggleField
                    label="Enable Guest Inquiries"
                    description="Allow non-registered users to send property inquiries"
                    enabled={settings.features.enableGuestInquiries}
                    onChange={() => handleToggle('features', 'enableGuestInquiries')}
                  />
                  <ToggleField
                    label="Require Email Verification"
                    description="New users must verify their email before accessing features"
                    enabled={settings.features.requireEmailVerification}
                    onChange={() => handleToggle('features', 'requireEmailVerification')}
                  />
                  <ToggleField
                    label="Require Phone Verification"
                    description="New users must verify their phone number"
                    enabled={settings.features.requirePhoneVerification}
                    onChange={() => handleToggle('features', 'requirePhoneVerification')}
                  />
                  <ToggleField
                    label="Auto-approve Agents"
                    description="Automatically approve new agent registrations"
                    enabled={settings.features.autoApproveAgents}
                    onChange={() => handleToggle('features', 'autoApproveAgents')}
                  />
                  <ToggleField
                    label="Auto-approve Properties"
                    description="Automatically approve new property listings"
                    enabled={settings.features.autoApproveProperties}
                    onChange={() => handleToggle('features', 'autoApproveProperties')}
                  />
                  <ToggleField
                    label="Enable Featured Listings"
                    description="Allow users to feature their listings for increased visibility"
                    enabled={settings.features.enableFeaturedListings}
                    onChange={() => handleToggle('features', 'enableFeaturedListings')}
                  />
                  <ToggleField
                    label="Enable Property Reviews"
                    description="Allow users to leave reviews on properties"
                    enabled={settings.features.enablePropertyReviews}
                    onChange={() => handleToggle('features', 'enablePropertyReviews')}
                  />
                </div>
              </div>
            )}
            
            {/* Limits Settings */}
            {activeSection === 'limits' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">Limit Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NumberField
                    label="Max Images per Property"
                    value={settings.limits.maxImagesPerProperty}
                    onChange={(v) => handleInputChange('limits', 'maxImagesPerProperty', v)}
                    min={1}
                    max={50}
                  />
                  <NumberField
                    label="Max Properties per Agent"
                    value={settings.limits.maxPropertiesPerAgent}
                    onChange={(v) => handleInputChange('limits', 'maxPropertiesPerAgent', v)}
                    min={1}
                    max={500}
                  />
                  <NumberField
                    label="Max Properties per Landlord"
                    value={settings.limits.maxPropertiesPerLandlord}
                    onChange={(v) => handleInputChange('limits', 'maxPropertiesPerLandlord', v)}
                    min={1}
                    max={100}
                  />
                  <NumberField
                    label="Featured Duration (days)"
                    value={settings.limits.featuredDurationDays}
                    onChange={(v) => handleInputChange('limits', 'featuredDurationDays', v)}
                    min={1}
                    max={365}
                  />
                  <NumberField
                    label="Inquiry Rate Limit (per hour)"
                    value={settings.limits.inquiryRateLimitPerHour}
                    onChange={(v) => handleInputChange('limits', 'inquiryRateLimitPerHour', v)}
                    min={1}
                    max={100}
                  />
                </div>
              </div>
            )}
            
            {/* Pricing Settings */}
            {activeSection === 'pricing' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">Pricing Settings</h2>
                <p className="text-sm text-neutral-500">All prices are in {settings.general.defaultCurrency}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NumberField
                    label="Basic Feature Price"
                    value={settings.pricing.basicFeaturePrice}
                    onChange={(v) => handleInputChange('pricing', 'basicFeaturePrice', v)}
                    min={0}
                    prefix="K"
                  />
                  <NumberField
                    label="Premium Feature Price"
                    value={settings.pricing.premiumFeaturePrice}
                    onChange={(v) => handleInputChange('pricing', 'premiumFeaturePrice', v)}
                    min={0}
                    prefix="K"
                  />
                  <NumberField
                    label="Spotlight Feature Price"
                    value={settings.pricing.spotlightFeaturePrice}
                    onChange={(v) => handleInputChange('pricing', 'spotlightFeaturePrice', v)}
                    min={0}
                    prefix="K"
                  />
                  <NumberField
                    label="Agent Subscription (Monthly)"
                    value={settings.pricing.agentSubscriptionMonthly}
                    onChange={(v) => handleInputChange('pricing', 'agentSubscriptionMonthly', v)}
                    min={0}
                    prefix="K"
                  />
                  <NumberField
                    label="Agent Subscription (Yearly)"
                    value={settings.pricing.agentSubscriptionYearly}
                    onChange={(v) => handleInputChange('pricing', 'agentSubscriptionYearly', v)}
                    min={0}
                    prefix="K"
                  />
                </div>
              </div>
            )}
            
            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-neutral-900">Notification Settings</h2>
                
                <div className="space-y-4">
                  <ToggleField
                    label="Send Welcome Email"
                    description="Send a welcome email to new users upon registration"
                    enabled={settings.notifications.sendWelcomeEmail}
                    onChange={() => handleToggle('notifications', 'sendWelcomeEmail')}
                  />
                  <ToggleField
                    label="Send Property Approval Email"
                    description="Notify property owners when their listing is approved or rejected"
                    enabled={settings.notifications.sendPropertyApprovalEmail}
                    onChange={() => handleToggle('notifications', 'sendPropertyApprovalEmail')}
                  />
                  <ToggleField
                    label="Send Inquiry Notifications"
                    description="Notify property owners when they receive new inquiries"
                    enabled={settings.notifications.sendInquiryNotifications}
                    onChange={() => handleToggle('notifications', 'sendInquiryNotifications')}
                  />
                  <ToggleField
                    label="Send Weekly Reports"
                    description="Send weekly performance reports to agents and landlords"
                    enabled={settings.notifications.sendWeeklyReports}
                    onChange={() => handleToggle('notifications', 'sendWeeklyReports')}
                  />
                </div>
                
                <div className="pt-4 border-t border-neutral-100">
                  <InputField
                    label="Admin Email for Alerts"
                    type="email"
                    value={settings.notifications.adminEmailForAlerts}
                    onChange={(v) => handleInputChange('notifications', 'adminEmailForAlerts', v)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Input Field Component
function InputField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}

// Number Field Component
function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className={`w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            prefix ? 'pl-8' : ''
          }`}
        />
      </div>
    </div>
  );
}

// Select Field Component
function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Toggle Field Component
function ToggleField({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'left-7' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
