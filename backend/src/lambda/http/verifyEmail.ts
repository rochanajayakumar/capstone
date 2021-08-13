//const Responses = require('../common/API_Responses');
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { SendTodoRequest } from '../../requests/SendTodoRequest'
var aws = require('aws-sdk')
import { createLogger } from '../../utils/logger'
const logger = createLogger('sendTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Verify: ${event.body}`);

    const sendRequest: SendTodoRequest = JSON.parse(event.body)
    const sender = 'rochana.ads@gmail.com'; 
    const recipient = sendRequest.emailId;
    console.log(`Sender: ${sender}, Recipient: ${recipient}`);

    // Create a new SES object. 
    var ses = new aws.SES({
        accessKeyId: 'XXXXXXXXX',
        secretAccesskey: 'XXXXXXX',
        region: 'us-east-1' 
     });

    await ses.verifyEmailIdentity({EmailAddress: sender}).promise(); 
    await ses.verifyEmailIdentity({EmailAddress: recipient}).promise(); 

    return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
        })
      }
};