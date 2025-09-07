import dotenv from 'dotenv';
dotenv.config();

export const config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    mongoUri: process.env.MONGODB_URI,
    colors: {
        embed: 0xFFFFFF, // White
        success: 0x00FF00,
        error: 0xFF0000,
        warning: 0xFFFF00
    },
    emojis: {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        loading: '⏳'
    }
};