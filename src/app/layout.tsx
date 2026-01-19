/**
 * Zambia Property - Root Layout
 * 
 * Main application layout with providers
 */

import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { CookieConsent } from '@/components/ui/CookieConsent';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zambia Property | Find Your Dream Home in Zambia',
    template: '%s | Zambia Property',
  },
  description:
    'Discover premium properties in Zambia. Browse houses, apartments, land, and commercial properties for sale and rent across Lusaka, Copperbelt, and beyond.',
  keywords: [
    'Zambia property',
    'houses for sale Zambia',
    'property for rent Lusaka',
    'real estate Zambia',
    'land for sale Zambia',
    'commercial property Zambia',
    'apartments Lusaka',
    'property agents Zambia',
  ],
  authors: [{ name: 'Zambia Property' }],
  creator: 'Zambia Property',
  publisher: 'Zambia Property',
  formatDetection: {
    email: false,
    telephone: true,
    address: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://zambiaproperty.com'),
  openGraph: {
    type: 'website',
    locale: 'en_ZM',
    url: '/',
    siteName: 'Zambia Property',
    title: 'Zambia Property | Find Your Dream Home in Zambia',
    description:
      'Discover premium properties in Zambia. Browse houses, apartments, land, and commercial properties for sale and rent.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zambia Property - Find Your Dream Home',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zambia Property | Find Your Dream Home in Zambia',
    description:
      'Discover premium properties in Zambia. Browse houses, apartments, land, and commercial properties for sale and rent.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900">
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
