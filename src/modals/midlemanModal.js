import { MidmanService } from '../models/MidmanService.js';
import { Transaction } from '../models/Transaction.js';
import { BotConfig } from '../models/BotConfig.js';
import { createEmbed } from '../utils/embedBuilder.js';
import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    name: 'midleman_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const partnerUsername = interaction.fields.getTextInputValue('partner_username');
        const escrowCount = parseInt(interaction.fields.getTextInputValue('escrow_count'));
        const details = interaction.fields.getTextInputValue('details') || 'No additional details';

        if (isNaN(escrowCount) || escrowCount <= 0) {
            return interaction.editReply({
                content: '❌ Invalid escrow count! Please enter a valid number.',
            });
        }

        // Find midleman service
        const midmanService = await MidmanService.findOne();
        if (!midmanService) {
            return interaction.editReply({
                content: '❌ No midleman services available!',
            });
        }

        const config = await BotConfig.findOne();
        if (!config || !config.categories.midleman_ticket) {
            return interaction.editReply({
                content: '❌ Midleman ticket category not configured!',
            });
        }

        const category = interaction.guild.channels.cache.get(config.categories.midleman_ticket);
        if (!category) {
            return interaction.editReply({
                content: '❌ Midleman ticket category not found!',
            });
        }

        // Create ticket channel
        const ticketChannel = await interaction.guild.channels.create({
            name: `midleman-${interaction.user.username}-${Date.now()}`,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                },
            ],
        });

        // Create transaction record
        const transaction = new Transaction({
            user_id: interaction.user.id,
            type: 'midleman',
            details: {
                partner_username: partnerUsername,
                escrow_count: escrowCount,
                additional_details: details
            },
            ticket_channel_id: ticketChannel.id
        });

        await transaction.save();

        // Create transaction embed
        const embed = createEmbed(
            '🤝 ESCROW SERVICE TRANSACTION DETAILS',
            `**Service:** Midleman/Escrow\n` +
            `**Partner Username:** ${partnerUsername}\n` +
            `**Escrow Count:** ${escrowCount}\n` +
            `**Tax Rate:** ${midmanService.tax}%\n` +
            `**Details:** ${details}\n` +
            `**Requester:** ${interaction.user}\n` +
            `**Transaction ID:** ${transaction._id}`
        );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('call_seller')
                    .setLabel('📞 Call Seller')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('payment_info')
                    .setLabel('💳 Payment')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 Close')
                    .setStyle(ButtonStyle.Danger)
            );

        await ticketChannel.send({
            content: `${interaction.user} Welcome to your midleman service ticket!`,
            embeds: [embed],
            components: [row]
        });

        // Log to midman log channel
        if (config.channels.midman_log) {
            const logChannel = interaction.guild.channels.cache.get(config.channels.midman_log);
            if (logChannel) {
                const logEmbed = createEmbed(
                    '🤝 New Midleman Request',
                    `**Requester:** ${interaction.user}\n` +
                    `**Partner:** ${partnerUsername}\n` +
                    `**Escrow Count:** ${escrowCount}\n` +
                    `**Channel:** ${ticketChannel}`
                );
                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        await interaction.editReply({
            content: `✅ Midleman ticket created! Check ${ticketChannel}`,
        });
    }
};