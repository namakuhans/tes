import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter_id: {
        type: String,
        required: true
    },
    reported_id: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    attachment_url: String,
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'resolved', 'rejected']
    },
    message_id: String,
    resolved_by: String,
    resolution_reason: String
}, {
    timestamps: true
});

export const Report = mongoose.model('Report', reportSchema);