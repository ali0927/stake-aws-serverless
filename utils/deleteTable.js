require('dotenv').config();
const {
    DynamoDBClient,
    DeleteTableCommand
} = require('@aws-sdk/client-dynamodb');


const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.REGION
})
client.send(new DeleteTableCommand({ TableName: 'stake' }))
    .then((res) => { console.log('Delete success', res) })
    .catch((error) => { console.log('ERROR', error) })