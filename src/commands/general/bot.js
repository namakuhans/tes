import { SlashCommandBuilder } from 'discord.js';
import { BotConfig } from '../../models/BotConfig.js';
import { createEmbed } from '../../utils/embedBuilder.js';

export default {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Display bot information'),

    async execute(interaction) {
        try {
            const config = await BotConfig.findOne();
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            let rolesInfo = 'Not configured';
            let channelsInfo = 'Not configured';

            if (config) {
                // Roles information
                const adminRole = config.roles.admin ? `<@&${config.roles.admin}>` : 'Not set';
                const generalRole = config.roles.general ? `<@&${config.roles.general}>` : 'Not set';
                rolesInfo = `**Admin:** ${adminRole}\n**General:** ${generalRole}`;

                // Channels information
                const mainChannel = config.channels.main ? `<#${config.channels.main}>` : 'Not set';
                const buyLogChannel = config.channels.buy_log ? `<#${config.channels.buy_log}>` : 'Not set';
                const midmanLogChannel = config.channels.midman_log ? `<#${config.channels.midman_log}>` : 'Not set';
                channelsInfo = `**Main:** ${mainChannel}\n**Buy Log:** ${buyLogChannel}\n**Midman Log:** ${midmanLogChannel}`;
            }

            const embed = createEmbed(
                '🤖 Bot Information',
                `**Bot Name:** ${interaction.client.user.username}\n` +
                `**Version:** 1.0.0\n` +
                `**Creator:** iHannsy\n` +
                `**Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s\n` +
                `**Servers:** ${interaction.client.guilds.cache.size}\n` +
                `**Users:** ${interaction.client.users.cache.size}\n\n` +
                `**Configured Roles:**\n${rolesInfo}\n\n` +
                `**Configured Channels:**\n${channelsInfo}`
            );

            embed.setThumbnail(interaction.client.user.displayAvatarURL());

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching bot info:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching bot information!',
                ephemeral: true
            });
        }
    }
};