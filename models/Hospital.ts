import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHospital extends Document {
    _id: string;
    name: string;
    nameTamil?: string;
    location: {
        lat: number;
        lng: number;
    };
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
}

const HospitalSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        nameTamil: { type: String, trim: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        district: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        emergencyPhone: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        emergencyServices: {
            type: Boolean,
            default: true,
        },
        bedAvailability: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalBeds: { type: Number, min: 0 },
        specialties: {
            type: [String],
            default: ['Emergency'],
        },
        isGovernment: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

HospitalSchema.index({ district: 1 });
HospitalSchema.index({ location: 1 });

const Hospital: Model<IHospital> =
    mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', HospitalSchema);

export default Hospital;
