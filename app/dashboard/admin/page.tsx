'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { formatDistance } from '@/lib/geolocation';
import { format } from 'date-fns';

const LiveMap = dynamic(() => import('@/components/Map/LiveMap'), { ssr: false });

interface Ambulance {
    _id: string;
    registrationNumber: string;
    location: { lat: number; lng: number };
    status: string;
    driver: { name: string; phone: string };
    phoneNumber: string;
}

interface EmergencyRequest {
    _id: string;
    patient?: { name: string; phone: string };
    guestName?: string;
    guestPhone?: string;
    ambulance?: { registrationNumber: string };
    status: string;
    createdAt: string;
    acceptedAt?: string;
    completedAt?: string;
}

interface Hospital {
    _id: string;
    name: string;
    district: string;
    address: string;
    phone: string;
    emergencyServices: boolean;
    bedAvailability: number;
    totalBeds?: number;
    distance?: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
    const [requests, setRequests] = useState<EmergencyRequest[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [stats, setStats] = useState({
        totalAmbulances: 0,
        availableAmbulances: 0,
        activeTrips: 0,
        totalRequests: 0,
    });

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/auth/login');
            return;
        }

        const parsedUser = JSON.parse(userData);

        if (parsedUser.role !== 'admin') {
            router.push('/dashboard/user');
            return;
        }

        setUser(parsedUser);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all ambulances
            const ambulancesRes = await fetch('/api/ambulances?lat=13.0827&lng=80.2707&radius=500');
            const ambulancesData = await ambulancesRes.json();
            setAmbulances(ambulancesData.ambulances || []);

            // Fetch all requests
            const requestsRes = await fetch('/api/emergency');
            const requestsData = await requestsRes.json();
            setRequests(requestsData.requests || []);

            // Fetch hospitals (Tamil Nadu - Chennai area)
            const hospitalsRes = await fetch('/api/hospitals?lat=13.0827&lng=80.2707&radius=100');
            const hospitalsData = await hospitalsRes.json();
            setHospitals(hospitalsData.hospitals || []);

            // Calculate stats
            const available = ambulancesData.ambulances?.filter((a: Ambulance) => a.status === 'available').length || 0;
            const active = requestsData.requests?.filter((r: EmergencyRequest) =>
                ['pending', 'accepted', 'on_way', 'arrived', 'picked'].includes(r.status)
            ).length || 0;

            setStats({
                totalAmbulances: ambulancesData.ambulances?.length || 0,
                availableAmbulances: available,
                activeTrips: active,
                totalRequests: requestsData.requests?.length || 0,
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const calculateAverageResponseTime = () => {
        const completedRequests = requests.filter(r => r.acceptedAt && r.createdAt);
        if (completedRequests.length === 0) return 'N/A';

        const totalTime = completedRequests.reduce((sum, req) => {
            const created = new Date(req.createdAt).getTime();
            const accepted = new Date(req.acceptedAt!).getTime();
            return sum + (accepted - created);
        }, 0);

        const avgMilliseconds = totalTime / completedRequests.length;
        const avgMinutes = Math.round(avgMilliseconds / 1000 / 60);
        return `${avgMinutes} min`;
    };

    if (!user) return null;

    const activeAmbulances = ambulances.filter(a => a.status !== 'offline');
    const TN_CENTER = { lat: 13.0827, lng: 80.2707 };
    const centerLat = activeAmbulances.length > 0
        ? activeAmbulances.reduce((sum, a) => sum + a.location.lat, 0) / activeAmbulances.length
        : TN_CENTER.lat;
    const centerLng = activeAmbulances.length > 0
        ? activeAmbulances.reduce((sum, a) => sum + a.location.lng, 0) / activeAmbulances.length
        : TN_CENTER.lng;

    return (
        <div className="min-h-screen bg-neutral-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-primary-blue">🚑 Admin Dashboard</h1>
                        <p className="text-sm text-neutral-600">MediTrack Control Center</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-neutral-700">Welcome, <strong>{user.name}</strong></span>
                        <button
                            onClick={() => {
                                localStorage.clear();
                                router.push('/');
                            }}
                            className="btn btn-outline"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <p className="text-sm opacity-90">Total Ambulances</p>
                        <p className="text-4xl font-bold">{stats.totalAmbulances}</p>
                    </div>
                    <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <p className="text-sm opacity-90">Available Now</p>
                        <p className="text-4xl font-bold">{stats.availableAmbulances}</p>
                    </div>
                    <div className="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <p className="text-sm opacity-90">Active Trips</p>
                        <p className="text-4xl font-bold">{stats.activeTrips}</p>
                    </div>
                    <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <p className="text-sm opacity-90">Avg Response Time</p>
                        <p className="text-4xl font-bold">{calculateAverageResponseTime()}</p>
                    </div>
                </div>

                {/* Live Map */}
                <div className="card p-0 overflow-hidden mb-8">
                    <div className="p-4 bg-white border-b">
                        <h2 className="text-xl font-bold">📍 Live Ambulance Tracking</h2>
                    </div>
                    <div className="map-container" style={{ height: '400px' }}>
                        <LiveMap
                            center={[centerLat, centerLng]}
                            ambulances={activeAmbulances}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ambulances Table */}
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">🚑 Ambulances</h2>
                            <button className="btn btn-primary btn-sm" onClick={() => alert('Add ambulance feature coming soon!')}>
                                + Add Ambulance
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Registration</th>
                                        <th className="text-left py-2">Driver</th>
                                        <th className="text-left py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ambulances.slice(0, 10).map(ambulance => (
                                        <tr key={ambulance._id} className="border-b">
                                            <td className="py-3 font-semibold">{ambulance.registrationNumber}</td>
                                            <td className="py-3 text-neutral-600">{ambulance.driver?.name || 'N/A'}</td>
                                            <td className="py-3">
                                                <span className={`status-pill status-${ambulance.status}`}>
                                                    <span className="status-indicator"></span>
                                                    {ambulance.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Requests */}
                    <div className="card p-6">
                        <h2 className="text-xl font-bold mb-4">📋 Recent Emergency Requests</h2>
                        <div className="space-y-4">
                            {requests.slice(0, 10).map(request => (
                                <div key={request._id} className="border-b pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold">{request.patient?.name || request.guestName || 'Guest'}</p>
                                            <p className="text-sm text-neutral-600">{request.patient?.phone || request.guestPhone || '—'}</p>
                                        </div>
                                        <span className={`badge badge-${request.status === 'completed' ? 'success' :
                                                request.status === 'cancelled' ? 'danger' :
                                                    'warning'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    {request.ambulance && (
                                        <p className="text-sm text-neutral-600">
                                            🚑 {request.ambulance.registrationNumber}
                                        </p>
                                    )}
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hospitals Directory */}
                <div className="card p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4">🏥 Nearby Hospitals (Tamil Nadu)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">District</th>
                                    <th className="text-left py-2">Phone</th>
                                    <th className="text-left py-2">Emergency</th>
                                    <th className="text-left py-2">Beds</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hospitals.slice(0, 15).map((h) => (
                                    <tr key={h._id} className="border-b">
                                        <td className="py-3 font-semibold">{h.name}</td>
                                        <td className="py-3 text-neutral-600">{h.district}</td>
                                        <td className="py-3">{h.phone}</td>
                                        <td className="py-3">{h.emergencyServices ? 'Yes' : 'No'}</td>
                                        <td className="py-3">{h.bedAvailability} {h.totalBeds ? `/ ${h.totalBeds}` : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {hospitals.length === 0 && <p className="text-neutral-500 py-4">Run seed to load Tamil Nadu hospitals.</p>}
                </div>

                {/* Analytics Section */}
                <div className="card p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4">📊 Analytics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-neutral-600">Today&apos;s Requests</p>
                            <p className="text-3xl font-bold text-primary-blue">
                                {requests.filter(r => {
                                    const today = new Date().setHours(0, 0, 0, 0);
                                    const reqDate = new Date(r.createdAt).setHours(0, 0, 0, 0);
                                    return reqDate === today;
                                }).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-neutral-600">Completed Trips</p>
                            <p className="text-3xl font-bold text-success-green">
                                {requests.filter(r => r.status === 'completed').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-neutral-600">Success Rate</p>
                            <p className="text-3xl font-bold text-success-green">
                                {stats.totalRequests > 0
                                    ? `${Math.round((requests.filter(r => r.status === 'completed').length / stats.totalRequests) * 100)}%`
                                    : '0%'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }
        
        .overflow-x-auto {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        .from-blue-500 { --from-color: #3b82f6; }
        .to-blue-600 { --to-color: #2563eb; }
        .from-green-500 { --from-color: #22c55e; }
        .to-green-600 { --to-color: #16a34a; }
        .from-orange-500 { --from-color: #f97316; }
        .to-orange-600 { --to-color: #ea580c; }
        .from-purple-500 { --from-color: #a855f7; }
        .to-purple-600 { --to-color: #9333ea; }
      `}</style>
        </div>
    );
}
