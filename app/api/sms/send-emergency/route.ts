import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phone, location, message, name } = body;

        if (!phone || !location) {
            return NextResponse.json(
                { error: 'Phone and location are required' },
                { status: 400 }
            );
        }

        // Format SMS message
        const smsMessage = `🚨 EMERGENCY ALERT from MediTrack

Name: ${name || 'Emergency User'}
Location: ${location}
${message ? `Message: ${message}` : ''}

An ambulance has been requested. Help is on the way.

- MediTrack Emergency System`;

        console.log('SMS Fallback - Message to send:');
        console.log('Phone:', phone);
        console.log('Message:', smsMessage);

        // Mock SMS sending
        // In production, integrate with SMS gateway:

        /* 
        // TWILIO EXAMPLE:
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
        
        const client = require('twilio')(accountSid, authToken);
        
        await client.messages.create({
            body: smsMessage,
            from: twilioPhone,
            to: phone
        });
        */

        /* 
        // MSG91 EXAMPLE:
        const msg91AuthKey = process.env.MSG91_AUTH_KEY;
        const msg91SenderId = process.env.MSG91_SENDER_ID;
        
        await fetch('https://api.msg91.com/api/v5/flow/', {
            method: 'POST',
            headers: {
                'authkey': msg91AuthKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: msg91SenderId,
                recipients: [{ mobiles: phone }],
                message: smsMessage
            })
        });
        */

        // For now, return success with mock data
        return NextResponse.json(
            {
                success: true,
                message: 'SMS sent successfully (mock)',
                sentTo: phone,
                timestamp: new Date().toISOString(),
                note: 'Configure SMS gateway credentials in environment variables for production'
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error('SMS send error:', err);
        return NextResponse.json(
            { error: 'Failed to send SMS', details: err.message },
            { status: 500 }
        );
    }
}
