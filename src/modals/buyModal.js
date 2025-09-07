import { Product } from '../models/Product.js';
import { Transaction } from '../models/Transaction.js';
import { BotConfig } from '../models/BotConfig.js';
import { createEmbed } from '../utils/embedBuilder.js';
import { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    name: 'buy_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const productName = interaction.fields.getTextInputValue('product_name');
        const quantity = parseInt(interaction.fields.getTextInputValue('quantity'));

        if (isNaN(quantity) || quantity <= 0) {
            return interaction.editReply({
                content: '❌ Invalid quantity! Please enter a valid number.',
            });
        }

        // Find product by name or code
        const product = await Product.findOne({
            $or: [
                { name: { $regex: productName, $options: 'i' } },
                { code: productName.toUpperCase() }
            ]
        });

        if (!product) {
            return interaction.editReply({
                content: '❌ Product not found!',
            });
        }

        if (product.quantity < quantity) {
            return interaction.editReply({
                content: `❌ Insufficient stock! Available: ${product.quantity}`,
            });
        }

        const config = await BotConfig.findOne();
        if (!config || !config.categories.buy_ticket) {
            return interaction.editReply({
                content: '❌ Buy ticket category not configured!',
            });
        }

        const category = interaction.guild.channels.cache.get(config.categories.buy_ticket);
        if (!category) {
            return interaction.editReply({
                content: '❌ Buy ticket category not found!',
            });
        }

        // Create ticket channel
        const ticketChannel = await interaction.guild.channels.create({
            name: `buy-${interaction.user.username}-${Date.now()}`,
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
            type: 'buy',
            details: {
                product_code: product.code,
                product_name: product.name,
                quantity: quantity,
                price: product.price * quantity
            },
            ticket_channel_id: ticketChannel.id
        });

        await transaction.save();

        // Update product stock
        product.quantity -= quantity;
        await product.save();

        // Create transaction embed
        const embed = createEmbed(
            '📦 PRODUCT DETAIL TRANSACTION',
            `**Product:** ${product.name} (${product.code})\n` +
            `**Quantity:** ${quantity}\n` +
            `**Unit Price:** $${product.price}\n` +
            `**Total Price:** $${product.price * quantity}\n` +
            `**Customer:** ${interaction.user}\n` +
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
            content: `${interaction.user} Welcome to your purchase ticket!`,
            embeds: [embed],
            components: [row]
        });

        // Log to buy log channel
        if (config.channels.buy_log) {
            const logChannel = interaction.guild.channels.cache.get(config.channels.buy_log);
            if (logChannel) {
                const logEmbed = createEmbed(
                    '🛒 New Purchase',
                    `**Customer:** ${interaction.user}\n` +
                    `**Product:** ${product.name}\n` +
                    `**Quantity:** ${quantity}\n` +
                    `**Total:** $${product.price * quantity}\n` +
                    `**Channel:** ${ticketChannel}`
                );
                await logChannel.send({ embeds: [logEmbed] });
            }
        }

        // Log to product log channel
        if (config.channels.product_log) {
            const productLogChannel = interaction.guild.channels.cache.get(config.channels.product_log);
            if (productLogChannel) {
                const productLogEmbed = createEmbed(
                    '📦 Stock Update',
                    `**Product:** ${product.name} (${product.code})\n` +
                    `**Sold:** ${quantity}\n` +
                    `**Remaining Stock:** ${product.quantity}\n` +
                    `**Customer:** ${interaction.user}`
                );
                await productLogChannel.send({ embeds: [productLogEmbed] });
            }
        }

        await interaction.editReply({
            content: `✅ Purchase ticket created! Check ${ticketChannel}`,
        });
    }
};