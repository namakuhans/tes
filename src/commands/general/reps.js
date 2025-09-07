import { SlashCommandBuilder } from 'discord.js';
import { Reputation } from '../../models/Reputation.js';
import { createEmbed } from '../../utils/embedBuilder.js';
import { isGeneral } from '../../utils/permissions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reps')
        .setDescription('Add reputation points to a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to give reputation to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for giving reputation')
                .setRequired(true)),

    async execute(interaction) {
        if (!await isGeneral(interaction.member)) {
            return interaction.reply({
                content: '❌ You need the general role to use this command!',
                ephemeral: true
            });
        }

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ You cannot give reputation to yourself!',
                ephemeral: true
            });
        }

        if (targetUser.bot) {
            return interaction.reply({
                content: '❌ You cannot give reputation to bots!',
                ephemeral: true
            });
        }

        try {
            let reputation = await Reputation.findOne({ user_id: targetUser.id });
            
            if (!reputation) {
                reputation = new Reputation({
                    user_id: targetUser.id,
                    points: 0,
                    history: []
                });
            }

            reputation.points += 1;
            reputation.history.push({
                from_user_id: interaction.user.id,
                reason: reason,
                points: 1,
                timestamp: new Date()
            });

            await reputation.save();

            const embed = createEmbed(
                '✅ Reputation Added',
                `**User:** ${targetUser}\n` +
                `**Points Added:** +1\n` +
                `**Total Points:** ${reputation.points}\n` +
                `**Reason:** ${reason}\n` +
                `**Given by:** ${interaction.user}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error adding reputation:', error);
            await interaction.reply({
                content: '❌ An error occurred while adding reputation!',
                ephemeral: true
            });
        }
    }
};