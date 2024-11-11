import { ApplicationCommandData } from 'discord-interaction-binder'
import fs from 'fs'
import { join, relative } from 'path'

import { Client } from '@/app/Client'

type NodeModule = {
  default?: ApplicationCommandData
}

export async function loadCommands(
  client: Client,
  commandsPath: string,
  guildId?: string,
): Promise<void> {
  console.log('-- Loading commands --')
  if (!client.application?.owner) await client.application?.fetch()
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts'))

  await Promise.all(
    commandFiles.map(async (file) => {
      const filePath = relative(process.cwd(), join(commandsPath, file))
      try {
        const commandModule = (await import(filePath)) as NodeModule
        const content = fs.readFileSync(filePath)
        const regex =
          /export\s+default\s+\{[\s\S]*?\}\s+satisfies\s+(ApplicationCommandData|UserApplicationCommandData|MessageApplicationCommandData|ChatInputApplicationCommandData)/
        if (commandModule.default) {
          if (!regex.test(content.toString())) {
            throw new Error(
              `Command in ${filePath} does not satisfy ApplicationCommandData`,
            )
          }
          if (!('execute' in commandModule.default)) {
            throw new Error(
              `Command in ${filePath} does not have a valid execute function`,
            )
          }
          await client.interactions.setCommands(
            [commandModule.default],
            guildId,
          )
          console.log('✅️ :', commandModule.default.name)
        } else {
          throw new Error(
            `Command in ${filePath} does not have a valid default export`,
          )
        }
      } catch (e) {
        console.error('❌ :', filePath)
        throw e
      }
    }),
  )
}
