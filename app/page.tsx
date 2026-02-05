'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';

export default function HomePage() {
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Language and Theme toggles */}
      <div className="absolute top-4 right-4 flex gap-4 items-center">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-3 rounded-full transition-all bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 shadow-md hover:shadow-lg"
          aria-label="Toggle theme"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {/* Language Toggle */}
        <div className="inline-flex rounded-full p-1 bg-neutral-200 dark:bg-neutral-700 shadow-md">
          <button
            type="button"
            onClick={() => setLocale('en')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${locale === 'en'
              ? 'bg-primary-blue text-white shadow-md'
              : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-blue dark:hover:text-primary-light'
              }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLocale('ta')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${locale === 'ta'
              ? 'bg-primary-blue text-white shadow-md'
              : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-blue dark:hover:text-primary-light'
              }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto fade-in">
          <div className="inline-block mb-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              🚑 {t('appName')}
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
            {t('tagline')}
            <br />
            <span className="text-primary-blue">{t('tamilNadu')}</span>
          </h1>

          <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto">
            Emergency response across Tamil Nadu. Track ambulances in real-time,
            request immediate help with one tap, and save lives with GPS-powered precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/sos" className="btn btn-emergency">
              🚨 {t('sosButton')}
            </Link>
            <Link href="/auth/login" className="btn btn-primary">
              {t('login')} / {t('signUp')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="card card-glass text-center p-8">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Live GPS Tracking</h3>
              <p className="text-neutral-600">
                Track ambulances in real-time with accurate GPS location updates
              </p>
            </div>

            <div className="card card-glass text-center p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Response</h3>
              <p className="text-neutral-600">
                Auto-match with nearest available ambulance within seconds
              </p>
            </div>

            <div className="card card-glass text-center p-8">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold mb-2">Hospital Integration</h3>
              <p className="text-neutral-600">
                Direct routing to nearest hospitals with pre-arrival notification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-blue text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Request Emergency</h3>
                <p className="text-neutral-600">
                  Click the SOS button and your location is instantly shared with the nearest ambulance
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-blue text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Track in Real-Time</h3>
                <p className="text-neutral-600">
                  See the ambulance location on the map with live updates and estimated arrival time
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-primary-blue text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Get Help Fast</h3>
                <p className="text-neutral-600">
                  Ambulance arrives, picks you up, and takes you to the nearest hospital while updating your status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Save Lives?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join MediTrack today and be part of the emergency response revolution
          </p>
          <Link href="/auth/signup" className="btn btn-emergency">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-400">
            © 2026 MediTrack – Tamil Nadu. All rights reserved. | Emergency: 108 / 112
          </p>
        </div>
      </footer>
    </div>
  );
}
