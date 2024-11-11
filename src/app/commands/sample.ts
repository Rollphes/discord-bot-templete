import { ChannelType } from 'discord.js'
import { ApplicationCommandData } from 'discord-interaction-binder'

export default {
  name: 'sample',
  description: 'this sample command',
  options: [],
  execute: async (interaction): Promise<void> => {
    if (
      !interaction.channel ||
      interaction.channel.type === ChannelType.GroupDM
    )
      return
    await interaction.deferReply({ ephemeral: true })
    await interaction.editReply('hello!!')
  },
} satisfies ApplicationCommandData
