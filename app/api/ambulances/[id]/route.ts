import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Ambulance from '@/models/Ambulance';

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        await connectDB();

        const ambulance = await Ambulance.findById(params.id).populate('driver', 'name phone email');

        if (!ambulance) {
            return NextResponse.json(
                { error: 'Ambulance not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ ambulance }, { status: 200 });

    } catch (error: any) {
        console.error('Get ambulance error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ambulance', details: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: Params) {
    try {
        await connectDB();

        const body = await req.json();
        const { location, status } = body;

        const updateData: any = {};
        if (location) updateData.location = location;
        if (status) updateData.status = status;

        const ambulance = await Ambulance.findByIdAndUpdate(
            params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('driver', 'name phone');

        if (!ambulance) {
            return NextResponse.json(
                { error: 'Ambulance not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Ambulance updated successfully',
            ambulance,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Update ambulance error:', error);
        return NextResponse.json(
            { error: 'Failed to update ambulance', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        await connectDB();

        const ambulance = await Ambulance.findByIdAndDelete(params.id);

        if (!ambulance) {
            return NextResponse.json(
                { error: 'Ambulance not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Ambulance deleted successfully',
        }, { status: 200 });

    } catch (error: any) {
        console.error('Delete ambulance error:', error);
        return NextResponse.json(
            { error: 'Failed to delete ambulance', details: error.message },
            { status: 500 }
        );
    }
}
