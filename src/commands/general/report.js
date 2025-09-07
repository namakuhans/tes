import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { Report } from '../../models/Report.js';
import { BotConfig } from '../../models/BotConfig.js';
import { createEmbed } from '../../utils/embedBuilder.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { isGeneral } from '../../utils/permissions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report a user to administrators')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to report')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for reporting')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachment')
                .setDescription('Evidence attachment (optional)')
                .setRequired(false)),

    async execute(interaction) {
        if (!await isGeneral(interaction.member)) {
            return interaction.reply({
                content: '❌ You need the general role to use this command!',
                ephemeral: true
            });
        }

        const reportedUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const attachment = interaction.options.getAttachment('attachment');

        if (reportedUser.id === interaction.user.id) {
            return interaction.reply({
                content: '❌ You cannot report yourself!',
                ephemeral: true
            });
        }

        try {
            const config = await BotConfig.findOne();
            if (!config || !config.channels.report_mediator) {
                return interaction.reply({
                    content: '❌ Report mediator channel not configured!',
                    ephemeral: true
                });
            }

            const mediatorChannel = interaction.guild.channels.cache.get(config.channels.report_mediator);
            if (!mediatorChannel) {
                return interaction.reply({
                    content: '❌ Report mediator channel not found!',
                    ephemeral: true
                });
            }

            // Create report record
            const report = new Report({
                reporter_id: interaction.user.id,
                reported_id: reportedUser.id,
                reason: reason,
                attachment_url: attachment ? attachment.url : null
            });

            await report.save();

            // Create report embed
            const reportEmbed = createEmbed(
                '🚨 REPORT ALERT!',
                `**Reported User:** ${reportedUser} (${reportedUser.id})\n` +
                `**Reporter:** ${interaction.user} (${interaction.user.id})\n` +
                `**Reason:** ${reason}\n` +
                `**Report ID:** ${report._id}\n` +
                `**Timestamp:** <t:${Math.floor(Date.now() / 1000)}:F>`
            );

            if (attachment) {
                reportEmbed.addFields({
                    name: '📎 Evidence',
                    value: `[View Attachment](${attachment.url})`
                });
            }

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ban_${report._id}`)
                        .setLabel('🔨 Ban')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`kick_${report._id}`)
                        .setLabel('👢 Kick')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`reject_${report._id}`)
                        .setLabel('❌ Reject')
                        .setStyle(ButtonStyle.Secondary)
                );

            // Add report alert gif
            const alertGif = new AttachmentBuilder('./assets/report-alert.gif', { name: 'report-alert.gif' });
            reportEmbed.setImage('attachment://report-alert.gif');

            const reportMessage = await mediatorChannel.send({
                embeds: [reportEmbed],
                components: [row],
                files: [alertGif]
            });

            // Update report with message ID
            report.message_id = reportMessage.id;
            await report.save();

            await interaction.reply({
                content: '✅ Report submitted successfully! Administrators have been notified.',
                ephemeral: true
            });

        } catch (error) {
            console.error('Error submitting report:', error);
            await interaction.reply({
                content: '❌ An error occurred while submitting the report!',
                ephemeral: true
            });
        }
    }
};