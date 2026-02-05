import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Hospital from '@/models/Hospital';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const {
            hospitalId,
            patientInfo
        } = body;

        if (!hospitalId || !patientInfo) {
            return NextResponse.json(
                { error: 'Hospital ID and patient info are required' },
                { status: 400 }
            );
        }

        // Fetch hospital details
        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return NextResponse.json(
                { error: 'Hospital not found' },
                { status: 404 }
            );
        }

        // In a real implementation, this would:
        // 1. Send email to hospital emergency desk
        // 2. Send SMS notification
        // 3. Log the notification in database

        const notificationMessage = `
🚨 INCOMING PATIENT NOTIFICATION

Hospital: ${hospital.name}
Patient Condition: ${patientInfo.condition || 'Not specified'}
Blood Group: ${patientInfo.bloodGroup || 'Not specified'}
Allergies: ${patientInfo.allergies || 'None'}
ETA: ${patientInfo.eta || 'Unknown'}

Emergency Contact: ${patientInfo.contactPhone || 'Not provided'}

Please prepare for patient arrival.
        `.trim();

        console.log('Hospital Notification:', notificationMessage);

        // Mock notification success
        // In production, integrate with email service (SendGrid, AWS SES)
        // and SMS service (Twilio, MSG91)

        return NextResponse.json(
            {
                message: 'Hospital notified successfully',
                notificationSent: {
                    hospitalName: hospital.name,
                    hospitalPhone: hospital.emergencyPhone || hospital.phone,
                    timestamp: new Date().toISOString()
                }
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('Hospital notification error:', err);
        return NextResponse.json(
            { error: 'Failed to notify hospital', details: err.message },
            { status: 500 }
        );
    }
}
