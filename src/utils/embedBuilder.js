import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { config } from '../config.js';

export const createEmbed = (title, description, color = config.colors.embed) => {
    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setTimestamp();
};

export const createMainEmbed = async (products, midmanServices, paymentMethods, shopStatus) => {
    const embed = new EmbedBuilder()
        .setTitle('🏪 AUTO STORE')
        .setColor(config.colors.embed)
        .setTimestamp();

    // Products section
    let productList = '```\n';
    if (products.length > 0) {
        products.forEach(product => {
            productList += `${product.code} | ${product.name} | Stock: ${product.quantity} | Price: $${product.price}\n`;
        });
    } else {
        productList += 'No products available\n';
    }
    productList += '```';

    // Midleman services section
    let midmanList = '```\n';
    if (midmanServices.length > 0) {
        midmanServices.forEach(service => {
            midmanList += `${service.code} | Escrow: ${service.escrow_count} | Tax: ${service.tax}%\n`;
        });
    } else {
        midmanList += 'No midleman services available\n';
    }
    midmanList += '```';

    // Payment methods section
    let paymentList = '```\n';
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            paymentList += `${method.name}: ${method.account_number} (${method.account_name})\n`;
        });
    } else {
        paymentList += 'No payment methods available\n';
    }
    paymentList += '```';

    embed.addFields(
        { name: '📦 Products', value: productList, inline: false },
        { name: '🤝 Midleman Services', value: midmanList, inline: false },
        { name: '💳 Payment Methods', value: paymentList, inline: false },
        { name: '📋 Instructions', value: 'Click the buttons below to interact with the store', inline: false }
    );

    const imageName = shopStatus ? 'shop-open.gif' : 'shop-closed.gif';
    const attachment = new AttachmentBuilder(`./assets/${imageName}`, { name: imageName });
    embed.setImage(`attachment://${imageName}`);

    embed.setFooter({ 
        text: `Store Status: ${shopStatus ? 'OPEN' : 'CLOSED'} | Last Updated` 
    });

    return { embed, attachment };
};