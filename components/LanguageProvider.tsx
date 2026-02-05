'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translate, Language, getTranslations } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    translations: Record<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [translations, setTranslations] = useState<Record<string, string>>({});

    useEffect(() => {
        // Load language preference from localStorage
        const savedLanguage = localStorage.getItem('meditrack-language') as Language;
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ta')) {
            setLanguageState(savedLanguage);
            setTranslations(getTranslations(savedLanguage));
        } else {
            setTranslations(getTranslations('en'));
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setTranslations(getTranslations(lang));
        localStorage.setItem('meditrack-language', lang);
    };

    const t = (key: string): string => {
        return translate(key, language);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
