import { Command } from '@boostercloud/framework-core'
import { Register, UUID } from '@boostercloud/framework-types'
import { TwilioClient } from 'rocket-twilio-aws-runtime'
import { CallLaunched } from '../events/call-launched'

@Command({
  authorize: 'all'
})
export class MakeCall {
  public constructor(
    readonly callId: UUID,
    readonly toPhone: string,
    readonly message: string,
  ) {}

  public static async handle(command: MakeCall , register: Register): Promise<void> {
    const response = await TwilioClient.makeCall(command.toPhone, command.message, 'Polly.Enrique', 'es')
    console.log(response)
    register.events( new CallLaunched(command.callId,command.toPhone, command.message))
  }
}
