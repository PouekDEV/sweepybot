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
	client.login(tokenn);
});
bot.on('ready', () => {
    // Set bot status to: "Playing with JavaScript"
 bot.setPresence({ game: { name: 'Cleaning servers', type: 0 } });

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
})
client.on("message", (message) => {
if(message.content == "=delchannel" && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
		message.react("✅"); // Call .send() on the channel object the message was sent in
		message.channel.bulkDelete(1);
		message.channel.send(`Deleting channel!`).then(sentMessage => {
    sentMessage.channel.delete(10);
});
}
if(message.content == "=clean1" && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
		message.react("✅"); // Call .send() on the channel object the message was sent in
		message.channel.bulkDelete(1);
		message.channel.send(`Deleted 1 messages!`);
};
if(message.content == "=clean5" && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
		message.react("✅"); // Call .send() on the channel object the message was sent in
		message.channel.bulkDelete(5);
		message.channel.send(`Deleted 5 messages!`);
};
if(message.content == "=clean10" && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
		message.react("✅"); // Call .send() on the channel object the message was sent in
		message.channel.bulkDelete(10);
		message.channel.send(`Deleted 10 messages!`);
};
if(message.content == "=clean50" && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
		message.react("✅"); // Call .send() on the channel object the message was sent in
		message.channel.bulkDelete(50);
		message.channel.send(`Deleted 50 messages!`);
};
if(message.content == "=clean100" && message.member.roles.cache.some(role => role.name === 'Sweepy Boss')){ // Check if content of message is "!ping"
		message.react("✅"); // Call .send() on the channel object the message was sent in
		message.channel.bulkDelete(100);
		message.channel.send(`Deleted 100 messages!`);
};
	
});	
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '=') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // ?ping
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Type clean to clean the messages from 1,5,10,50,100 (example =clean10), Type delchannel to delete entire channel. You need for commands role named Sweepy Boss'
                });
            break;
            // Just add any case commands if you want to..
         }
     }
});