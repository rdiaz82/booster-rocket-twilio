
exports.handler = async function(event:any): Promise<any> {
  const accountSid = process.env['accountSid'] ||''
  const authToken = process.env['accountToken'] ||''
  const fromPhone = process.env['fromPhone'] ||''
  const webhookUrl = process.env['webhookUrl'] ||''

  const voice = event['voice'] || 'Alice'
  const language = event['language'] || 'en'
  const speech  = event['speech'] || 'bye'
  const toPhone = event['toPhone'] || ''
  
  const client = require('twilio')(accountSid, authToken);

  await client.calls
        .create({
          url: `${webhookUrl}?voice=${voice}&language=${language}&speech=${encodeURI(speech)}`,
          method:'GET',
          to: toPhone,
          from: fromPhone
        })
        .then((call: { sid: any; }) => console.log(call.sid))
        .catch((err: any) => console.log(err))
  return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: "ok"
  }
};