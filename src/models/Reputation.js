import mongoose from 'mongoose';

const reputationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    },
    history: [{
        from_user_id: String,
        reason: String,
        points: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export const Reputation = mongoose.model('Reputation', reputationSchema);