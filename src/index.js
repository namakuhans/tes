import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import { config } from './config.js';
import { connectDB } from './utils/database.js';
import { loadCommands } from './utils/commandLoader.js';
import { loadEvents } from './utils/eventLoader.js';
import fs from 'fs';
import path from 'path';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// Initialize collections
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Connect to MongoDB
await connectDB();

// Load commands, events, buttons, and modals
await loadCommands(client);
await loadEvents(client);

// Load buttons
const buttonFiles = fs.readdirSync('./src/buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
    const button = await import(`./buttons/${file}`);
    client.buttons.set(button.default.name, button.default);
}

// Load modals
const modalFiles = fs.readdirSync('./src/modals').filter(file => file.endsWith('.js'));
for (const file of modalFiles) {
    const modal = await import(`./modals/${file}`);
    client.modals.set(modal.default.name, modal.default);
}

// Deploy commands
const rest = new REST().setToken(config.token);

try {
    console.log('Started refreshing application (/) commands.');
    
    const commands = [];
    client.commands.forEach(command => {
        commands.push(command.data.toJSON());
    });

    await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error('Error deploying commands:', error);
}

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
    process.exit(1);
});

client.login(config.token);