import { PaymentMethod } from '../models/PaymentMethod.js';
import { createEmbed } from '../utils/embedBuilder.js';

export default {
    name: 'payment_button',
    async execute(interaction) {
        const paymentMethods = await PaymentMethod.find().sort({ name: 1 });

        if (paymentMethods.length === 0) {
            return interaction.reply({
                content: '❌ No payment methods available!',
                ephemeral: true
            });
        }

        let paymentList = '';
        paymentMethods.forEach(method => {
            paymentList += `**${method.name}**\n`;
            paymentList += `Account: ${method.account_number}\n`;
            paymentList += `Name: ${method.account_name}\n\n`;
        });

        const embed = createEmbed('💳 Payment Methods', paymentList);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};