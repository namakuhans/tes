import { BotConfig } from '../models/BotConfig.js';

export const hasRole = async (member, roleType) => {
    try {
        const config = await BotConfig.findOne();
        if (!config) return false;
        
        const roleId = config.roles[roleType];
        if (!roleId) return false;
        
        return member.roles.cache.has(roleId);
    } catch (error) {
        console.error('Error checking role:', error);
        return false;
    }
};

export const isAdmin = async (member) => {
    return await hasRole(member, 'admin');
};

export const isGeneral = async (member) => {
    return await hasRole(member, 'general');
};