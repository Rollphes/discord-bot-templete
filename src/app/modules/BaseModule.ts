import { Client } from 'discord-interaction-binder'

export abstract class BaseModule {
  constructor(protected client: Client) {}

  public abstract init(): Promise<void> | void
}
