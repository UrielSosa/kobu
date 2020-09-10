require('dotenv').config();

let neatCSV = require('neat-csv');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let Discord = require('discord.js');
let client = new Discord.Client();

let helpers = require('./controllers/helpers');
let kobuMention = '750858546530222111>';

client.on('ready', () => {
    console.log("Bot is ready!");    
})

client.on('message', function(message) {

    // Blocklist
    if(message.author.bot) return;
    if(!message.content.includes(kobuMention)) return;

    // message.member.hasPermission('profes')

    // Public
    if(message.content.includes(kobuMention)) {
        const code = message.content.split(" ")[1];
        switch(code) {
            // Public cases
            case 'calendar':
            case 'calendario':
                message.react('📅');
                fs.readFile(path.join(__dirname, './data/calendar.csv'), async (error, data) => {
                    if(error) {
                        console.error(error);
                        return;
                    }
                    let calendar = await neatCSV(data, helpers.csvHeaders());
                    calendar.shift()
                    calendar = calendar.reverse();
                    let actualCalendar = calendar.filter(function(element) {
                        const fechaHoy = moment().format("YYYY-MM-DD");
                        const fechaClase = moment(element.fecha, "DD-MM-YYYY").format("YYYY-MM-DD");
                        return moment(fechaHoy).isSameOrBefore(fechaClase)
                    })
                    let calendarFields = actualCalendar.map(element => {
                        let fecha = moment(element.fecha, "DD-MM-YYYY");
                        fecha.locale('es');
                        return {
                            name: element.clase,
                            value: `*${fecha.format("dddd DD/MM/YYYY")}*`
                        }
                    })
                    let embed = new Discord.MessageEmbed()
                        .setColor('#f7b9ae')
                        .addFields(calendarFields.slice(0, 5))
                        message.reply('va una lista de las próximas clases:')
                    message.channel.send(embed)
                })
                break;
        }
    };

})

client.login(process.env.DISCORD_TOKEN)