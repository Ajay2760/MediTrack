import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BloodDonorModel from '@/models/BloodDonor';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const bloodGroup = searchParams.get('bloodGroup');
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');
        const maxDistance = parseInt(searchParams.get('maxDistance') || '50000'); // 50km default
        const district = searchParams.get('district');

        const query: any = { availableForDonation: true };

        // Filter by blood group
        if (bloodGroup) {
            query.bloodGroup = bloodGroup;
        }

        // Filter by district
        if (district) {
            query.district = district;
        }

        let donors;

        // Location-based search
        if (lat && lng) {
            donors = await BloodDonorModel.find({
                ...query,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)]
                        },
                        $maxDistance: maxDistance
                    }
                }
            })
                .populate('user', 'name')
                .limit(50)
                .lean();
        } else {
            // Regular search without location
            donors = await BloodDonorModel.find(query)
                .populate('user', 'name')
                .limit(50)
                .lean();
        }

        return NextResponse.json({ donors, count: donors.length }, { status: 200 });
    } catch (error: any) {
        console.error('Get blood donors error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blood donors', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { userId, bloodGroup, lat, lng, address, district, phone } = body;

        // Validate required fields
        if (!userId || !bloodGroup || !lat || !lng || !address || !district || !phone) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if donor already exists
        const existingDonor = await BloodDonorModel.findOne({ user: userId });
        if (existingDonor) {
            return NextResponse.json(
                { error: 'You are already registered as a blood donor' },
                { status: 400 }
            );
        }

        // Create new donor
        const donor = await BloodDonorModel.create({
            user: userId,
            bloodGroup,
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            address,
            district,
            phone,
            availableForDonation: true,
            verified: false
        });

        return NextResponse.json(
            { message: 'Successfully registered as blood donor', donor },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Register blood donor error:', error);
        return NextResponse.json(
            { error: 'Failed to register blood donor', details: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { userId, availableForDonation, lastDonated } = body;

        const updateData: any = {};
        if (typeof availableForDonation !== 'undefined') {
            updateData.availableForDonation = availableForDonation;
        }
        if (lastDonated) {
            updateData.lastDonated = new Date(lastDonated);
        }

        const donor = await BloodDonorModel.findOneAndUpdate(
            { user: userId },
            updateData,
            { new: true }
        );

        if (!donor) {
            return NextResponse.json(
                { error: 'Blood donor not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Successfully updated donor status', donor },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update blood donor error:', error);
        return NextResponse.json(
            { error: 'Failed to update donor status', details: error.message },
            { status: 500 }
        );
    }
}
