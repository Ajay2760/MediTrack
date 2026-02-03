import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmergencyRequest extends Document {
    _id: string;
    patient?: mongoose.Types.ObjectId;
    guestName?: string;
    guestPhone?: string;
    ambulance?: mongoose.Types.ObjectId;
    pickupLocation: {
        lat: number;
        lng: number;
        address?: string;
    };
    destination?: {
        lat: number;
        lng: number;
        address?: string;
    };
    hospital?: string;
    status: 'pending' | 'accepted' | 'on_way' | 'arrived' | 'picked' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'critical';
    notes?: string;
    handoverNotes?: string;
    acceptedAt?: Date;
    arrivedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const EmergencyRequestSchema: Schema = new Schema(
    {
        patient: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        guestName: { type: String, trim: true },
        guestPhone: { type: String, trim: true },
        ambulance: {
            type: Schema.Types.ObjectId,
            ref: 'Ambulance',
        },
        pickupLocation: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
            address: String,
        },
        destination: {
            lat: Number,
            lng: Number,
            address: String,
        },
        hospital: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'on_way', 'arrived', 'picked', 'completed', 'cancelled'],
            default: 'pending',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'high',
        },
        notes: {
            type: String,
            default: '',
        },
        handoverNotes: { type: String, default: '' },
        acceptedAt: Date,
        arrivedAt: Date,
        completedAt: Date,
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
EmergencyRequestSchema.index({ patient: 1, createdAt: -1 });
EmergencyRequestSchema.index({ ambulance: 1, createdAt: -1 });
EmergencyRequestSchema.index({ status: 1 });

const EmergencyRequest: Model<IEmergencyRequest> =
    mongoose.models.EmergencyRequest ||
    mongoose.model<IEmergencyRequest>('EmergencyRequest', EmergencyRequestSchema);

export default EmergencyRequest;
