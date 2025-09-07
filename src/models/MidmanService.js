import mongoose from 'mongoose';

const midmanServiceSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    escrow_count: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, {
    timestamps: true
});

export const MidmanService = mongoose.model('MidmanService', midmanServiceSchema);