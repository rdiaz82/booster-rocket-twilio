import { Stack } from "@aws-cdk/core";
import { RocketUtils } from "@boostercloud/framework-provider-aws-infrastructure";
import { TwilioParams } from "./types";
import { BoosterConfig } from "@boostercloud/framework-types";
import { CdkWrapper } from "./cdk-wrapper";

export class TwilioStack {
  public static mountStack(params: TwilioParams, stack: Stack, config: BoosterConfig): void {
    const webhookUrl = CdkWrapper.createTwilioWebhook(stack, config)
    CdkWrapper.createCallLambda(stack, params, webhookUrl, config)
    CdkWrapper.configureBoosterLambdasToBeCompatible(stack, config)
  }

  public static async unmountStack(params: TwilioParams, utils: RocketUtils): Promise<void> {}
}