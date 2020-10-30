let neatCSV = require('neat-csv');
let moment = require('moment');
let { readFile, csvHeaders, checkServer} = require('./helpers');
let Discord = require('discord.js');

let quotes = JSON.parse(readFile('../data/quotes.json'));
let data = JSON.parse(readFile('../data/general.json'));

module.exports = {
    talk: function() {
        return quotes.punch[Math.floor(Math.random() * quotes.punch.length)]
    },
    calendar: async function (message) {
        message.react('🐱');

        let server = checkServer(message, data);
        
        calendarRead = readFile(`../data/${server.calendar}.csv`);

        let calendar = await neatCSV(calendarRead, csvHeaders());
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
            return {name: element.clase, value: `*${fecha.format("dddd DD/MM/YYYY")}*`}
        })

        let embed = new Discord.MessageEmbed()
                        .setColor('#f7b9ae')
                        .setTitle('Esta es una lista de las próximas clases')
                        .addFields(calendarFields.slice(0, 5))
        message.channel.send(embed)
        return;
    },
    zoom: async function (message) {
        message.react('🐱');
        message.reply(this.talk())

        let server = checkServer(message, data);

        let embed = new Discord.MessageEmbed()
                        .setColor('#f7b9ae')
                        .setTitle('Estos son los accesos al aula')
                        .setDescription(`Link: ${server.zoom.link}\nPass: ${server.zoom.pass}`)
        message.channel.send(embed)
        return;
    },
    notion: async function (message) {
        message.react('🐱');
        message.reply(this.talk())
        
        let server = checkServer(message, data);
        
        let embed = new Discord.MessageEmbed()
            .setColor('#D1C27D')
            .setTitle('Estos son los links a notion')
            .setDescription(`[General](${server.notion.general})\n[Grupos](${server.notion.grupos})\n[Sprints](${server.notion.sprints})`)
        message.channel.send(embed)
        return;
    },
    off: function (channel, client) {
        channel.send("Apagando...")
            .then(msg => client.destroy());
    },
    help: function(message) {
        message.react('🐱');
        message.reply(this.talk())

        let embed = new Discord.MessageEmbed()
            .setColor('#f7b9ae')
            .setTitle('Aquí va la ayuda')
            .setDescription(`
                Soy una mascota inteligente, por eso puedo entender algunas palabras...
            `)
            .addFields(
                { name: "calendario, calendar", value: "Listado de las próximas clases" },
                { name: "notion", value: "Listado de links de notion" },
                { name: "zoom", value: "Link y password del aula" }
            )
        message.channel.send(embed)
        return;
    }
}