
export class TwilioClient {  
  static async makeCall(toPhone:string, speech: string, voice: string='en', language: string='en-US',) {
    const lambdaRegion = process.env.AWS_REGION
    const appName = process.env.BOOSTER_APP_NAME
    var aws = require('aws-sdk');
    var lambda = new aws.Lambda({
      region: lambdaRegion
    });
    const payload = {
      toPhone: toPhone,
      voice: voice,
      language: language,
      speech: speech
    }
    
    return new Promise((resolve, reject) => lambda.invoke({
      Payload: JSON.stringify(payload),
      FunctionName: `${appName}-make-call-lambda`,
     }, (err:any, result:any) => ((err) ? reject(err) :
      (result.FunctionError) ? reject({ statusCode: 502, body: result.Payload })
       : resolve(result))));
  }
}