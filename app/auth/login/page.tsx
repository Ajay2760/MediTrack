'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginMethod === 'email' ? formData.email : undefined,
                    phone: loginMethod === 'phone' ? formData.phone : undefined,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                router.push('/dashboard/admin');
            } else if (data.user.role === 'driver') {
                router.push('/dashboard/driver');
            } else {
                router.push('/dashboard/user');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-blue mb-2">🚑 MediTrack</h1>
                    <p className="text-neutral-600">Login to access your dashboard</p>
                </div>

                <div className="card card-glass p-8">
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-2 px-4 rounded-md font-semibold transition ${loginMethod === 'email'
                                ? 'bg-primary-blue text-white'
                                : 'bg-neutral-200 text-neutral-700'
                                }`}
                        >
                            Email
                        </button>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-2 px-4 rounded-md font-semibold transition ${loginMethod === 'phone'
                                ? 'bg-primary-blue text-white'
                                : 'bg-neutral-200 text-neutral-700'
                                }`}
                        >
                            Phone
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-emergency-red/10 text-emergency-red p-3 rounded-md mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        {loginMethod === 'email' ? (
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                        ) : (
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    placeholder="+91 1234567890"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-primary w-full ${loading ? 'btn-loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-neutral-600">
                            Don't have an account?{' '}
                            <Link href="/auth/signup" className="text-primary-blue font-semibold hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>

                    <div className="text-center mt-4">
                        <Link href="/" className="text-neutral-500 text-sm hover:underline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
