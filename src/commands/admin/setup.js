import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { BotConfig } from '../../models/BotConfig.js';
import { createEmbed } from '../../utils/embedBuilder.js';
import { isAdmin } from '../../utils/permissions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Set the main store channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to use as main store')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)),

    async execute(interaction) {
        if (!await isAdmin(interaction.member)) {
            return interaction.reply({
                content: '❌ You need admin permissions to use this command!',
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel');

        try {
            let config = await BotConfig.findOne();
            
            if (!config) {
                config = new BotConfig({
                    channels: { main: channel.id },
                    categories: {},
                    roles: {},
                    settings: { shop_open: true }
                });
            } else {
                config.channels.main = channel.id;
            }

            await config.save();

            const embed = createEmbed(
                '✅ Main Channel Set',
                `Main store channel has been set to ${channel}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error setting main channel:', error);
            await interaction.reply({
                content: '❌ An error occurred while setting the main channel!',
                ephemeral: true
            });
        }
    }
};