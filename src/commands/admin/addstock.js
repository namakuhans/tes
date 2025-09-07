import { SlashCommandBuilder } from 'discord.js';
import { Product } from '../../models/Product.js';
import { createEmbed } from '../../utils/embedBuilder.js';
import { isAdmin } from '../../utils/permissions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addstock')
        .setDescription('Add a new product to the store')
        .addStringOption(option =>
            option.setName('code')
                .setDescription('Product code (unique identifier)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Product name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('quantity')
                .setDescription('Product quantity')
                .setRequired(true)
                .setMinValue(0))
        .addNumberOption(option =>
            option.setName('price')
                .setDescription('Product price')
                .setRequired(true)
                .setMinValue(0)),

    async execute(interaction) {
        if (!await isAdmin(interaction.member)) {
            return interaction.reply({
                content: '❌ You need admin permissions to use this command!',
                ephemeral: true
            });
        }

        const code = interaction.options.getString('code').toUpperCase();
        const name = interaction.options.getString('name');
        const quantity = interaction.options.getInteger('quantity');
        const price = interaction.options.getNumber('price');

        try {
            // Check if product already exists
            const existingProduct = await Product.findOne({ code });
            if (existingProduct) {
                return interaction.reply({
                    content: `❌ Product with code \`${code}\` already exists!`,
                    ephemeral: true
                });
            }

            // Create new product
            const product = new Product({
                code,
                name,
                quantity,
                price
            });

            await product.save();

            const embed = createEmbed(
                '✅ Product Added',
                `**Code:** ${code}\n` +
                `**Name:** ${name}\n` +
                `**Quantity:** ${quantity}\n` +
                `**Price:** $${price}`
            );

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error adding product:', error);
            await interaction.reply({
                content: '❌ An error occurred while adding the product!',
                ephemeral: true
            });
        }
    }
};