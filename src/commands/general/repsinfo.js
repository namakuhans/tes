import { SlashCommandBuilder } from 'discord.js';
import { Reputation } from '../../models/Reputation.js';
import { createEmbed } from '../../utils/embedBuilder.js';

export default {
    data: new SlashCommandBuilder()
        .setName('repsinfo')
        .setDescription('View reputation information for a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to check reputation for')
                .setRequired(true)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');

        try {
            const reputation = await Reputation.findOne({ user_id: targetUser.id });

            if (!reputation || reputation.points === 0) {
                const embed = createEmbed(
                    '📊 Reputation Information',
                    `**User:** ${targetUser}\n` +
                    `**Total Points:** 0\n` +
                    `**History:** No reputation history`
                );

                return interaction.reply({ embeds: [embed] });
            }

            let historyText = '';
            const recentHistory = reputation.history.slice(-5).reverse();
            
            for (const entry of recentHistory) {
                const fromUser = await interaction.client.users.fetch(entry.from_user_id).catch(() => null);
                const fromUserName = fromUser ? fromUser.username : 'Unknown User';
                historyText += `**+${entry.points}** from ${fromUserName}\n`;
                historyText += `*${entry.reason}*\n`;
                historyText += `<t:${Math.floor(entry.timestamp.getTime() / 1000)}:R>\n\n`;
            }

            if (reputation.history.length > 5) {
                historyText += `*... and ${reputation.history.length - 5} more entries*`;
            }

            const embed = createEmbed(
                '📊 Reputation Information',
                `**User:** ${targetUser}\n` +
                `**Total Points:** ${reputation.points}\n` +
                `**Total Entries:** ${reputation.history.length}\n\n` +
                `**Recent History:**\n${historyText}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching reputation:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching reputation information!',
                ephemeral: true
            });
        }
    }
};