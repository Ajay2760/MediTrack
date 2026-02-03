import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken, generateOTP } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, phone, password, role, bloodGroup, allergies } = body;

        // Validate required fields
        if (!name || !password || (!email && !phone)) {
            return NextResponse.json(
                { error: 'Name, password, and either email or phone are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email || '' },
                { phone: phone || '' },
            ],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or phone already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const user = await User.create({
            name,
            email: email || undefined,
            phone: phone || undefined,
            password: hashedPassword,
            role: role || 'user',
            bloodGroup: bloodGroup || '',
            allergies: allergies || [],
        });

        // Generate OTP (mock for demo)
        const otp = generateOTP();
        console.log(`📱 OTP for ${email || phone}: ${otp}`);

        // In production, send OTP via SMS/Email
        // For demo, we'll skip verification and directly create token

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email || '',
            role: user.role,
        });

        return NextResponse.json({
            message: 'User created successfully',
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
            otp, // Only for demo purposes
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create user', details: error.message },
            { status: 500 }
        );
    }
}
