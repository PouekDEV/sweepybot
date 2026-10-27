require('dotenv').config();
const { REST, Routes, Client, GatewayIntentBits, MessageFlags } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;
const topgg_token = process.env.TOP_GG_TOKEN;
const topgg_interval = 30 * 60 * 1000;

const commands = [
    {
        name: "ping",
        description: "Replies with the ping of the bot"
    },
    {
        name: "help",
        description: "Replies with the list of commands"
    },
    {
        name: "setup",
        description: "Setups the bot for use in the server"
    },
    {
        name: "clean",
        description: "Deletes messages",
        options: [
            {
                required: true,
                type: 4,
                name: "amount",
                description: "Amount of messages to delete"
            }
        ]
    }
];

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        await rest.put(Routes.applicationCommands(client_id), { body: commands });
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

client.on("clientReady", () => {
    client.user?.setPresence({ activities: [{ name: "/help" }], status: "online", type: "PLAYING"});
    console.log(`Logged in as ${client.user?.tag}!`);
    if (!topgg_token) {
        console.warn("TOP_GG_TOKEN is not set; Top.gg stats will not be posted.");
        return;
    }

    const postStats = async () => {
        const response = await fetch(`https://top.gg/api/bots/${client_id}/stats`, {
            method: "POST",
            headers: {
                Authorization: topgg_token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ server_count: client.guilds.cache.size })
        });

        if (!response.ok) {
            throw new Error(`Top.gg stats request failed with HTTP ${response.status}`);
        }

        console.log(`Posted stats to Top.gg | ${client.guilds.cache.size} servers`);
    };

    const postStatsSafely = () => postStats().catch(console.error);
    postStatsSafely();
    setInterval(postStatsSafely, topgg_interval);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "ping") {
        await interaction.reply({ content: "Pong: " + Math.round(client.ws.ping) + " ms", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "help") {
        await interaction.reply({ content: "** Before using the bot you need to type `/setup` for bot to work properly (adds a role named Sweepy Boss that you need to execute commands) **\n - Type `/clean` [number] to remove messages (example `/clean 10`).\n - Type `/ping` to get my ping", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "setup" && interaction.member?.roles.cache.find(role => role.name === "Sweepy Boss")) {
        await interaction.reply({ content: "The setup has been already done!", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "setup" && !interaction.member?.permissions.has('ADMINISTRATOR')) {
        await interaction.reply({ content: "You don't have permissions to do that!", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "setup" && interaction.member?.permissions.has('ADMINISTRATOR') && !interaction.member.roles.cache.find(role => role.name === "Sweepy Boss")) {
        await interaction.guild?.roles.create({
            name: "Sweepy Boss",
            reason: "For setup",
        }).catch(console.error);
        var role = interaction.guild?.roles.cache.find(role => role.name === "Sweepy Boss");
        await interaction.member.roles.add(role).catch(err => console.log(err));
        await interaction.reply({ content: "Setup finished!", flags: MessageFlags.Ephemeral });
    }
    if (interaction.commandName === "clean" && interaction.member?.roles.cache.some(role => role.name === "Sweepy Boss")) {
        var array = interaction.options.getInteger("amount");
        var failed = false;
        if (array < 101) {
            await interaction.channel?.bulkDelete(array).catch(async err => {
                console.log(err);
                await interaction.reply({ content: "You can only bulk delete messages that are under 14 days old", flags: MessageFlags.Ephemeral });
                failed = true;
            });
            if (!failed) {
                await interaction.reply({ content: "Deleted " + array + " message(s)!", flags: MessageFlags.Ephemeral });
            }
        }
        else {
            await interaction.reply({ content: "Can't delete more than 100", flags: MessageFlags.Ephemeral });
        }
    }
    if (interaction.commandName === "clean" && !interaction.member?.roles.cache.some(role => role.name === "Sweepy Boss")) {
        if (!interaction.guild?.roles.cache.some(role => role.name === "Sweepy Boss")) {
            await interaction.reply({ content: "The bot is not setup yet! Please ask an admin to run `/setup`", flags: MessageFlags.Ephemeral });
        }
        else {
            await interaction.reply({ content: "You don't have permissions to delete messages!", flags: MessageFlags.Ephemeral });
        }
    }
});

client.login(token);