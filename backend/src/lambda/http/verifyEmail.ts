//const Responses = require('../common/API_Responses');
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { SendTodoRequest } from '../../requests/SendTodoRequest'
var aws = require('aws-sdk')
import { createLogger } from '../../utils/logger'
const logger = createLogger('sendTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Verify Email: ${event.body}`);

    const sendRequest: SendTodoRequest = JSON.parse(event.body)
    const sender = 'rochana.ads@gmail.com'; 
    const recipient = sendRequest.emailId;
    console.log(`Sender: ${sender}, Recipient: ${recipient}`);

    // Create a new SES object. 
    var ses = new aws.SES({
        accessKeyId: 'AKIAZGQ6K54C6DP2J2US',
        secretAccesskey: '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',
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