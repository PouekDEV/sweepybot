require('dotenv').config()
const { REST, Routes } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;
const commands = [
  {
    name: 'ping',
    description: 'Replies with the ping of the bot',
  },
  {
    name: 'help',
    description: 'Replies with the list of commands'
  },
  {
    name: 'setup',
    description: 'Setups the bot for use in the server'
  },
  {
    name: 'clean',
    description: 'cleans messages',
    options: [
      {
        required: true,
        type: 4,
        name: 'amount',
        description: 'Amount of messages to delete'
      }
    ],
  }
];
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(client_id), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
client.on('ready', () => {
    client.user.setPresence({ activities: [{ name: '/help | Slash commands are live' }], status: 'online', type: 'PLAYING'});
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "ping") {
      await interaction.reply({ content: "Pong: " + Math.round(client.ws.ping) + " ms", ephemeral: true });
    }
    if(interaction.commandName === "help") {
        await interaction.reply({ content: "Type /clean [number] to clean the messages (example /clean 10). Before using bot you need to type /setup for bot to working properly (adds a role named Sweepy Boss that you need to execute commands)\n Type /ping to get my ping", ephemeral: true });
    }
    if(interaction.commandName === "setup" && interaction.member.roles.cache.find(role => role.name === "Sweepy Boss")){
        await interaction.reply({ content: "The setup has been arleady done!", ephemeral: true });
    }
    if(interaction.commandName === "setup" && !interaction.member.permissions.has('ADMINISTRATOR')){
        await interaction.reply({ content: "You don't have permissions to do that!", ephemeral: true });
    }
    if(interaction.commandName === "setup" && interaction.member.permissions.has('ADMINISTRATOR') && !interaction.member.roles.cache.find(role => role.name === "Sweepy Boss")){
        await interaction.guild.roles.create({
            name: 'Sweepy Boss',
            reason: 'For setup',
        }).catch(console.error);
        var role = interaction.guild.roles.cache.find(role => role.name === "Sweepy Boss");
        await interaction.member.roles.add(role).catch(err => console.log(err));
        await interaction.reply({ content: "Setup is done!", ephemeral: true });
    }
    if(interaction.commandName === "clean" && interaction.member.roles.cache.some(role => role.name === "Sweepy Boss")){
        var array = interaction.options.getInteger("amount");
        if(array < 101){
			await interaction.channel.bulkDelete(array).catch(err => console.log(err));
		    await interaction.reply({ content: "Deleted " + array + " messages!", ephemeral: true });
        }
        else{
            await interaction.reply({ content: "Cant delete more than 100", ephemeral: true });
        }
    }
    if(interaction.commandName === "clean" && !interaction.member.roles.cache.some(role => role.name === "Sweepy Boss")){
        interaction.reply({ content: "You don't have permission to delete messages!", ephemeral: true });
    }
});

client.login(token);