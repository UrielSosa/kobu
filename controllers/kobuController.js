let neatCSV = require('neat-csv');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let helpers = require('./helpers');
let Discord = require('discord.js');

module.exports = {
    talk: function() {
        let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/quotes.json'), 'utf8'));
        return data.punch[Math.floor(Math.random() * data.punch.length)]
    },
    calendar: async function (message) {
        message.react('🐱');
        let data = fs.readFileSync(path.join(__dirname, '../data/22ared.csv'));
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
            return {name: element.clase, value: `*${fecha.format("dddd DD/MM/YYYY")}*`}
        })
        let embed = new Discord.MessageEmbed()
                        .setColor('#f7b9ae')
                        .setTitle('Esta es una lista de las próximas clases')
                        .addFields(calendarFields.slice(0, 5))
        message.reply(this.talk())
        message.channel.send(embed)
        return;
    },
    zoom: async function (message) {
        message.react('🐱');
        let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/general.json'), 'utf8'));
        let embed = new Discord.MessageEmbed()
                        .setColor('#f7b9ae')
                        .setTitle('Estos son los accesos al aula')
                        .setDescription(`Link: ${data.zoom.link}\nPass: ${data.zoom.pass}`)
        message.reply(this.talk())
        message.channel.send(embed)
        return;
    },
    help: function(message) {
        message.react('🐱');
        let embed = new Discord.MessageEmbed()
            .setColor('#f7b9ae')
            .setTitle('Aquí va la ayuda')
            .setDescription(`
                Soy una mascota inteligente, por eso puedo entender algunas palabras...
            `)
            .addFields(
                {name: "calendario, calendar", value: "Listado de las próximas clases"},
                {name: "zoom", value: "Link y password del aula"}
            )
        message.reply(this.talk())
        message.channel.send(embed)
        return;
    }
}