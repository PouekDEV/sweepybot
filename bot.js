var Discord2 = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "=";
var tokenn = ("NzI1NjI5MzM3MDQ2NjE0MDI3.XvRiOA.BhTNsW-cYjzD7dXMl0mmX6I3lEk");
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord2.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('ready', () => {
    // Set bot status to: "Playing with JavaScript"
		client.login(tokenn);

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
})
client.once('ready', () => {
	 bot.setPresence({ game: { name: '=help', type: 0 } });
	 console.log("we are in");
})
client.on("message", (message) => {
if(message.content.startsWith("=clean") && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
let array = message.content.split(' ').slice(1).join(' ');
if(array < 101){
			message.channel.bulkDelete(array).catch(err => console.log(err));
		message.channel.send('Deleted ' + array + ' messages!');
}
else{
	message.channel.send('Cant delete more than 100');
}
};
if(message.content == "=help"){ // Check if content of message is "!ping"
		message.channel.send(`Type clean [number] to clean the messages (example =clean 10). Before using bot you need to type =setup for bot to working properly (adds a role named Sweepy Boss that you need to execute commands).`);
};
if(message.content == "=setup" && message.member.hasPermission('ADMINISTRATOR') && !message.member.roles.cache.find(role => role.name === "Sweepy Boss")){ // Check if content of message is "!ping"
message.guild.roles.create({
  data: {
    name: 'Sweepy Boss',
    color: 'GREY',
  },
  reason: 'For setup',
})
  .then(console.log)
  .catch(console.error);
  		message.channel.send(`Please type now =finish`);
};
if(message.content == "=finish" && message.member.hasPermission('ADMINISTRATOR')){
		var role = message.guild.roles.cache.find(role => role.name === "Sweepy Boss");
	message.member.roles.add(role).catch(err => console.log(err));
	message.channel.send(`Setup has been completed!`);
}
	
});	