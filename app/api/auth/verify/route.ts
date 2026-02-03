import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        // Verify token
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Get user details
        const user = await User.findById(payload.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Token verified successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                bloodGroup: user.bloodGroup,
                allergies: user.allergies,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify token', details: error.message },
            { status: 500 }
        );
    }
}
