import mongoose from 'mongoose';

const botConfigSchema = new mongoose.Schema({
    channels: {
        main: String,
        buy_log: String,
        midman_log: String,
        report_mediator: String,
        report_log: String,
        product_log: String
    },
    categories: {
        buy_ticket: String,
        midleman_ticket: String
    },
    roles: {
        general: String,
        admin: String
    },
    settings: {
        shop_open: {
            type: Boolean,
            default: true
        },
        main_message_id: String
    }
}, {
    timestamps: true
});

export const BotConfig = mongoose.model('BotConfig', botConfigSchema);