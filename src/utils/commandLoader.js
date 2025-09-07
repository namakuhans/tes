import fs from 'fs';
import path from 'path';

export const loadCommands = async (client) => {
    const commandFolders = ['general', 'admin'];
    
    for (const folder of commandFolders) {
        const commandPath = `./src/commands/${folder}`;
        if (!fs.existsSync(commandPath)) continue;
        
        const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = await import(`../commands/${folder}/${file}`);
            client.commands.set(command.default.data.name, command.default);
        }
    }
    
    console.log(`✅ Loaded ${client.commands.size} commands`);
};