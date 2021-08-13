import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
import { getTodos } from '../../datahelpers/todolayers'

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const userId = getUserId(event)
  const result = await getTodos(userId)
  
  logger.info(" user id = ", userId)

  return {
    statusCode: 200, 
    headers: {
      'Access-Control-Allow-Origin': '*'
    }, 
    body: JSON.stringify({
      items: result
    })
  }

}

