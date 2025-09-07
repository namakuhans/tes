import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embedBuilder.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display help information and command documentation'),

    async execute(interaction) {
        const generalCommands = `
**🛒 Store Commands:**
\`/reps <user> <reason>\` - Give reputation to a user
\`/repsinfo <user>\` - View user's reputation information
\`/report <user> <reason> [attachment]\` - Report a user to admins
\`/mytrx\` - View your transaction history
\`/bot\` - Display bot information
\`/help\` - Show this help message

**🔘 Button Interactions:**
**Buy Button** - Purchase products from the store
**Midleman Button** - Request escrow services
**Payment Button** - View available payment methods
        `;

        const adminCommands = `
**⚙️ Admin Commands:**
\`/setup <channel>\` - Set main store channel
\`/addstock <code> <name> <quantity> <price>\` - Add product
\`/editstock <code> [name] [quantity] [price]\` - Edit product
\`/removestock <code>\` - Remove product
\`/addmm <code> <escrow_count> <tax>\` - Add midleman service
\`/editmm <code> [escrow_count] [tax]\` - Edit midleman service
\`/removemm <code>\` - Remove midleman service
\`/addpayment <name> <account> <holder>\` - Add payment method
\`/removepayment <name>\` - Remove payment method
\`/setbuylog <channel>\` - Set buy log channel
\`/setmidmanlog <channel>\` - Set midman log channel
\`/setreportmediator <channel>\` - Set report mediator channel
\`/setreportlog <channel>\` - Set report log channel
\`/setproductlog <channel>\` - Set product log channel
\`/setbuyticket <category>\` - Set buy ticket category
\`/setmidlemanticket <category>\` - Set midleman ticket category
\`/role <user> <role>\` - Assign role to user
\`/shop <open|close>\` - Open/close the store
\`/setgeneral <role>\` - Set general user role
\`/setadmin <role>\` - Set admin role
\`/trx <user>\` - View user's transactions
        `;

        const embed = createEmbed(
            '📚 Help & Documentation',
            `Welcome to the Discord Auto Store Bot!\n\n${generalCommands}`
        );

        // Check if user is admin to show admin commands
        try {
            const { isAdmin } = await import('../../utils/permissions.js');
            if (await isAdmin(interaction.member)) {
                embed.addFields({
                    name: '🔧 Admin Commands',
                    value: adminCommands,
                    inline: false
                });
            }
        } catch (error) {
            console.error('Error checking admin permissions:', error);
        }

        embed.addFields({
            name: '💡 How to Use',
            value: 'Use the buttons in the main store channel to interact with the store. Commands can be used anywhere in the server.',
            inline: false
        });

        embed.setFooter({ text: 'Discord Auto Store Bot v1.0.0 | Created by iHannsy' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};