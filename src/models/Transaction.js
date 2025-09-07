import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['buy', 'midleman']
    },
    details: {
        product_code: String,
        product_name: String,
        quantity: Number,
        price: Number,
        partner_username: String,
        escrow_count: Number,
        additional_details: String
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'cancelled']
    },
    ticket_channel_id: String
}, {
    timestamps: true
});

export const Transaction = mongoose.model('Transaction', transactionSchema);