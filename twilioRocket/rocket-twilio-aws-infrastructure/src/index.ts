import { InfrastructureRocket } from '@boostercloud/framework-provider-aws-infrastructure'
import { TwilioStack} from './twilio'
import { TwilioParams } from './types'

const TwilioRocket = (params: TwilioParams): InfrastructureRocket => ({
  mountStack: TwilioStack.mountStack.bind(null, params),
  unmountStack: TwilioStack.unmountStack.bind(null, params),
})

export default TwilioRocket
