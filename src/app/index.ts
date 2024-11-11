import { ClientOptions, DiscordAPIError, HTTPError } from 'discord.js'
import { join } from 'path'

import { Client } from '@/app/Client'
import { env } from '@/utils/env'
import { loadCommands } from '@/utils/loadCommands'

const options: ClientOptions = {
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildMessageReactions',
    'GuildMembers',
    'GuildVoiceStates',
    'GuildIntegrations',
    'GuildEmojisAndStickers',
    'MessageContent',
  ],
  waitGuildTimeout: 60000,
  rest: { timeout: 60000 },
}
const client = new Client(options)
client.on('ready', () => {
  void (async (): Promise<void> => {
    console.log('--- Bot is ready ---')
    await loadCommands(client, join(__dirname, 'commands'), env.GUILD_ID)
    await client.modules.init(join(__dirname, 'modules'))
    console.log('--  Bot successfully started --')
  })()
})
client.on('interactionCreate', (interaction) => {
  void (async (): Promise<void> => {
    try {
      await client.interactions.execute(interaction)
    } catch (err) {
      if (
        !(err instanceof HTTPError && err.message === 'Service Unavailable') &&
        !(
          err instanceof DiscordAPIError &&
          err.message === 'Unknown interaction'
        )
      )
        throw err
      console.error(err)
    }
  })()
})
void client.login(env.BOT_TOKEN)
