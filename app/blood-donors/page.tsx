'use client';

import { useState } from 'react';
import Link from 'next/link';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodDonorsPage() {
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!selectedBloodGroup) {
            alert('Please select a blood group');
            return;
        }

        setSearching(true);
        // Search logic will be implemented when user is logged in
        setTimeout(() => {
            alert(`Searching for ${selectedBloodGroup} blood donors near you...`);
            setSearching(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-neutral-50 dark:via-neutral-100 dark:to-neutral-50">
            <div className="bg-emergency-red dark:bg-emergency-red-dark text-white py-8">
                <div className="container mx-auto px-4">
                    <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">🩸 Blood Donor Network</h1>
                    <p className="text-red-100">Find nearby blood donors or register as a donor to save lives</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="card card-glass p-8 text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <h2 className="text-2xl font-bold text-primary-teal mb-4">Find Donors</h2>
                            <p className="text-text-secondary mb-6">Search for blood donors by blood group and location</p>

                            <div className="space-y-4">
                                <select
                                    value={selectedBloodGroup}
                                    onChange={(e) => setSelectedBloodGroup(e.target.value)}
                                    className="form-input text-center text-lg font-bold"
                                >
                                    <option value="">Select Blood Group</option>
                                    {bloodGroups.map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleSearch}
                                    disabled={searching}
                                    className="btn btn-primary w-full"
                                >
                                    {searching ? 'Searching...' : 'Find Donors'}
                                </button>
                            </div>
                        </div>

                        <div className="card card-glass p-8 text-center">
                            <div className="text-5xl mb-4">❤️</div>
                            <h2 className="text-2xl font-bold text-emergency-red mb-4">Become a Donor</h2>
                            <p className="text-text-secondary mb-6">Register as a blood donor and help save lives in your community</p>
                            <Link href="/auth/login" className="btn bg-emergency-red text-white hover:bg-emergency-red-dark w-full">
                                Register as Donor
                            </Link>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="space-y-6">
                        <div className="card card-glass p-6">
                            <h3 className="text-xl font-bold text-primary-teal mb-4">💡 Why Donate Blood?</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li>✓ One donation can save up to 3 lives</li>
                                <li>✓ Reduces risk of heart disease</li>
                                <li>✓ Free health screening</li>
                                <li>✓ Helps patients in emergencies, surgeries, and treatments</li>
                            </ul>
                        </div>

                        <div className="card card-glass p-6">
                            <h3 className="text-xl font-bold text-primary-teal mb-4">📋 Eligibility Criteria</h3>
                            <ul className="space-y-2 text-text-secondary">
                                <li>✓ Age: 18-65 years</li>
                                <li>✓ Weight: Minimum 50kg</li>
                                <li>✓ Healthy and not on medication</li>
                                <li>✓ Can donate every 3 months</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
