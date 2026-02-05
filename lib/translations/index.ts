// Central translations for MediTrack
// Supports English (en) and Tamil (ta)

export interface Translations {
    [key: string]: {
        en: string;
        ta: string;
    };
}

export const translations: Translations = {
    // Common
    'common.appName': { en: 'MediTrack', ta: 'மெடிட்ராக்' },
    'common.loading': { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
    'common.error': { en: 'Error', ta: 'பிழை' },
    'common.success': { en: 'Success', ta: 'வெற்றி' },
    'common.cancel': { en: 'Cancel', ta: 'ரத்து செய்' },
    'common.save': { en: 'Save', ta: 'சேமி' },
    'common.back': { en: 'Back', ta: 'திரும்பு' },

    // Emergency / SOS
    'sos.title': { en: 'Emergency SOS', ta: 'அவசர SOS' },
    'sos.requestAmbulance': { en: 'Request Ambulance', ta: 'ஆம்புலன்ஸ் கோரிக்கை' },
    'sos.voiceCommand': { en: 'Say "Emergency" or "Help"', ta: '"அவசரம்" அல்லது "உதவி" என்று சொல்லுங்கள்' },
    'sos.requestSent': { en: 'Emergency request sent successfully', ta: 'அவசர கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது' },
    'sos.offlineMode': { en: 'Offline Mode - SMS will be sent', ta: 'ஆஃப்லைன் பயன்முறை - எஸ்எம்எஸ் அனுப்பப்படும்' },
    'sos.description': { en: 'Describe your emergency (optional)', ta: 'உங்கள் அவசரத்தை விவரிக்கவும் (விருப்பம்)' },
    'sos.location': { en: 'Your Location', ta: 'உங்கள் இடம்' },
    'sos.detectingLocation': { en: 'Detecting your location...', ta: 'உங்கள் இடத்தைக் கண்டறிகிறது...' },

    // Alerts
    'alerts.title': { en: 'Disaster Alerts', ta: 'பேரிடர் எச்சரிக்கைகள்' },
    'alerts.activeAlerts': { en: 'Active Alerts', ta: 'செயலில் உள்ள எச்சரிக்கைகள்' },
    'alerts.noAlerts': { en: 'No Active Alerts', ta: 'செயலில் உள்ள எச்சரிக்கைகள் இல்லை' },
    'alerts.subscribe': { en: 'Manage Subscription', ta: 'சந்தாவை நிர்வகிக்கவும்' },
    'alerts.selectDistricts': { en: 'Select Districts', ta: 'மாவட்டங்களைத் தேர்ந்தெடுக்கவும்' },
    'alerts.alertTypes': { en: 'Alert Types', ta: 'எச்சரிக்கை வகைகள்' },
    'alerts.saveSubscription': { en: 'Save Subscription', ta: 'சந்தாவைச் சேமிக்கவும்' },

    // Alert Types
    'alert.flood': { en: 'Flood', ta: 'வெள்ளம்' },
    'alert.cyclone': { en: 'Cyclone', ta: 'சூறாவளி' },
    'alert.earthquake': { en: 'Earthquake', ta: 'நிலநடுக்கம்' },
    'alert.landslide': { en: 'Landslide', ta: 'நிலச்சரிவு' },
    'alert.fire': { en: 'Fire', ta: 'தீ' },
    'alert.other': { en: 'Other', ta: 'மற்றவை' },

    // Severity
    'severity.critical': { en: 'Critical', ta: 'முக்கியமான' },
    'severity.high': { en: 'High', ta: 'அதிக' },
    'severity.medium': { en: 'Medium', ta: 'நடுத்தர' },
    'severity.low': { en: 'Low', ta: 'குறைந்த' },

    // Hospitals
    'hospitals.title': { en: 'Nearby Hospitals', ta: 'அருகிலுள்ள மருத்துவமனைகள்' },
    'hospitals.searchByCondition': { en: 'Search by Condition', ta: 'நிலையின்படி தேடுக' },
    'hospitals.callHospital': { en: 'Call Hospital', ta: 'மருத்துவமனையை அழைக்கவும்' },
    'hospitals.getDirections': { en: 'Get Directions', ta: 'திசைகளைப் பெறுக' },
    'hospitals.notifyHospital': { en: 'Notify Hospital', ta: 'மருத்துவமனைக்கு அறிவிக்கவும்' },
    'hospitals.traumaCenter': { en: 'Trauma Center', ta: 'அதிர்ச்சி மையம்' },
    'hospitals.bedsAvailable': { en: 'Beds Available', ta: 'படுக்கைகள் கிடைக்கின்றன' },

    // Blood Donors
    'bloodDonor.title': { en: 'Blood Donors', ta: 'இரத்த தானம்' },
    'bloodDonor.searchByBloodGroup': { en: 'Search by Blood Group', ta: 'இரத்த வகையின்படி தேடுக' },
    'bloodDonor.nearbyDonors': { en: 'Nearby Donors', ta: 'அருகிலுள்ள தானம் செய்பவர்கள்' },
    'bloodDonor.callDonor': { en: 'Call Donor', ta: 'தானம் செய்பவரை அழைக்கவும்' },

    // First Aid
    'firstAid.title': { en: 'First Aid Guide', ta: 'முதலுதவி வழிகாட்டி' },
    'firstAid.cpr': { en: 'CPR', ta: 'சிபிஆர்' },
    'firstAid.choking': { en: 'Choking', ta: 'மூச்சுத்திணறல்' },
    'firstAid.bleeding': { en: 'Bleeding', ta: 'இரத்தப்போக்கு' },
    'firstAid.burns': { en: 'Burns', ta: 'தீக்காயங்கள்' },
    'firstAid.fractures': { en: 'Fractures', ta: 'எலும்பு முறிவுகள்' },
    'firstAid.snakeBite': { en: 'Snake Bite', ta: 'பாம்பு கடி' },

    // Helplines
    'helplines.title': { en: 'Emergency Helplines', ta: 'அவசர உதவி எண்கள்' },
    'helplines.ambulance': { en: 'Ambulance', ta: 'ஆம்புலன்ஸ்' },
    'helplines.police': { en: 'Police', ta: 'காவல்துறை' },
    'helplines.fire': { en: 'Fire Service', ta: 'தீயணைப்பு சேவை' },
    'helplines.women': { en: "Women's Helpline", ta: 'பெண்கள் உதவி எண்' },
    'helplines.child': { en: 'Child Helpline', ta: 'குழந்தை உதவி எண்' },
};

export type Language = 'en' | 'ta';

export function translate(key: string, language: Language): string {
    return translations[key]?.[language] || key;
}

export function getTranslations(language: Language): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key in translations) {
        result[key] = translations[key][language];
    }
    return result;
}
