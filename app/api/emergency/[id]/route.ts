import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmergencyRequest from '@/models/EmergencyRequest';
import Ambulance from '@/models/Ambulance';

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        await connectDB();

        const request = await EmergencyRequest.findById(params.id)
            .populate('patient', 'name phone bloodGroup allergies')
            .populate({
                path: 'ambulance',
                populate: { path: 'driver', select: 'name phone' },
            });

        if (!request) {
            return NextResponse.json(
                { error: 'Emergency request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ request }, { status: 200 });

    } catch (error: any) {
        console.error('Get emergency request error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch emergency request', details: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        await connectDB();

        const body = await req.json();
        const { status, destination, hospital, handoverNotes } = body;

        const updateData: Record<string, unknown> = {};
        if (status) {
            updateData.status = status;

            // Track timestamps for analytics
            if (status === 'accepted') updateData.acceptedAt = new Date();
            if (status === 'arrived') updateData.arrivedAt = new Date();
            if (status === 'completed') updateData.completedAt = new Date();
        }
        if (destination) updateData.destination = destination;
        if (hospital) updateData.hospital = hospital;
        if (handoverNotes !== undefined) updateData.handoverNotes = handoverNotes;

        const request = await EmergencyRequest.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('patient', 'name phone bloodGroup allergies')
            .populate({
                path: 'ambulance',
                populate: { path: 'driver', select: 'name phone' },
            });

        if (!request) {
            return NextResponse.json(
                { error: 'Emergency request not found' },
                { status: 404 }
            );
        }

        // Update ambulance status based on request status
        const ambulanceId = request.ambulance && (typeof request.ambulance === 'object' && request.ambulance !== null && '_id' in request.ambulance
            ? (request.ambulance as { _id: unknown })._id
            : request.ambulance);
        if (ambulanceId && status) {
            let ambulanceStatus = 'on_route';
            if (status === 'completed' || status === 'cancelled') {
                ambulanceStatus = 'available';
            } else if (status === 'picked') {
                ambulanceStatus = 'busy';
            }
            await Ambulance.findByIdAndUpdate(ambulanceId, { status: ambulanceStatus });
        }

        return NextResponse.json({
            message: 'Emergency request updated successfully',
            request,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Update emergency request error:', error);
        return NextResponse.json(
            { error: 'Failed to update emergency request', details: error.message },
            { status: 500 }
        );
    }
}
