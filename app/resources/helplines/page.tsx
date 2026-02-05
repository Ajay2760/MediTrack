'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Helpline {
    name: string;
    nameTamil: string;
    number: string;
    description: string;
    descriptionTamil: string;
    category: 'emergency' | 'health' | 'support' | 'safety';
    available: string;
}

const helplines: Helpline[] = [
    {
        name: 'Ambulance Service',
        nameTamil: 'ஆம்புலன்ஸ் சேவை',
        number: '108',
        description: 'Free emergency ambulance service across India. Available 24/7.',
        descriptionTamil: 'இந்தியா முழுவதும் இலவச அவசர ஆம்புலன்ஸ் சேவை. 24/7 கிடைக்கும்.',
        category: 'emergency',
        available: '24/7'
    },
    {
        name: 'Emergency Services',
        nameTamil: 'அவசர சேவைகள்',
        number: '112',
        description: 'Single emergency number for Police, Fire, and Medical emergencies.',
        descriptionTamil: 'காவல்துறை, தீ மற்றும் மருத்துவ அவசரநிலைகளுக்கான ஒற்றை அவசர எண்.',
        category: 'emergency',
        available: '24/7'
    },
    {
        name: 'Health Helpline',
        nameTamil: 'சுகாதார உதவி எண்',
        number: '104',
        description: 'National Health Helpline for medical advice and health information.',
        descriptionTamil: 'மருத்துவ ஆலோசனை மற்றும் சுகாதார தகவலுக்கான தேசிய சுகாதார உதவி எண்.',
        category: 'health',
        available: '24/7'
    },
    {
        name: 'Poison Control Center',
        nameTamil: 'நச்சு கட்டுப்பாடு மையம்',
        number: '1066',
        description: 'Expert advice for poisoning emergencies and toxic exposures.',
        descriptionTamil: 'விஷம் அவசரநிலைகள் மற்றும் நச்சு வெளிப்பாடுகளுக்கு நிபுணர் ஆலோசனை.',
        category: 'emergency',
        available: '24/7'
    },
    {
        name: 'Women Helpline',
        nameTamil: 'பெண்கள் உதவி எண்',
        number: '1091',
        description: 'Emergency helpline for women in distress. Police assistance available.',
        descriptionTamil: 'துயரத்தில் உள்ள பெண்களுக்கான அவசர உதவி எண். காவல்துறை உதவி கிடைக்கும்.',
        category: 'safety',
        available: '24/7'
    },
    {
        name: 'Child Helpline',
        nameTamil: 'குழந்தை உதவி எண்',
        number: '1098',
        description: 'Free helpline for children in need of care and protection.',
        descriptionTamil: 'பராமரிப்பு மற்றும் பாதுகாப்பு தேவைப்படும் குழந்தைகளுக்கான இலவச உதவி எண்.',
        category: 'support',
        available: '24/7'
    },
    {
        name: 'Mental Health Helpline',
        nameTamil: 'மனநல உதவி எண்',
        number: '08046110007',
        description: 'Vandrevala Foundation - Free mental health counseling and support.',
        descriptionTamil: 'வந்த்ரேவாலா அறக்கட்டளை - இலவச மனநல ஆலோசனை மற்றும் ஆதரவு.',
        category: 'health',
        available: '24/7'
    },
    {
        name: 'Disaster Management',
        nameTamil: 'பேரிடர் மேலாண்மை',
        number: '1070',
        description: 'National Disaster Management Authority helpline for disaster-related assistance.',
        descriptionTamil: 'பேரிடர் தொடர்பான உதவிக்கான தேசிய பேரிடர் மேலாண்மை ஆணையம் உதவி எண்.',
        category: 'emergency',
        available: '24/7'
    },
    {
        name: 'COVID-19 Helpline',
        nameTamil: 'COVID-19 உதவி எண்',
        number: '1075',
        description: 'Ministry of Health helpline for COVID-19 related queries and support.',
        descriptionTamil: 'COVID-19 தொடர்பான கேள்விகள் மற்றும் ஆதரவுக்கான சுகாதார அமைச்சகம் உதவி எண்.',
        category: 'health',
        available: '24/7'
    },
    {
        name: 'Senior Citizen Helpline',
        nameTamil: 'மூத்த குடிமக்கள் உதவி எண்',
        number: '14567',
        description: 'Helpline for senior citizens for assistance and support.',
        descriptionTamil: 'உதவி மற்றும் ஆதரவுக்கான மூத்த குடிமக்களுக்கான உதவி எண்.',
        category: 'support',
        available: '24/7'
    },
    {
        name: 'Railway Helpline',
        nameTamil: 'இரயில்வே உதவி எண்',
        number: '139',
        description: 'Indian Railways helpline for train-related emergencies and inquiries.',
        descriptionTamil: 'ரயில் தொடர்பான அவசரநிலைகள் மற்றும் விசாரணைகளுக்கான இந்திய ரயில்வே உதவி எண்.',
        category: 'emergency',
        available: '24/7'
    },
    {
        name: 'Road Accident Emergency',
        nameTamil: 'சாலை விபத்து அவசர எண்',
        number: '1073',
        description: 'Highway emergency response and road accident assistance.',
        descriptionTamil: 'நெடுஞ்சாலை அவசர பதில் மற்றும் சாலை விபத்து உதவி.',
        category: 'emergency',
        available: '24/7'
    }
];

export default function HelplinesPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [language, setLanguage] = useState<'en' | 'ta'>('en');

    const categories = [
        { value: 'all', label: 'All Helplines', labelTamil: 'அனைத்து உதவி எண்கள்' },
        { value: 'emergency', label: 'Emergency', labelTamil: 'அவசர' },
        { value: 'health', label: 'Health', labelTamil: 'சுகாதாரம்' },
        { value: 'safety', label: 'Safety', labelTamil: 'பாதுகாப்பு' },
        { value: 'support', label: 'Support', labelTamil: 'ஆதரவு' }
    ];

    const filteredHelplines = selectedCategory === 'all'
        ? helplines
        : helplines.filter(h => h.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-neutral-50 dark:via-neutral-100 dark:to-neutral-50">
            {/* Header */}
            <div className="bg-secondary-blue dark:bg-secondary-blue-dark text-white py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">📞 Emergency Helpline Directory</h1>
                    <p className="text-blue-100">Important contact numbers for emergencies and support services</p>

                    {/* Language Toggle */}
                    <div className="mt-4 inline-flex rounded-full p-1 bg-white/20">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${language === 'en' ? 'bg-white text-secondary-blue' : 'text-white/80'
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('ta')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${language === 'ta' ? 'bg-white text-secondary-blue' : 'text-white/80'
                                }`}
                        >
                            தமிழ்
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Filters */}
            <div className="bg-white dark:bg-neutral-100 py-4 border-b border-border-color">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-full font-semibold transition ${selectedCategory === cat.value
                                        ? 'bg-secondary-blue text-white'
                                        : 'bg-neutral-200 dark:bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                                    }`}
                            >
                                {language === 'en' ? cat.label : cat.labelTamil}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Helplines List */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-4">
                    {filteredHelplines.map((helpline, idx) => (
                        <div key={idx} className="card card-glass p-6 hover:shadow-xl transition">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* Number */}
                                <div className="flex-shrink-0">
                                    <a
                                        href={`tel:${helpline.number}`}
                                        className="block bg-primary-teal hover:bg-primary-teal-dark text-white px-6 py-4 rounded-lg text-center transition"
                                    >
                                        <div className="text-sm font-semibold mb-1">Call Now</div>
                                        <div className="text-2xl font-bold">{helpline.number}</div>
                                    </a>
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-primary-teal">
                                            {language === 'en' ? helpline.name : helpline.nameTamil}
                                        </h3>
                                        <span className="badge bg-accent-green text-white text-xs">
                                            {helpline.available}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary">
                                        {language === 'en' ? helpline.description : helpline.descriptionTamil}
                                    </p>
                                </div>

                                {/* Category Badge */}
                                <div className="flex-shrink-0">
                                    <span className="badge bg-neutral-200 text-neutral-700 capitalize">
                                        {helpline.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Emergency Banner */}
                <div className="mt-12 max-w-4xl mx-auto bg-emergency-red text-white p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">🚨 Life-Threatening Emergency?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a href="tel:108" className="block bg-white/20 hover:bg-white/30 p-6 rounded-lg text-center transition">
                            <div className="text-sm font-semibold mb-2">Ambulance</div>
                            <div className="text-5xl font-bold">108</div>
                        </a>
                        <a href="tel:112" className="block bg-white/20 hover:bg-white/30 p-6 rounded-lg text-center transition">
                            <div className="text-sm font-semibold mb-2">All Emergencies</div>
                            <div className="text-5xl font-bold">112</div>
                        </a>
                    </div>
                </div>

                {/* Save to Phone */}
                <div className="mt-8 text-center text-sm text-text-secondary">
                    <p className="italic">💡 Tip: Save these numbers in your phone contacts for quick access during emergencies</p>
                </div>
            </div>
        </div>
    );
}
