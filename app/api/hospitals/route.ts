import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Hospital from '@/models/Hospital';
import { calculateDistance } from '@/lib/geolocation';

// Type for plain hospital object (without Mongoose Document methods)
type PlainHospital = {
    _id: any;
    name: string;
    nameTamil?: string;
    location: { lat: number; lng: number };
    address: string;
    district: string;
    phone: string;
    emergencyPhone?: string;
    email?: string;
    emergencyServices: boolean;
    bedAvailability: number;
    totalBeds?: number;
    specialties: string[];
    isGovernment: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

type HospitalWithDistance = PlainHospital & { distance: number };

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        const radius = parseFloat(searchParams.get('radius') || '50'); // km
        const district = searchParams.get('district');
        const emergencyOnly = searchParams.get('emergencyOnly') === 'true';

        const query: Record<string, unknown> = {};
        if (emergencyOnly) query.emergencyServices = true;
        if (district) query.district = new RegExp(district, 'i');

        const hospitalDocs = await Hospital.find(query);

        // Work with plain objects to avoid Mongoose Document type issues
        let hospitals: PlainHospital[] | HospitalWithDistance[] = hospitalDocs.map((h) => h.toObject() as PlainHospital);

        if (lat && lng) {
            hospitals = hospitals
                .map((h) => ({
                    ...h,
                    distance: calculateDistance(lat, lng, h.location.lat, h.location.lng),
                }))
                .filter((h) => h.distance <= radius)
                .sort((a, b) => a.distance - b.distance);
        }

        return NextResponse.json(
            {
                hospitals,
                count: hospitals.length,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Get hospitals error:', err);
        return NextResponse.json(
            { error: 'Failed to fetch hospitals', details: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            name, nameTamil, location, address, district, phone, emergencyPhone, email,
            emergencyServices, bedAvailability, totalBeds, specialties, isGovernment,
        } = body;

        if (!name || !location || !address || !district || !phone) {
            return NextResponse.json(
                { error: 'Name, location, address, district, and phone are required' },
                { status: 400 }
            );
        }

        const hospital = await Hospital.create({
            name,
            nameTamil: nameTamil || undefined,
            location: { lat: location.lat, lng: location.lng },
            address,
            district,
            phone,
            emergencyPhone: emergencyPhone || undefined,
            email: email || undefined,
            emergencyServices: emergencyServices !== false,
            bedAvailability: bedAvailability ?? 0,
            totalBeds: totalBeds ?? undefined,
            specialties: Array.isArray(specialties) ? specialties : ['Emergency'],
            isGovernment: isGovernment === true,
        });

        return NextResponse.json({
            message: 'Hospital created successfully',
            hospital,
        }, { status: 201 });
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Create hospital error:', err);
        return NextResponse.json(
            { error: 'Failed to create hospital', details: err.message },
            { status: 500 }
        );
    }
}
