import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { email, phone, password } = body;

        // Validate required fields
        if ((!email && !phone) || !password) {
            return NextResponse.json(
                { error: 'Email/phone and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({
            $or: [
                { email: email || '' },
                { phone: phone || '' },
            ],
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email || '',
            role: user.role,
        });

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                bloodGroup: user.bloodGroup,
                allergies: user.allergies,
            },
            token,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Failed to login', details: error.message },
            { status: 500 }
        );
    }
}
