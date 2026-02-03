import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Ambulance from '@/models/Ambulance';
import { calculateDistance } from '@/lib/geolocation';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const lat = parseFloat(searchParams.get('lat') || '0');
        const lng = parseFloat(searchParams.get('lng') || '0');
        const radius = parseFloat(searchParams.get('radius') || '10'); // km
        const driverId = searchParams.get('driverId');

        // If driverId provided, return that driver's ambulance(s) only
        if (driverId) {
            const ambulances = await Ambulance.find({ driver: driverId }).populate('driver', 'name phone');
            return NextResponse.json({
                ambulances: ambulances.map((a) => a.toObject()),
                count: ambulances.length,
            }, { status: 200 });
        }

        if (!lat || !lng) {
            return NextResponse.json(
                { error: 'Latitude and longitude are required when querying by location' },
                { status: 400 }
            );
        }

        // Get all available ambulances
        const ambulances = await Ambulance.find({
            status: { $in: ['available', 'on_route'] },
        }).populate('driver', 'name phone');

        // Filter by distance and sort
        const nearbyAmbulances = ambulances
            .map((ambulance) => {
                const distance = calculateDistance(
                    lat,
                    lng,
                    ambulance.location.lat,
                    ambulance.location.lng
                );

                return {
                    ...ambulance.toObject(),
                    distance,
                };
            })
            .filter((ambulance) => ambulance.distance <= radius)
            .sort((a, b) => a.distance - b.distance);

        return NextResponse.json({
            ambulances: nearbyAmbulances,
            count: nearbyAmbulances.length,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Get ambulances error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ambulances', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { registrationNumber, driverId, location, hospital, phoneNumber } = body;

        // Validate required fields
        if (!registrationNumber || !driverId || !location || !phoneNumber) {
            return NextResponse.json(
                { error: 'Registration number, driver, location, and phone are required' },
                { status: 400 }
            );
        }

        // Create ambulance
        const ambulance = await Ambulance.create({
            registrationNumber,
            driver: driverId,
            location,
            hospital: hospital || '',
            phoneNumber,
            status: 'available',
        });

        const populatedAmbulance = await ambulance.populate('driver', 'name phone');

        return NextResponse.json({
            message: 'Ambulance created successfully',
            ambulance: populatedAmbulance,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create ambulance error:', error);
        return NextResponse.json(
            { error: 'Failed to create ambulance', details: error.message },
            { status: 500 }
        );
    }
}
