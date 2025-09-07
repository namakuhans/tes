import fs from 'fs';

export const loadEvents = async (client) => {
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
        const event = await import(`../events/${file}`);
        
        if (event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(...args));
        } else {
            client.on(event.default.name, (...args) => event.default.execute(...args));
        }
    }
    
    console.log(`✅ Loaded ${eventFiles.length} events`);
};