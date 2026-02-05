import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBloodDonor extends Document {
    user: mongoose.Types.ObjectId;
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    lastDonated?: Date;
    availableForDonation: boolean;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    address: string;
    district: string;
    phone: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BloodDonorSchema = new Schema<IBloodDonor>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        bloodGroup: {
            type: String,
            required: true,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        lastDonated: {
            type: Date,
            default: null
        },
        availableForDonation: {
            type: Boolean,
            default: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        address: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Geospatial index for location-based queries
BloodDonorSchema.index({ location: '2dsphere' });
BloodDonorSchema.index({ bloodGroup: 1, availableForDonation: 1 });
BloodDonorSchema.index({ district: 1, bloodGroup: 1 });

const BloodDonorModel: Model<IBloodDonor> =
    mongoose.models.BloodDonor || mongoose.model<IBloodDonor>('BloodDonor', BloodDonorSchema);

export default BloodDonorModel;
