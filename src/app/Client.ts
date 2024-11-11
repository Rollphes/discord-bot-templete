import { Client as OriginClient, ClientOptions } from 'discord.js'
import { InteractionManager } from 'discord-interaction-binder'

import { ModuleManager } from '@/utils/ModuleManager'
export class Client extends OriginClient {
  constructor(options: ClientOptions) {
    super(options)
    this.interactions = new InteractionManager(this)
    this.modules = new ModuleManager(this)
  }
}
