import { Events } from 'discord.js';
import { updateMainEmbed } from '../utils/mainEmbedUpdater.js';

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`✅ Ready! Logged in as ${client.user.tag}`);
        
        // Start main embed updater
        setInterval(async () => {
            await updateMainEmbed(client);
        }, 5000); // Update every 5 seconds
    }
};