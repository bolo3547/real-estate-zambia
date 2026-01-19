'use client';

/**
 * Zambia Property - Dashboard Settings Page
 */

import { useState } from 'react';
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Button, Input, Modal } from '@/components/ui';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { success, error: showError } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [notifications, setNotifications] = useState({
    emailInquiries: true,
    emailNewListings: true,
    emailNewsletter: false,
    smsInquiries: false,
  });
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to change password');
      }
      
      success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      showError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const handleNotificationChange = async (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    // In production, save to API
  };
  
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      showError('Please type your email to confirm');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      logout();
    } catch (err) {
      showError('Failed to delete account');
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated || !user) return null;
  
  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account settings and preferences</p>
      </div>
      
      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Change Password</h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
            required
          />
          
          <Input
            type="password"
            label="New Password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
            hint="Must be at least 8 characters"
            required
          />
          
          <Input
            type="password"
            label="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />
          
          <Button type="submit" variant="primary" isLoading={isChangingPassword}>
            Update Password
          </Button>
        </form>
      </div>
      
      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Notification Preferences</h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between py-3 border-b border-neutral-100 cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">Inquiry Notifications</p>
              <p className="text-sm text-neutral-500">Receive emails when someone inquires about your property</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.emailInquiries}
                onChange={() => handleNotificationChange('emailInquiries')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.emailInquiries ? 'bg-primary' : 'bg-neutral-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${notifications.emailInquiries ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between py-3 border-b border-neutral-100 cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">New Listings Alerts</p>
              <p className="text-sm text-neutral-500">Get notified about new properties matching your preferences</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.emailNewListings}
                onChange={() => handleNotificationChange('emailNewListings')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.emailNewListings ? 'bg-primary' : 'bg-neutral-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${notifications.emailNewListings ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between py-3 border-b border-neutral-100 cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">Newsletter</p>
              <p className="text-sm text-neutral-500">Receive our weekly newsletter with market insights</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.emailNewsletter}
                onChange={() => handleNotificationChange('emailNewsletter')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.emailNewsletter ? 'bg-primary' : 'bg-neutral-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${notifications.emailNewsletter ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>
          
          <label className="flex items-center justify-between py-3 cursor-pointer">
            <div>
              <p className="font-medium text-neutral-900">SMS Notifications</p>
              <p className="text-sm text-neutral-500">Receive SMS alerts for urgent inquiries</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.smsInquiries}
                onChange={() => handleNotificationChange('smsInquiries')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.smsInquiries ? 'bg-primary' : 'bg-neutral-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${notifications.smsInquiries ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-white rounded-2xl p-6 shadow-premium-sm border border-red-100">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">Delete Account</p>
              <p className="text-sm text-neutral-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      
      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-red-800">This action cannot be undone</p>
                <p className="text-sm text-red-700 mt-1">
                  All your data including properties, inquiries, and account information will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-neutral-600 mb-2">
              Type <span className="font-mono font-semibold">{user.email}</span> to confirm:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type your email"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmation !== user.email}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
