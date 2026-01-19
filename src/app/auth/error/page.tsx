'use client';

/**
 * Authentication Error Page
 * Displays authentication errors from NextAuth
 */

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Suspense } from 'react';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'Access denied. You do not have permission to access this resource.',
  Verification: 'The verification link may have expired or already been used.',
  OAuthSignin: 'Error constructing an authorization URL.',
  OAuthCallback: 'Error handling the response from the OAuth provider.',
  OAuthCreateAccount: 'Could not create an OAuth account in the database.',
  EmailCreateAccount: 'Could not create an email account in the database.',
  Callback: 'Error in the OAuth callback handler route.',
  OAuthAccountNotLinked: 'This email is already associated with another account. Please sign in with your original login method.',
  EmailSignin: 'Error sending the verification email.',
  CredentialsSignin: 'Invalid email or password. Please check your credentials and try again.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An unexpected error occurred during authentication.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;
  
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-serif font-bold text-neutral-900 mb-2">
            Authentication Error
          </h1>
          
          {/* Error Message */}
          <p className="text-neutral-600 mb-8">
            {errorMessage}
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            <Link href="/auth/login" className="block">
              <Button variant="primary" size="lg" className="w-full">
                Try Again
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" size="lg" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
          
          {/* Help Link */}
          <p className="mt-6 text-sm text-neutral-500">
            Need help?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
