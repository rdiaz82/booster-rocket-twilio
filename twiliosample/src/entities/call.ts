import { Entity, Reduces } from '@boostercloud/framework-core'
import { UUID } from '@boostercloud/framework-types'
import { CallLaunched } from '../events/call-launched'

@Entity
export class Call {
  public constructor(
    public id: UUID,
    readonly toPhone: string,
    readonly message: string,
  ) {}

  @Reduces(CallLaunched)
  public static reduceCallLaunched(event: CallLaunched, currentCall?: Call): Call {
    return new Call(event.callId, event.toPhone, event.message)
  }

}
