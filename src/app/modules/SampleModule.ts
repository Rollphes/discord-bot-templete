import { BaseModule } from '@/app/modules/BaseModule'
export default class SampleModule extends BaseModule {
  public async init(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0))
    console.log('SampleModule initialized')
  }
}
