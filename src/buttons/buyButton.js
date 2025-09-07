import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { isGeneral } from '../utils/permissions.js';

export default {
    name: 'buy_button',
    async execute(interaction) {
        if (!await isGeneral(interaction.member)) {
            return interaction.reply({
                content: '❌ You need the general role to use this feature!',
                ephemeral: true
            });
        }

        const modal = new ModalBuilder()
            .setCustomId('buy_modal')
            .setTitle('Purchase Product');

        const productNameInput = new TextInputBuilder()
            .setCustomId('product_name')
            .setLabel('Product Name/Code')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter product name or code')
            .setRequired(true);

        const quantityInput = new TextInputBuilder()
            .setCustomId('quantity')
            .setLabel('Quantity')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter quantity to purchase')
            .setRequired(true);

        const firstActionRow = new ActionRowBuilder().addComponents(productNameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(quantityInput);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);
    }
};