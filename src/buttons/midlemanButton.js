import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { isGeneral } from '../utils/permissions.js';

export default {
    name: 'midleman_button',
    async execute(interaction) {
        if (!await isGeneral(interaction.member)) {
            return interaction.reply({
                content: '❌ You need the general role to use this feature!',
                ephemeral: true
            });
        }

        const modal = new ModalBuilder()
            .setCustomId('midleman_modal')
            .setTitle('Midleman Service');

        const usernameInput = new TextInputBuilder()
            .setCustomId('partner_username')
            .setLabel('Transaction Partner Username')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter partner username')
            .setRequired(true);

        const escrowInput = new TextInputBuilder()
            .setCustomId('escrow_count')
            .setLabel('Number of Escrow Transaction')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter escrow transaction count')
            .setRequired(true);

        const detailsInput = new TextInputBuilder()
            .setCustomId('details')
            .setLabel('Details (Optional)')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter additional details')
            .setRequired(false);

        const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
        const secondActionRow = new ActionRowBuilder().addComponents(escrowInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(detailsInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

        await interaction.showModal(modal);
    }
};