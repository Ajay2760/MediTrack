'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

export default function HomePage() {
  const { locale, setLocale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Language toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          type="button"
          onClick={() => setLocale('en')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${locale === 'en' ? 'bg-primary-blue text-white' : 'bg-neutral-200 text-neutral-700'}`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLocale('ta')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${locale === 'ta' ? 'bg-primary-blue text-white' : 'bg-neutral-200 text-neutral-700'}`}
        >
          தமிழ்
        </button>
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
