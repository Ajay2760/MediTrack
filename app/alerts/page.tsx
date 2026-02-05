'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DisasterAlert {
    _id: string;
    type: 'flood' | 'cyclone' | 'earthquake' | 'landslide' | 'fire' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    titleTamil: string;
    message: string;
    messageTamil: string;
    affectedAreas: string[];
    affectedDistricts: string[];
    isActive: boolean;
    expiresAt: string;
    createdAt: string;
}

const DISTRICTS = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
    'Erode', 'Vellore', 'Thoothukudi', 'Tiruppur', 'Thanjavur', 'Dindigul',
    'Kanchipuram', 'Cuddalore', 'Karur', 'Ramanathapuram', 'Tiruvannamalai',
    'Virudhunagar', 'Pudukkottai', 'Nagapattinam', 'Krishnagiri', 'Theni',
    'Namakkal', 'Sivaganga', 'Dharmapuri', 'Villupuram', 'Perambalur',
    'Ariyalur', 'Nilgiris', 'Kanniyakumari', 'Kallakurichi', 'Ranipet',
    'Tirupathur', 'Tenkasi', 'Chengalpattu', 'Mayiladuthurai'
];

const ALERT_TYPES = ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'other'];

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSubscription, setShowSubscription] = useState(false);
    const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
    const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>(ALERT_TYPES);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        fetchAlerts();
        fetchSubscription();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await fetch('/api/alerts?active=true');
            const data = await response.json();
            setAlerts(data.alerts || []);
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscription = async () => {
        // Mock userId - in real app, get from session
        const userId = '000000000000000000000001';
        try {
            const response = await fetch(`/api/alerts/subscribe?userId=${userId}`);
            const data = await response.json();
            if (data.subscription) {
                setSelectedDistricts(data.subscription.subscribedDistricts || []);
                setSelectedAlertTypes(data.subscription.alertTypes || ALERT_TYPES);
                setSubscribed(data.subscription.isActive);
            }
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
        }
    };

    const handleSubscribe = async () => {
        const userId = '000000000000000000000001';
        try {
            const response = await fetch('/api/alerts/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    subscribedDistricts: selectedDistricts,
                    alertTypes: selectedAlertTypes,
                    notificationMethods: ['app']
                })
            });
            const data = await response.json();
            if (response.ok) {
                setSubscribed(true);
                alert('Subscription updated successfully!');
            }
        } catch (error) {
            console.error('Failed to subscribe:', error);
            alert('Failed to update subscription');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-50 border-red-500 text-red-900';
            case 'high': return 'bg-orange-50 border-orange-500 text-orange-900';
            case 'medium': return 'bg-yellow-50 border-yellow-500 text-yellow-900';
            case 'low': return 'bg-blue-50 border-blue-500 text-blue-900';
            default: return 'bg-gray-50 border-gray-500 text-gray-900';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'flood': return '🌊';
            case 'cyclone': return '🌀';
            case 'earthquake': return '🏚️';
            case 'landslide': return '⛰️';
            case 'fire': return '🔥';
            default: return '⚠️';
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">🚨 Disaster Alerts</h1>
                    <button
                        onClick={() => setShowSubscription(!showSubscription)}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                    >
                        {showSubscription ? 'Hide' : 'Manage Subscription'}
                    </button>
                </div>

                {showSubscription && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-teal-200">
                        <h2 className="text-xl font-semibold mb-4">📬 Alert Subscription Settings</h2>

                        <div className="mb-4">
                            <label className="block font-medium mb-2">Select Districts:</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                                {DISTRICTS.map((district) => (
                                    <label key={district} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedDistricts.includes(district)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDistricts([...selectedDistricts, district]);
                                                } else {
                                                    setSelectedDistricts(selectedDistricts.filter(d => d !== district));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm">{district}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium mb-2">Alert Types:</label>
                            <div className="flex flex-wrap gap-3">
                                {ALERT_TYPES.map((type) => (
                                    <label key={type} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedAlertTypes.includes(type)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedAlertTypes([...selectedAlertTypes, type]);
                                                } else {
                                                    setSelectedAlertTypes(selectedAlertTypes.filter(t => t !== type));
                                                }
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm capitalize">{getTypeIcon(type)} {type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSubscribe}
                            className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                        >
                            💾 Save Subscription
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading alerts...</p>
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-semibold text-green-800 mb-2">No Active Alerts</h2>
                        <p className="text-green-700">There are currently no disaster alerts in your area.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Active Alerts ({alerts.length})</h2>
                        {alerts.map((alert) => (
                            <div
                                key={alert._id}
                                className={`rounded-xl border-l-4 p-6 shadow-md ${getSeverityColor(alert.severity)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <span className="text-4xl">{getTypeIcon(alert.type)}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold uppercase">
                                                    {alert.severity}
                                                </span>
                                                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold capitalize">
                                                    {alert.type}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-1">{alert.title}</h3>
                                            <p className="text-sm opacity-90 mb-3">{alert.message}</p>

                                            {alert.affectedDistricts.length > 0 && (
                                                <div className="mb-2">
                                                    <span className="font-medium text-sm">Affected Districts: </span>
                                                    <span className="text-sm">{alert.affectedDistricts.join(', ')}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center space-x-4 text-xs opacity-75">
                                                <span>📅 {new Date(alert.createdAt).toLocaleString()}</span>
                                                <span>⏱️ Expires: {new Date(alert.expiresAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
