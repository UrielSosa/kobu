require('dotenv').config();

let Discord = require('discord.js');
let client = new Discord.Client();

let helpers = require('./controllers/helpers');
const kobuController = require('./controllers/kobuController');
let kobuMention = '760683169602076693>';

client.on('ready', () => {
    console.log("Bot is ready!");    
})

client.on('message', function(message) {

    let words = (message, array) => {
        let check = 0;
        for(let element of array) {
            if(message.content.toLowerCase().includes(element)) {
                check++
            }
        }
    
        return check > 0
    }

    // Blocklist
    if(message.author.bot) return;
    if(!message.content.includes(kobuMention)) return;

    // message.member.hasPermission('profes')

    // Public
    if(message.content.includes(kobuMention)) {
        // const code = message.content.split(" ")[1];
        if(words(message, ["link", "zoom"])) kobuController.zoom(message);
        if(words(message, ["calendar", "calendario", "clases"])) kobuController.calendar(message);
        if(words(message, ["ayuda", "help"])) kobuController.help(message);
    };

})

client.login(process.env.DISCORD_TOKEN)