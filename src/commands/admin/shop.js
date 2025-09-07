import { SlashCommandBuilder } from 'discord.js';
import { BotConfig } from '../../models/BotConfig.js';
import { createEmbed } from '../../utils/embedBuilder.js';
import { isAdmin } from '../../utils/permissions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Open or close the store')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Store status')
                .setRequired(true)
                .addChoices(
                    { name: 'Open', value: 'open' },
                    { name: 'Close', value: 'close' }
                )),

    async execute(interaction) {
        if (!await isAdmin(interaction.member)) {
            return interaction.reply({
                content: '❌ You need admin permissions to use this command!',
                ephemeral: true
            });
        }

        const status = interaction.options.getString('status');
        const isOpen = status === 'open';

        try {
            let config = await BotConfig.findOne();
            
            if (!config) {
                config = new BotConfig({
                    channels: {},
                    categories: {},
                    roles: {},
                    settings: { shop_open: isOpen }
                });
            } else {
                config.settings.shop_open = isOpen;
            }

            await config.save();

            const embed = createEmbed(
                `✅ Store ${isOpen ? 'Opened' : 'Closed'}`,
                `The store is now **${isOpen ? 'OPEN' : 'CLOSED'}**`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error updating store status:', error);
            await interaction.reply({
                content: '❌ An error occurred while updating store status!',
                ephemeral: true
            });
        }
    }
};