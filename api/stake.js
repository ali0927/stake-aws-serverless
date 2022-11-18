const express = require('express')
const AWS = require('aws-sdk')
const { getAP } = require('../utils/handleContract')
require('dotenv').config()

AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY
})

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const router = express.Router();
router.use(express.json())

router.get('/', async (req, res) => {
  try {
    const params = {
      TableName: "stake"
    }
    const stakeInfo = await dynamoClient.scan(params).promise()
    res.json(stakeInfo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for adding a new entry in the table
router.post('/', async (req, res) => {
  try {
    const AP = await getAP(req.body.address)
    const params = {
      TableName: "stake",
      Item: { ...req.body, "AP": AP }
    }
    const newInfo = await dynamoClient.put(params).promise()
    res.json(newInfo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for updating an existing entry in the table
router.put('/:address', async (req, res) => {
  const stakeInfo = req.body
  const { address } = req.params
  stakeInfo.address = address
  try {
    const AP = await getAP(req.body.address)
    const params = {
      TableName: "stake",
      Item: { ...stakeInfo, "AP": AP }
    }
    const updateInfo = await dynamoClient.put(params).promise()
    res.json(updateInfo)
  } catch (error) {
    console.error(err)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for deleting an entry in the table
router.delete('/:address', async (req, res) => {
  const { address } = req.params
  try {
    const params = {
      TableName: "stake",
      Key: {
        address
      }
    }

    const deletedMember = await dynamoClient.delete(params).promise()
    res.json(deletedMember)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for retrieving a table entry by id
router.get('/stakeinfo/:address', async (req, res) => {
  const { address } = req.params
  try {
    const params = {
      TableName: "stake",
      Key: {
        address
      }
    }
    const stakeInfo = await dynamoClient.get(params).promise()
    res.json(stakeInfo)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for retrieving total locked amount
router.get('/totalamount', async (req, res) => {
  try {
    const stakeInfo = await dynamoClient.scan({ TableName: "stake" }).promise()
    const tlamount = stakeInfo.Items.reduce((tla, item) => {
      return tla + item.amount
    }, 0)
    res.json(tlamount)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for retrieving total aqulais power
router.get('/totalap', async (req, res) => {
  try {
    const stakeInfo = await dynamoClient.scan({ TableName: "stake" }).promise()
    const tapower = stakeInfo.Items.reduce((tap, item) => {
      return tap + item.AP
    }, 0)
    res.json(tapower)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})

// api endpoint for retrieving average locked weeks
router.get('/averagelockedweeks', async (req, res) => {
  try {
    const stakeInfo = await dynamoClient.scan({ TableName: "stake" }).promise()
    const tltime = stakeInfo.Items.reduce((tlt, item) => {
      return tlt + item.weeks
    }, 0)
    res.json(tltime / stakeInfo.Items.length)
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: "Something went wrong" })
  }
})



module.exports = router
