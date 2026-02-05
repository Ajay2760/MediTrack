import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AlertSubscription from '@/models/AlertSubscription';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        // In a real app, get userId from authenticated session
        // For now, using query parameter
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const subscription = await AlertSubscription.findOne({ user: userId });

        if (!subscription) {
            return NextResponse.json(
                {
                    subscription: null,
                    message: 'No subscription found'
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { subscription },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Get subscription error:', err);
        return NextResponse.json(
            { error: 'Failed to fetch subscription', details: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            userId,
            subscribedDistricts,
            alertTypes,
            notificationMethods
        } = body;

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Upsert: Update if exists, create if not
        const subscription = await AlertSubscription.findOneAndUpdate(
            { user: userId },
            {
                subscribedDistricts: subscribedDistricts || [],
                alertTypes: alertTypes || ['flood', 'cyclone', 'earthquake', 'landslide', 'fire'],
                notificationMethods: notificationMethods || ['app'],
                isActive: true
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(
            {
                message: 'Subscription updated successfully',
                subscription
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Update subscription error:', err);
        return NextResponse.json(
            { error: 'Failed to update subscription', details: err.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await AlertSubscription.findOneAndUpdate(
            { user: userId },
            { isActive: false }
        );

        return NextResponse.json(
            { message: 'Unsubscribed successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Unsubscribe error:', err);
        return NextResponse.json(
            { error: 'Failed to unsubscribe', details: err.message },
            { status: 500 }
        );
    }
}
