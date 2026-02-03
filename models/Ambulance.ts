import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAmbulance extends Document {
    _id: string;
    registrationNumber: string;
    driver: mongoose.Types.ObjectId;
    location: {
        lat: number;
        lng: number;
    };
    status: 'available' | 'on_route' | 'busy' | 'offline';
    hospital?: string;
    phoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

const AmbulanceSchema: Schema = new Schema(
    {
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        driver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        location: {
            lat: {
                type: Number,
                required: true,
            },
            lng: {
                type: Number,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ['available', 'on_route', 'busy', 'offline'],
            default: 'available',
        },
        hospital: {
            type: String,
            default: '',
        },
        phoneNumber: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for status and lookup (location is lat/lng, not GeoJSON - use application-level nearest)
AmbulanceSchema.index({ status: 1 });
AmbulanceSchema.index({ registrationNumber: 1 });

const Ambulance: Model<IAmbulance> =
    mongoose.models.Ambulance || mongoose.model<IAmbulance>('Ambulance', AmbulanceSchema);

export default Ambulance;
