import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IDisasterAlert extends Document {
    type: 'flood' | 'cyclone' | 'earthquake' | 'landslide' | 'fire' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    titleTamil: string;
    message: string;
    messageTamil: string;
    affectedAreas: string[];
    affectedDistricts: string[];
    isActive: boolean;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DisasterAlertSchema = new Schema<IDisasterAlert>(
    {
        type: {
            type: String,
            required: true,
            enum: ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'other']
        },
        severity: {
            type: String,
            required: true,
            enum: ['low', 'medium', 'high', 'critical']
        },
        title: {
            type: String,
            required: true
        },
        titleTamil: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        messageTamil: {
            type: String,
            required: true
        },
        affectedAreas: [{
            type: String
        }],
        affectedDistricts: [{
            type: String
        }],
        isActive: {
            type: Boolean,
            default: true
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

DisasterAlertSchema.index({ isActive: 1, expiresAt: 1 });
DisasterAlertSchema.index({ affectedDistricts: 1, isActive: 1 });

const DisasterAlertModel: Model<IDisasterAlert> =
    mongoose.models.DisasterAlert || mongoose.model<IDisasterAlert>('DisasterAlert', DisasterAlertSchema);

export default DisasterAlertModel;
