import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { Provider } from '@boostercloud/framework-provider-aws'

Booster.configure('production', (config: BoosterConfig): void => {
  config.appName = 'twiliosample'
  config.provider = Provider([
    {
      packageName: 'rocket-twilio-aws-infrastructure',
      parameters: {
        accountSid: process.env['TWILIO_SID'],
        accountToken: process.env['TWILIO_TOKEN'],
        fromPhone: process.env['TWILIO_PHONE'],
      },
    },
  ])
})
