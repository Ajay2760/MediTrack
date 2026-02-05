import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DisasterAlert from '@/models/DisasterAlert';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const district = searchParams.get('district');
        const active = searchParams.get('active');

        const query: Record<string, unknown> = {};

        if (active === 'true') {
            query.isActive = true;
            query.expiresAt = { $gt: new Date() };
        }

        if (district) {
            query.affectedDistricts = new RegExp(district, 'i');
        }

        const alerts = await DisasterAlert.find(query)
            .sort({ severity: -1, createdAt: -1 })
            .limit(50);

        return NextResponse.json(
            {
                alerts,
                count: alerts.length
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Get alerts error:', err);
        return NextResponse.json(
            { error: 'Failed to fetch alerts', details: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            type,
            severity,
            title,
            titleTamil,
            message,
            messageTamil,
            affectedAreas,
            affectedDistricts,
            expiresAt
        } = body;

        if (!type || !severity || !title || !message || !expiresAt) {
            return NextResponse.json(
                { error: 'Type, severity, title, message, and expiresAt are required' },
                { status: 400 }
            );
        }

        const alert = await DisasterAlert.create({
            type,
            severity,
            title,
            titleTamil: titleTamil || title,
            message,
            messageTamil: messageTamil || message,
            affectedAreas: affectedAreas || [],
            affectedDistricts: affectedDistricts || [],
            isActive: true,
            expiresAt: new Date(expiresAt)
        });

        return NextResponse.json(
            {
                message: 'Disaster alert created successfully',
                alert
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Create alert error:', err);
        return NextResponse.json(
            { error: 'Failed to create alert', details: err.message },
            { status: 500 }
        );
    }
}
