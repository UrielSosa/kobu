require('dotenv').config();

let Discord = require('discord.js');
let client = new Discord.Client();

let { words } = require('./controllers/helpers');
const kobuController = require('./controllers/kobuController');
let kobuMention = process.env.BOT_MENTION;

client.on('ready', () => {
    console.log("Bot is ready!");    
})

client.on('message', function(message) {
    //console.log(message);

    // Blocklist
    if(message.author.bot) return;
    if(!message.content.includes(kobuMention)) return;
    
    // Public
    if(message.content.includes(kobuMention)) {
        const args = message.content.slice(kobuMention.length).trim();
        
        if (args.toUpperCase() == '!shotdown') kobuController.off(message.channel, client);
        if (words(message, ["link", "zoom"])) kobuController.zoom(message);
        if (words(message, ["notion", "pepe"])) kobuController.notion(message);
        if (words(message, ["calendar", "calendario", "clases"])) kobuController.calendar(message);
        if (words(message, ["ayuda", "help"])) kobuController.help(message);
        
    };

})

client.login(process.env.DISCORD_TOKEN)