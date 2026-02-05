import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IAlertSubscription extends Document {
    user: mongoose.Types.ObjectId;
    subscribedDistricts: string[];
    alertTypes: Array<'flood' | 'cyclone' | 'earthquake' | 'landslide' | 'fire' | 'other'>;
    notificationMethods: Array<'app' | 'sms' | 'email'>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AlertSubscriptionSchema = new Schema<IAlertSubscription>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        subscribedDistricts: [{
            type: String,
            trim: true
        }],
        alertTypes: [{
            type: String,
            enum: ['flood', 'cyclone', 'earthquake', 'landslide', 'fire', 'other']
        }],
        notificationMethods: [{
            type: String,
            enum: ['app', 'sms', 'email'],
            default: ['app']
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

AlertSubscriptionSchema.index({ user: 1 });
AlertSubscriptionSchema.index({ subscribedDistricts: 1, isActive: 1 });

const AlertSubscriptionModel: Model<IAlertSubscription> =
    mongoose.models.AlertSubscription || mongoose.model<IAlertSubscription>('AlertSubscription', AlertSubscriptionSchema);

export default AlertSubscriptionModel;
