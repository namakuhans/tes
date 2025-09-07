import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    account_number: {
        type: String,
        required: true
    },
    account_name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);