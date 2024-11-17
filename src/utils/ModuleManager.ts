import { Client } from 'discord-interaction-binder'
import fs from 'fs'
import { join, relative } from 'path'

import { BaseModule } from '@/app/modules/BaseModule'

type NodeModule = {
  default?: new (client: Client) => BaseModule
}

export class ModuleManager {
  private modules: Map<string, BaseModule> = new Map()

  constructor(private client: Client) {}

  public async init(modulesPath: string): Promise<void> {
    console.log('-- Initializing modules --')
    const moduleFiles = fs
      .readdirSync(modulesPath)
      .filter((file) => file.endsWith('.ts') && file !== 'BaseModule.ts')

    await Promise.all(
      moduleFiles.map(async (file) => {
        const filePath = relative(process.cwd(), join(modulesPath, file))
        try {
          const module = (await import(filePath)) as NodeModule
          const content = fs.readFileSync(filePath)
          const regex =
            /export\s+default\s+class\s+[\s\S]*?\s+extends\s+BaseModule/
          if (module.default) {
            if (!regex.test(content.toString())) {
              throw new Error(
                `Module in ${filePath} does not satisfy BaseModule`,
              )
            }

            const moduleName = module.default.name
            this.modules.set(moduleName, new module.default(this.client))
            await this.modules.get(moduleName)?.init()
            console.log('✅️ :', moduleName)
          } else {
            throw new Error(
              `Module in ${filePath} does not have a valid default export`,
            )
          }
        } catch (e) {
          console.error('❌ :', filePath)
          throw e
        }
      }),
    )
  }

  public getModule<T extends BaseModule>(name: string): T | undefined {
    return this.modules.get(name) as T | undefined
  }
}
