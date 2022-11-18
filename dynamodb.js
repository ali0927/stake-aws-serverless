const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()

const TABLE_MEMBERS = "stake"

const addMember = async (member) => {
  const params = {
    TableName: TABLE_MEMBERS,
    Item: member
  }

  return await dynamoClient.put(params).promise()
}

const getMemberById = async (id) => {
  const params = {
    TableName: TABLE_MEMBERS,
    Key: {
      id
    }
  }
  return await dynamoClient.get(params).promise()
}

const getMembers = async () => {
  const params = {
    TableName: TABLE_MEMBERS
  }

  const members = await dynamoClient.scan(params).promise()
  console.log(members)
  return members
}

const deleteMember = async (id) => {
  const params = {
    TableName: TABLE_MEMBERS,
    Key: {
      id
    }
  }

  return await dynamoClient.delete(params).promise()
}

// sample table entry
const member =
{
  id: "6",
  Name: 'Rainn',
  Surname: 'Scott',
  Gender: 'Male',
  Age: 24
}

//export our functions to be used for our api
module.exports = {
  dynamoClient,
  getMembers,
  addMember,
  getMemberById,
  deleteMember
}
