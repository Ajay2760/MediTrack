'use client';

import Link from 'next/link';
import { useState } from 'react';

interface FirstAidCategory {
    id: string;
    title: string;
    titleTamil: string;
    icon: string;
    steps: string[];
    stepsTamil: string[];
    warnings: string[];
}

const firstAidCategories: FirstAidCategory[] = [
    {
        id: 'cpr',
        title: 'CPR (Cardiopulmonary Resuscitation)',
        titleTamil: 'இதய நுரையீரல் புத்துயிர் (CPR)',
        icon: '❤️',
        steps: [
            'Check if the person is responsive - tap shoulders and shout',
            'Call 108 immediately for emergency help',
            'Place person on back on firm surface',
            'Position hands in center of chest, interlock fingers',
            'Push hard and fast - 100-120 compressions per minute, 2 inches deep',
            'Give 30 compressions, then 2 rescue breaths',
            'Continue until help arrives or person starts breathing'
        ],
        stepsTamil: [
            'நபர் பதிலளிக்கிறாரா என சரிபார்க்கவும் - தோள்களை தட்டி கத்தவும்',
            'அவசர உதவிக்கு உடனடியாக 108 ஐ அழைக்கவும்',
            'நபரை உறுதியான மேற்பரப்பில் முதுகில் வைக்கவும்',
            'மார்பின் மையத்தில் கைகளை வைக்கவும், விரல்களை இணைக்கவும்',
            'கடினமாகவும் வேகமாகவும் அழுத்தவும் - நிமிடத்திற்கு 100-120 அழுத்தங்கள், 2 அங்குல ஆழம்',
            '30 அழுத்தங்கள், பின்னர் 2 மீட்பு மூச்சுகள் கொடுக்கவும்',
            'உதவி வரும் வரை அல்லது நபர் சுவாசிக்க தொடங்கும் வரை தொடரவும்'
        ],
        warnings: ['⚠️ Only perform if trained', '⚠️ Do not stop until help arrives']
    },
    {
        id: 'choking',
        title: 'Choking',
        titleTamil: 'மூச்சுத்திணறல்',
        icon: '🫁',
        steps: [
            'Encourage person to cough if they can',
            'If cannot cough/speak, perform Heimlich maneuver',
            'Stand behind person, wrap arms around waist',
            'Make fist above navel, grasp with other hand',
            'Give 5 quick upward thrusts',
            'Repeat until object dislodges',
            'Call 108 if unsuccessful'
        ],
        stepsTamil: [
            'இருமல் முடிந்தால் நபரை ஊக்குவிக்கவும்',
            'இருமல்/பேச முடியாவிட்டால், ஹெய்ம்லிச் சூழ்ச்சியைச் செய்யவும்',
            'நபரின் பின்னால் நின்று, இடுப்பைச் சுற்றி கைகளை சுற்றவும்',
            'தொப்புளுக்கு மேலே கை குதிரையை உருவாக்கி, மற்றொரு கையால் பிடிக்கவும்',
            '5 விரைவான மேல்நோக்கி உந்துதல்களை கொடுக்கவும்',
            'பொருள் வெளியேறும் வரை மீண்டும் செய்யவும்',
            'வெற்றி பெறவில்லை என்றால் 108 ஐ அழைக்கவும்'
        ],
        warnings: ['⚠️ For infants: use back blows and chest thrusts', '⚠️ Never sweep mouth blindly']
    },
    {
        id: 'bleeding',
        title: 'Severe Bleeding',
        titleTamil: 'கடுமையான இரத்தப்போக்கு',
        icon: '🩹',
        steps: [
            'Call 108 for severe bleeding',
            'Apply direct pressure with clean cloth',
            'Do not remove cloth if soaked - add more layers',
            'Elevate injured area above heart if possible',
            'Apply pressure to pressure points if bleeding continues',
            'Apply tourniquet only as last resort for limb bleeding',
            'Keep person calm and lying down'
        ],
        stepsTamil: [
            'கடுமையான இரத்தப்போக்குக்கு 108 ஐ அழைக்கவும்',
            'சுத்தமான துணியுடன் நேரடி அழுத்தம் பயன்படுத்தவும்',
            'நனைந்திருந்தால் துணியை அகற்ற வேண்டாம் - மேலும் அடுக்குகளைச் சேர்க்கவும்',
            'முடிந்தால் காயப்பட்ட பகுதியை இதயத்திற்கு மேல் உயர்த்தவும்',
            'இரத்தப்போக்கு தொடர்ந்தால் அழுத்த புள்ளிகளில் அழுத்தம் பயன்படுத்தவும்',
            'மூட்டு இரத்தப்போக்குக்கு கடைசி முயற்சியாக மட்டுமே டூர்னிக்கெட் பயன்படுத்தவும்',
            'நபரை அமைதியாகவும் படுத்திருக்கவும் வைக்கவும்'
        ],
        warnings: ['⚠️ Do not remove embedded objects', '⚠️ Watch for shock symptoms']
    },
    {
        id: 'burns',
        title: 'Burns',
        titleTamil: 'தீக்காயங்கள்',
        icon: '🔥',
        steps: [
            'Remove from heat source immediately',
            'Cool burn with running water for 10-20 minutes',
            'Do NOT use ice directly on burn',
            'Remove jewelry/tight clothing near burn',
            'Cover with sterile, non-stick dressing',
            'Do NOT apply ointments, butter, or oil',
            'For severe burns, call 108 immediately'
        ],
        stepsTamil: [
            'வெப்ப மூலத்திலிருந்து உடனடியாக அகற்றவும்',
            '10-20 நிமிடங்களுக்கு ஓடும் தண்ணீரில் தீக்காயத்தை குளிர்விக்கவும்',
            'நேரடியாக பனியை பயன்படுத்த வேண்டாம்',
            'தீக்காயத்திற்கு அருகில் உள்ள நகைகள்/இறுக்கமான ஆடைகளை அகற்றவும்',
            'மலட்டு, ஒட்டாத டிரஸ்ஸிங்குடன் மூடவும்',
            'களிம்புகள், வெண்ணெய் அல்லது எண்ணெய் பயன்படுத்த வேண்டாம்',
            'கடுமையான தீக்காயங்களுக்கு, உடனடியாக 108 ஐ அழைக்கவும்'
        ],
        warnings: ['⚠️ Watch for infection signs', '⚠️ Large burns need medical attention']
    },
    {
        id: 'fractures',
        title: 'Fractures & Broken Bones',
        titleTamil: 'எலும்பு முறிவுகள்',
        icon: '🦴',
        steps: [
            'Do NOT move the person unless necessary',
            'Call 108 for medical help',
            'Immobilize the injured area',
            'Apply ice pack to reduce swelling',
            'Do NOT try to realign the bone',
            'Treat for shock if needed',
            'Keep person still until help arrives'
        ],
        stepsTamil: [
            'தேவையில்லாவிட்டால் நபரை நகர்த்த வேண்டாம்',
            'மருத்துவ உதவிக்கு 108 ஐ அழைக்கவும்',
            'காயப்பட்ட பகுதியை அசையாமல் இருக்கவும்',
            'வீக்கத்தைக் குறைக்க ஐஸ் பேக் பயன்படுத்தவும்',
            'எலும்பை மீண்டும் சீரமைக்க முயற்சிக்க வேண்டாம்',
            'தேவைப்பட்டால் அதிர்ச்சிக்கு சிகிச்சை அளிக்கவும்',
            'உதவி வரும் வரை நபரை அசையாமல் இருக்கவும்'
        ],
        warnings: ['⚠️ Do not give food/water in case surgery needed', '⚠️ Watch for circulation problems']
    },
    {
        id: 'snake-bite',
        title: 'Snake Bite',
        titleTamil: 'பாம்பு கடி',
        icon: '🐍',
        steps: [
            'Call 108 IMMEDIATELY - snake bites are serious',
            'Keep person calm and still',
            'Remove jewelry/tight clothing near bite',
            'Position bite below heart level',
            'Clean wound gently with soap and water',
            'Cover with clean, dry dressing',
            'Note snake appearance if safe to do so'
        ],
        stepsTamil: [
            'உடனடியாக 108 ஐ அழைக்கவும் - பாம்பு கடிகள் தீவிரமானவை',
            'நபரை அமைதியாகவும் அசையாமலும் வைக்கவும்',
            'கடிக்கு அருகில் உள்ள நகைகள்/இறுக்கமான ஆடைகளை அகற்றவும்',
            'கடியை இதய மட்டத்திற்கு கீழே வைக்கவும்',
            'சோப்பு மற்றும் தண்ணீரால் காயத்தை மெதுவாக சுத்தம் செய்யவும்',
            'சுத்தமான, உலர்ந்த டிரஸ்ஸிங்குடன் மூடவும்',
            'பாதுகாப்பாக இருந்தால் பாம்பின் தோற்றத்தை கவனிக்கவும்'
        ],
        warnings: ['⚠️ DO NOT apply tourniquet', '⚠️ DO NOT cut wound or suck venom', '⚠️ DO NOT apply ice']
    }
];

export default function FirstAidPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [language, setLanguage] = useState<'en' | 'ta'>('en');

    const selectedItem = firstAidCategories.find(cat => cat.id === selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-neutral-50 dark:via-neutral-100 dark:to-neutral-50">
            {/* Header */}
            <div className="bg-primary-teal dark:bg-primary-teal-dark text-white py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">🏥 Emergency First Aid Guide</h1>
                    <p className="text-teal-100">Quick reference for common medical emergencies</p>

                    {/* Language Toggle */}
                    <div className="mt-4 inline-flex rounded-full p-1 bg-white/20">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${language === 'en' ? 'bg-white text-primary-teal' : 'text-white/80'
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('ta')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${language === 'ta' ? 'bg-white text-primary-teal' : 'text-white/80'
                                }`}
                        >
                            தமிழ்
                        </button>
                    </div>
                </div>
            </div>

            {/* Emergency Banner */}
            <div className="bg-emergency-red text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p className="font-bold">🚨 IN CASE OF EMERGENCY: Call 108 (Ambulance) or 112 (Emergency)</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                {!selectedCategory ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {firstAidCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className="card card-glass text-left hover:shadow-xl transition-all p-6"
                            >
                                <div className="text-5xl mb-4">{category.icon}</div>
                                <h3 className="text-xl font-bold text-primary-teal mb-2">
                                    {language === 'en' ? category.title : category.titleTamil}
                                </h3>
                                <p className="text-text-secondary text-sm">Click to view steps →</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="mb-6 text-primary-teal hover:underline"
                        >
                            ← Back to all categories
                        </button>

                        <div className="card card-glass p-8">
                            <div className="text-6xl mb-4">{selectedItem?.icon}</div>
                            <h2 className="text-3xl font-bold text-primary-teal mb-6">
                                {language === 'en' ? selectedItem?.title : selectedItem?.titleTamil}
                            </h2>

                            {/* Warnings */}
                            <div className="bg-warning-amber/10 border-l-4 border-warning-amber p-4 mb-6">
                                {selectedItem?.warnings.map((warning, idx) => (
                                    <p key={idx} className="text-warning-amber-dark font-semibold mb-1">
                                        {warning}
                                    </p>
                                ))}
                            </div>

                            {/* Steps */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold mb-4">Steps to Follow:</h3>
                                {(language === 'en' ? selectedItem?.steps : selectedItem?.stepsTamil)?.map((step, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary-teal text-white rounded-full flex items-center justify-center font-bold">
                                            {idx + 1}
                                        </div>
                                        <p className="flex-1 pt-1">{step}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Emergency Numbers */}
                            <div className="mt-8 p-6 bg-emergency-red/10 rounded-lg border-2 border-emergency-red">
                                <h4 className="font-bold text-emergency-red mb-2">Emergency Contacts:</h4>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Ambulance:</strong> <a href="tel:108" className="text-primary-teal underline">108</a></p>
                                    <p><strong>Emergency:</strong> <a href="tel:112" className="text-primary-teal underline">112</a></p>
                                    <p><strong>Poison Control:</strong> <a href="tel:1066" className="text-primary-teal underline">1066</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="mt-8 text-center text-sm text-text-secondary max-w-2xl mx-auto">
                    <p className="italic">
                        ⚠️ <strong>Disclaimer:</strong> This guide is for informational purposes only. Always seek professional medical help in emergencies. Call 108 or visit the nearest hospital.
                    </p>
                </div>
            </div>
        </div>
    );
}
