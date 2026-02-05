'use client';

import { useEffect, useState } from 'react';

interface Alert {
    type: string;
    severity: string;
    title: string;
    message: string;
    affectedAreas: string[];
}

export default function DisasterAlertBanner() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // In production, this would fetch from API
        // For now, showing a sample alert
        const sampleAlert: Alert = {
            type: 'cyclone',
            severity: 'high',
            title: 'Cyclone Warning',
            message: 'Heavy rainfall expected. Stay indoors and avoid travel.',
            affectedAreas: ['Chennai', 'Kanchipuram']
        };

        // Uncomment to show sample alert
        // setAlerts([sampleAlert]);
    }, []);

    if (alerts.length === 0 || dismissed) return null;

    const alert = alerts[0];
    const severityColors = {
        low: 'bg-warning-amber',
        medium: 'bg-warning-amber',
        high: 'bg-emergency-red',
        critical: 'bg-emergency-red'
    };

    const icons = {
        flood: '🌊',
        cyclone: '🌀',
        earthquake: '⚠️',
        landslide: '⛰️',
        fire: '🔥',
        other: '⚠️'
    };

    return (
        <div className={`${severityColors[alert.severity as keyof typeof severityColors]} text-white py-3`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{icons[alert.type as keyof typeof icons]}</span>
                    <div>
                        <p className="font-bold">{alert.title}</p>
                        <p className="text-sm opacity-90">{alert.message}</p>
                    </div>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="ml-4 text-white/80 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
