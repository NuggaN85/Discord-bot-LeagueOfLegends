const { Client, Intents } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const TOKEN = '<VOTRE_TOKEN_DISCORD>';
const API_KEY = '<votre_api_key>';

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'stats') {
    const player = interaction.options.getString('joueur');

    try {
      const response = await axios.get(`https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${player}`, {
        headers: { 'TRN-Api-Key': API_KEY }
      });

      const { data } = response;

      // Formatez les données de la réponse en utilisant Discord's MessageEmbed ou un simple message textuel
      const statsEmbed = new Discord.MessageEmbed()
        .setTitle(`Statistiques de ${player}`)
        .addField('Kills', data.data.segments[0].stats.kills.value, true)
        .addField('Morts', data.data.segments[0].stats.deaths.value, true)
        .addField('Assists', data.data.segments[0].stats.assists.value, true);

      await interaction.reply({ embeds: [statsEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('Erreur lors de la récupération des statistiques du joueur.');
    }
  }
});

client.login(TOKEN);
