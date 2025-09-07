import { SlashCommandBuilder } from 'discord.js';
import { Transaction } from '../../models/Transaction.js';
import { createEmbed } from '../../utils/embedBuilder.js';
import { isGeneral } from '../../utils/permissions.js';

export default {
    data: new SlashCommandBuilder()
        .setName('mytrx')
        .setDescription('View your transaction history'),

    async execute(interaction) {
        if (!await isGeneral(interaction.member)) {
            return interaction.reply({
                content: '❌ You need the general role to use this command!',
                ephemeral: true
            });
        }

        try {
            const transactions = await Transaction.find({ user_id: interaction.user.id })
                .sort({ createdAt: -1 })
                .limit(10);

            if (transactions.length === 0) {
                const embed = createEmbed(
                    '📋 Transaction History',
                    'You have no transaction history.'
                );

                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            let transactionList = '';
            transactions.forEach((trx, index) => {
                const date = `<t:${Math.floor(trx.createdAt.getTime() / 1000)}:d>`;
                const status = trx.status.charAt(0).toUpperCase() + trx.status.slice(1);
                
                if (trx.type === 'buy') {
                    transactionList += `**${index + 1}.** 🛒 Purchase\n`;
                    transactionList += `Product: ${trx.details.product_name}\n`;
                    transactionList += `Quantity: ${trx.details.quantity}\n`;
                    transactionList += `Total: $${trx.details.price}\n`;
                } else {
                    transactionList += `**${index + 1}.** 🤝 Midleman\n`;
                    transactionList += `Partner: ${trx.details.partner_username}\n`;
                    transactionList += `Escrow: ${trx.details.escrow_count}\n`;
                }
                
                transactionList += `Status: ${status}\n`;
                transactionList += `Date: ${date}\n\n`;
            });

            const embed = createEmbed(
                '📋 Your Transaction History',
                transactionList
            );

            embed.setFooter({ text: `Showing last ${transactions.length} transactions` });

            await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (error) {
            console.error('Error fetching transactions:', error);
            await interaction.reply({
                content: '❌ An error occurred while fetching your transactions!',
                ephemeral: true
            });
        }
    }
};