//const Responses = require('../common/API_Responses');
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { SendTodoRequest } from '../../requests/SendTodoRequest'
var aws = require('aws-sdk')
import { createLogger } from '../../utils/logger'
const logger = createLogger('sendTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('event', event);
    logger.info(`Event: ${event.body}`);

    const sendRequest: SendTodoRequest = JSON.parse(event.body)
    const sender = 'rochana.ads@gmail.com'; 
    const recipient = sendRequest.emailId;
    console.log(`Sender: ${sender}, Recipient: ${recipient}`);

    // Specify a configuration set. If you do not want to use a configuration
    // set, comment the following variable, and the 
    // ConfigurationSetName : configuration_set argument below.
    //const configuration_set = "ConfigSet";

    // The subject line for the email.
    const subject = "Rochana's Dance Academy";

    // The email body for recipients with non-HTML email clients.
    const body_text = "ROCHANA'S DANCE ACADEMY\r\n"

                
    // The HTML body of the email.
    const body_html = `<html>
    <head></head>
    <body>
    <h1>An academy geared towards teaching students of all ages various dance styles originating from India</h1>
    <h2>Be sure to check our facebook page at ...</h2>
    <h2>Be sure to follow us on Instagram for all of our latest videos...</h2>
    <p>This email was sent with
        <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
        <a href='https://aws.amazon.com/sdk-for-node-js/'>
        AWS SDK for JavaScript in Node.js</a>.</p>
    </body>
    </html>`;

    // The character encoding for the email.
    const charset = "UTF-8";

    // Create a new SES object. 
    var ses = new aws.SES({
        accessKeyId: 'XXXXXXXXX',
        secretAccesskey: 'XXXXXXX',
        region: 'us-east-1' 
     });

     await ses.verifyEmailIdentity({EmailAddress: sender}).promise(); 
     await ses.verifyEmailIdentity({EmailAddress: recipient}).promise(); 

    // Specify the parameters to pass to the API.
    var params = { 
        Source: sender, 
        Destination: { 
            ToAddresses: [
            recipient 
            ],
        },
        Message: {
            Subject: {
            Data: subject,
            Charset: charset
            },
            Body: {
            Text: {
                Data: body_text,
                Charset: charset 
            },
            Html: {
                Data: body_html,
                Charset: charset
            }
            }
        },
    //ConfigurationSetName: configuration_set
    };

    //Try to send the email.
    logger.info("Try to send email");
    await ses.sendEmail(params, function(err, data) {
    // If something goes wrong, print an error message.
        if(err) {
            logger.info(`Email not sent: ${err.message}`);
            return {
                statusCode: 400,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({
                })
              }
        } else {
            logger.info("Email sent! Message ID: ", data.MessageId);

        }
    }).promise();

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