'use strict';

const AWS = require('aws-sdk')
require('dotenv').config()
const { getAP } = require('./utils/handleContract')

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()

module.exports.hello = async (event, context, callback) => {
  console.log('Hello world')
  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
    body: 'Hello World'
  })
};
module.exports.create = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  console.log(event.body)
  try {
    event = JSON.parse(event.body)
    const AP = await getAP(event.address)
    const params = {
      TableName: "stake",
      Item: { ...event, "AP": AP }
    }
    const newInfo = await dynamoClient.put(params).promise()
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify(newInfo)
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.update = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  try {
    const { address } = event.pathParameters
    event = JSON.parse(event.body)
    const AP = await getAP(address)
    event['AP'] = AP
    let updateExpression = 'set'
    let expressionAttributeValues = {}
    let expressionAttributeNames = {}
    for (const property in event) {
      updateExpression += ` #${property} = :${property},`
      expressionAttributeValues[`:${property}`] = event[property]
      expressionAttributeNames[`#${property}`] = property
    }
    const params = {
      TableName: "stake",
      Key: { 'address': address },
      UpdateExpression: updateExpression.slice(0, -1),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }
    const updateInfo = await dynamoClient.update(params).promise()
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify(updateInfo)
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.getOne = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const { address } = event.pathParameters
  try {
    const params = {
      TableName: "stake",
      Key: {
        address
      }
    }
    const stakeInfo = await dynamoClient.get(params).promise()
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify(stakeInfo)
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.getAll = async (event, context, callback) => {
  try {
    const params = {
      TableName: "stake"
    }
    const stakeInfo = await dynamoClient.scan(params).promise()
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify(stakeInfo)
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.delete = async (event, context, callback) => {
  const { address } = event.pathParameters
  try {
    const params = {
      TableName: "stake",
      Key: {
        address
      }
    }
    const deletedMember = await dynamoClient.delete(params).promise()
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify(deletedMember)
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.getTotalAmount = async (event, context, callback) => {
  try {
    const stakeInfo = await dynamoClient.scan({ TableName: "stake" }).promise()
    const tlamount = stakeInfo.Items.reduce((tla, item) => {
      return tla + item.amount
    }, 0)
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: tlamount
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.getTotalAP = async (event, context, callback) => {
  try {
    const stakeInfo = await dynamoClient.scan({ TableName: "stake" }).promise()
    const tapower = stakeInfo.Items.reduce((tap, item) => {
      return tap + item.AP
    }, 0)
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: tapower
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}
module.exports.getAverageLockedWeeks = async (event, context, callback) => {
  try {
    const stakeInfo = await dynamoClient.scan({ TableName: "stake" }).promise()
    const tltime = stakeInfo.Items.reduce((tlt, item) => {
      return tlt + item.weeks
    }, 0)
    callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: tltime / stakeInfo.Items.length
    })
  } catch (error) {
    callback(null, {
      statusCode: error.statusCode || 500,
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Content-Type': 'text/plain'
      },
      body: JSON.stringify(error)
    })
  }
}