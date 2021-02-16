exports.handler = async function(event:any): Promise<any> {
  var speech = event['queryStringParameters']['speech']
  var voice = event['queryStringParameters']['voice']
  var language = event['queryStringParameters']['language']
  
  var builder = require('xmlbuilder')
  var doc = builder.create('Response')
  doc.ele('Say')
      .att('voice', voice)
      .att('language', language)
      .txt(speech);
  return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: doc.toString({ pretty: true })
  };
};