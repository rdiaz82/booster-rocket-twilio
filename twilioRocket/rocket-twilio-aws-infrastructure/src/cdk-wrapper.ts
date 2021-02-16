import { Duration, Stack} from "@aws-cdk/core";
import { ServicePrincipal, PolicyStatement } from '@aws-cdk/aws-iam'
import { RestApi, LambdaIntegration, AuthorizationType } from '@aws-cdk/aws-apigateway'
import { Cors } from '@aws-cdk/aws-apigateway/lib/cors'
import { BoosterConfig } from "@boostercloud/framework-types";
import { Code, Runtime, Function } from "@aws-cdk/aws-lambda";
import path from "path";
import { TwilioParams } from "./types";

export class CdkWrapper {
  static createTwilioWebhook(stack: Stack,  config: BoosterConfig): string {
    const webhookLambdaName = `${config.appName}-make-call-webhook-lambda`
    const webhookAPI = new RestApi(stack, config.resourceNames.applicationStack + '-twilio-webhooks', {
      deployOptions: { stageName: config.environmentName },
    })
    
    const webhookLambda = new Function(stack, webhookLambdaName, {
      runtime: Runtime.NODEJS_12_X,
      functionName: webhookLambdaName,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', "webhookLambda.zip")),
    })

    webhookLambda.addPermission(`${webhookLambdaName}-permission`, {
      principal: new ServicePrincipal('apigateway.amazonaws.com'),
    })

    webhookAPI.root
      .addResource('makeCall', {
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
        },
      })
      .addMethod('GET', new LambdaIntegration(webhookLambda), {
        authorizationType: AuthorizationType.NONE,
      })
      return webhookAPI.url
  }

  static createCallLambda(stack: Stack, twilioConfig:TwilioParams, webHookUrl:string,  config: BoosterConfig) {
    const makeCallLambda = `${config.appName}-make-call-lambda`
    
    const webhookLambda = new Function(stack, makeCallLambda, {
      runtime: Runtime.NODEJS_12_X,
      functionName: makeCallLambda,
      handler: 'index.handler',
      timeout: Duration.seconds(60),
      environment: {
        accountSid: twilioConfig.accountSid,
        accountToken: twilioConfig.accountToken,
        fromPhone: twilioConfig.fromPhone,
        webhookUrl: `${webHookUrl}makeCall`
      },
      code: Code.fromAsset(path.join(__dirname, 'lambdas', "makeCallLambda.zip")),
    })

    webhookLambda.addPermission(`${makeCallLambda}-permission`, {
      principal: new ServicePrincipal('lambda.amazonaws.com'),
    })
  }

  
  static configureBoosterLambdasToBeCompatible(stack: Stack, config: BoosterConfig) {
    const statement = new PolicyStatement();
    statement.addActions("lambda:InvokeFunction");
    statement.addResources("*");

    const eventsHandlerLambda = stack.node.tryFindChild('events-main') as Function
    eventsHandlerLambda.addToRolePolicy(statement)
    eventsHandlerLambda.addEnvironment('BOOSTER_APP_NAME', config.appName)
    const graphqlHandlerLambda = stack.node.tryFindChild('graphql-handler') as Function
    graphqlHandlerLambda.addToRolePolicy(statement)
    graphqlHandlerLambda.addEnvironment('BOOSTER_APP_NAME', config.appName)

  }
}