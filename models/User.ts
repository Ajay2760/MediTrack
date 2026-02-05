import mongoose, { Schema, Document, Model } from 'mongoose';

export interface User extends Document {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    role: 'user' | 'driver' | 'admin';
    bloodGroup?: string;
    allergies?: string[];
    location?: {
        lat: number;
        lng: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            sparse: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'driver', 'admin'],
            default: 'user',
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
            default: '',
        },
        allergies: {
            type: [String],
            default: [],
        },
        location: {
            lat: Number,
            lng: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ role: 1 });

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
