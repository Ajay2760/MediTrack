'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Locale, translations } from '@/lib/i18n';

type LangContextType = {
    locale: Locale;
    setLocale: (l: Locale) => void;
    t: (key: string) => string;
};

const LangContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('meditrack-locale') as Locale | null;
            if (saved === 'en' || saved === 'ta') return saved;
        }
        return 'en';
    });

    const setLocale = useCallback((l: Locale) => {
        setLocaleState(l);
        if (typeof window !== 'undefined') localStorage.setItem('meditrack-locale', l);
    }, []);

    const t = useCallback((key: string) => {
        const dict = translations[locale];
        return dict[key] ?? translations.en[key] ?? key;
    }, [locale]);

    return (
        <LangContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LangContext);
    if (!ctx) return { locale: 'en' as Locale, setLocale: () => {}, t: (k: string) => k };
    return ctx;
}
