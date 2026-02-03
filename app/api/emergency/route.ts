import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmergencyRequest from '@/models/EmergencyRequest';
import Ambulance from '@/models/Ambulance';
import { findNearest } from '@/lib/geolocation';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { patientId, guestName, guestPhone, pickupLocation, hospital, notes, priority } = body;

        const isGuest = !patientId;
        if (isGuest) {
            if (!pickupLocation || !guestPhone) {
                return NextResponse.json(
                    { error: 'Pickup location and guest phone are required for guest emergency' },
                    { status: 400 }
                );
            }
        } else if (!pickupLocation) {
            return NextResponse.json(
                { error: 'Patient ID and pickup location are required' },
                { status: 400 }
            );
        }

        // Find nearest available ambulance
        const availableAmbulances = await Ambulance.find({
            status: 'available',
        });

        if (availableAmbulances.length === 0) {
            return NextResponse.json(
                { error: 'No ambulances available at the moment' },
                { status: 404 }
            );
        }

        const nearestAmbulance = findNearest(
            { lat: pickupLocation.lat, lng: pickupLocation.lng },
            availableAmbulances.map((amb) => ({
                ...amb.toObject(),
                location: { lat: amb.location.lat, lng: amb.location.lng },
            }))
        );

        // Create emergency request
        const request = await EmergencyRequest.create({
            ...(patientId ? { patient: patientId } : {}),
            ...(isGuest ? { guestName: guestName || 'Guest', guestPhone } : {}),
            ambulance: nearestAmbulance?._id,
            pickupLocation,
            hospital: hospital || '',
            notes: notes || '',
            priority: priority || 'critical',
            status: 'pending',
        });

        // Update ambulance status
        if (nearestAmbulance) {
            await Ambulance.findByIdAndUpdate(nearestAmbulance._id, {
                status: 'on_route',
            });
        }

        const populatedRequest = await EmergencyRequest.findById(request._id)
            .populate('patient', 'name phone bloodGroup allergies')
            .populate({
                path: 'ambulance',
                populate: { path: 'driver', select: 'name phone' },
            });

        return NextResponse.json({
            message: 'Emergency request created successfully',
            request: populatedRequest,
            ambulance: nearestAmbulance,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create emergency request error:', error);
        return NextResponse.json(
            { error: 'Failed to create emergency request', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const patientId = searchParams.get('patientId');
        const status = searchParams.get('status');
        const activeOnly = searchParams.get('active') === 'true';

        const query: any = {};
        if (patientId) query.patient = patientId;
        if (status) {
            // Support comma-separated statuses (e.g. pending,accepted,on_way)
            const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
            query.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
        }
        if (activeOnly) {
            query.status = { $in: ['pending', 'accepted', 'on_way', 'arrived', 'picked'] };
        }

        const requests = await EmergencyRequest.find(query)
            .populate('patient', 'name phone bloodGroup')
            .populate({
                path: 'ambulance',
                populate: { path: 'driver', select: 'name phone' },
            })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            requests,
            count: requests.length,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Get emergency requests error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch emergency requests', details: error.message },
            { status: 500 }
        );
    }
}
