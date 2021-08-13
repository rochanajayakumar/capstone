import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { generateUploadUrl } from '../../datahelpers/todolayers'
import { updateUrl } from '../../datahelpers/todolayers'
const logger = createLogger('generateUpload')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Enter generateUploadUrl")
  const todoId = event.pathParameters.todoId  
  const userId = getUserId(event)
  const attachmentUrl = await generateUploadUrl(todoId)
  logger.info(`Attachment Url: ${attachmentUrl}`);
  await updateUrl(attachmentUrl, todoId, userId)
  logger.info(`Attachment Url 2: ${attachmentUrl}`);
  
  // update attachment url 
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201, 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }, 
    body: JSON.stringify({
      uploadUrl: attachmentUrl
    })
  }
}


