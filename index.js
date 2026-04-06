const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Enregistrement des commandes slash
const commands = [
    new SlashCommandBuilder()
        .setName('accept')
        .setDescription('Accepte la candidature d\'un membre')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à accepter')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('refuse')
        .setDescription('Refuse la candidature d\'un membre')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à refuser')
                .setRequired(true)),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

client.once('ready', async () => {
    console.log(`Connecté en tant que ${client.user.tag}`);

    // Enregistre les commandes
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Commandes slash enregistrées.');

    // Message d'accès au questionnaire
    const channel = client.channels.cache.get("1490405403979415784");
    if (!channel) return console.log("Salon introuvable");

    const embed = new EmbedBuilder()
        .setColor(0x00AEFF)
        .setTitle("Accès 10NITE Faction")
        .setDescription("Pour accéder au serveur Discord de la 10NITE Faction, clique sur le bouton ci-dessous 👇");

    const button = new ButtonBuilder()
        .setLabel("Accéder au questionnaire")
        .setStyle(ButtonStyle.Link)
        .setURL("https://alexgameralexgamer7-web.github.io/Site-Web-10NITE-Faction/");

    const row = new ActionRowBuilder().addComponents(button);

    channel.send({ embeds: [embed], components: [row] });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const membre = interaction.options.getUser('membre');
    const salon = interaction.guild.channels.cache.find(c => c.name === '📜・résultat-candidature' || c.name === 'résultat-candidature');

    if (!salon) {
        return interaction.reply({ content: '❌ Salon résultat-candidature introuvable.', ephemeral: true });
    }

    if (interaction.commandName === 'accept') {
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setAuthor({ name: 'Résultat Candidature', iconURL: interaction.guild.iconURL() })
            .setTitle('Candidature Validée ✅')
            .setDescription('Ta candidature a été retenue, félicitation !\nBonne continuation dans la 10NITE Faction')
            .setThumbnail('https://alexgameralexgamer7-web.github.io/Site-Web-10NITE-Faction/logo.png')
            .setTimestamp();

        await salon.send({ content: `${membre}`, embeds: [embed] });
        await interaction.reply({ content: `✅ Candidature de ${membre} acceptée !`, ephemeral: true });
    }

    if (interaction.commandName === 'refuse') {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setAuthor({ name: 'Résultat Candidature', iconURL: interaction.guild.iconURL() })
            .setTitle('Candidature Refusée ❌')
            .setDescription('Ta candidature n\'a malheureusement pas été retenue.\nNous te souhaitons bonne chance pour la suite !')
            .setThumbnail('https://alexgameralexgamer7-web.github.io/Site-Web-10NITE-Faction/logo.png')
            .setTimestamp();

        await salon.send({ content: `${membre}`, embeds: [embed] });
        await interaction.reply({ content: `❌ Candidature de ${membre} refusée.`, ephemeral: true });
    }
});

client.login(TOKEN);
