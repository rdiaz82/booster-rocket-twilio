import { Event } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'

@Event
export class CallLaunched {
  public constructor(
    readonly callId: UUID,
    readonly toPhone: string,
    readonly message: string,
  ) {}

  public entityID(): UUID {
    return this.callId
  }
}
