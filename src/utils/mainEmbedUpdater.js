import { BotConfig } from '../models/BotConfig.js';
import { Product } from '../models/Product.js';
import { MidmanService } from '../models/MidmanService.js';
import { PaymentMethod } from '../models/PaymentMethod.js';
import { createMainEmbed } from './embedBuilder.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export const updateMainEmbed = async (client) => {
    try {
        const config = await BotConfig.findOne();
        if (!config || !config.channels.main || !config.settings.main_message_id) return;

        const channel = client.channels.cache.get(config.channels.main);
        if (!channel) return;

        const products = await Product.find().sort({ code: 1 });
        const midmanServices = await MidmanService.find().sort({ code: 1 });
        const paymentMethods = await PaymentMethod.find().sort({ name: 1 });

        const { embed, attachment } = await createMainEmbed(
            products,
            midmanServices,
            paymentMethods,
            config.settings.shop_open
        );

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('buy_button')
                    .setLabel('🛒 Buy')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('midleman_button')
                    .setLabel('🤝 Midleman')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('payment_button')
                    .setLabel('💳 Payment')
                    .setStyle(ButtonStyle.Secondary)
            );

        try {
            const message = await channel.messages.fetch(config.settings.main_message_id);
            await message.edit({
                embeds: [embed],
                components: [row],
                files: [attachment]
            });
        } catch (error) {
            // Message not found, create new one
            const newMessage = await channel.send({
                embeds: [embed],
                components: [row],
                files: [attachment]
            });
            
            config.settings.main_message_id = newMessage.id;
            await config.save();
        }
    } catch (error) {
        console.error('Error updating main embed:', error);
    }
};