let fs = require('fs');
let path = require('path');

module.exports = {
    csvHeaders: () => ["curso","comision","estadoComision","modulo","clase","sede","fecha","profesor","ayudante","especialista","estadoExpositor","estadoClase","presentes","expositor1","rol1","expositor2","rol2","expositor3","rol3"],
    readFile: (url) => fs.readFileSync(path.join(__dirname, url), 'utf8'),
    words: (message, array) => {
        let check = 0;
        for (let element of array) {
            if (message.content.toLowerCase().includes(element)) {
                check++
            }
        }

        return check > 0
    },
    checkServer: (message, servers) => {
        let [selected] = servers.filter(server => {
            return message.channel.guild.name === server.name;
        })
        return selected;
    },

}