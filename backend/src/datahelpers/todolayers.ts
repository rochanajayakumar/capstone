import 'source-map-support/register'
import { createLogger } from '../utils/logger'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const danceClassTable = process.env.DANCE_TABLE
const danceClassBucket = process.env.DANCE_S3_BUCKET
const logger = createLogger('TodosLayer')

export async function createTodos(parsedUserId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const uniqueID = uuid.v4()
  logger.info(`Creating todo id: ${uniqueID} for user id: ${parsedUserId}`)
  logger.info(`danceClassTable: ${danceClassTable}, danceClassBucket: ${danceClassBucket}`)

  const newItem : TodoItem = {
    userId: parsedUserId, 
    todoId: uniqueID,
    classDate: new Date().toISOString(),
    done: false,
    attachmentUrl: null, 
    danceStyle: "test",
    ...createTodoRequest
  }

  logger.info(`Add new item: ${newItem} to table ${danceClassTable}`)

  await docClient.put({
    TableName: danceClassTable, 
    Item: newItem
  }).promise()

  return newItem
}

export async function deleteTodos(todoId: string, userId: string) {

  await docClient.delete({
    TableName: danceClassTable,
    Key: {
      todoId, userId
    }
  }).promise()
}

export async function updateTodos(todoId: string, userId: string, updatedTodo: UpdateTodoRequest) {
  
  await docClient.update({
   TableName: danceClassTable, 
   Key: {
    todoId: todoId, 
    userId: userId
   }, 
   UpdateExpression: 'set #name = :name, classDate = :classDate, done = :done', 
   ExpressionAttributeValues: {
     ':name': updatedTodo.name,
     ':classDate': updatedTodo.classDate,
     ':done': updatedTodo.done
   },
   ExpressionAttributeNames: {
     "#name": "name"
   }
 }).promise()
}

export async function getTodos(userId: string) : Promise<TodoItem[]> {
    // TODO: Get all TODO items for a current user

 logger.info(" user id = ", userId)

 const newItem = await docClient.query({
   TableName: danceClassTable,
   KeyConditionExpression: 'userId = :userId',
   ExpressionAttributeValues: {
     ':userId': userId
   }
 }).promise()

 const result = newItem.Items

 return result as TodoItem[]
}

export async function generateUploadUrl(id: string) :Promise<string> {
  const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })

  const attachmentUrl = s3.getSignedUrl('putObject',{
    Bucket: danceClassBucket, 
    Key: id,
    Expires: 30000
  })
  logger.info(`Signed Url: ${attachmentUrl}`)
  return attachmentUrl
}

export async function updateUrl(attachmentUrl: string, todoId: string ,userId: string) {
  logger.info(`update url, attachmentUrl: ${attachmentUrl}`);
  await docClient.update({
    TableName: danceClassTable, 
    Key: {
      todoId, userId
    }, 
    UpdateExpression: "set attachmentUrl = :attachmentUrl", 
    ExpressionAttributeValues: {
      ":attachmentUrl": `https://${danceClassBucket}.s3.amazonaws.com/${todoId}`
    }
  }).promise()
}


