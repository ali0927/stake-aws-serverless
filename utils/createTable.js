const {
    DynamoDBClient,
    CreateTableCommand,
} = require('@aws-sdk/client-dynamodb');

require('dotenv').config()

const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    },
    region: process.env.REGION
})

var params = {
    AttributeDefinitions: [
        {
            AttributeName: 'address',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'address',
            KeyType: 'HASH'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: 'stake',
    StreamSpecification: {
        StreamEnabled: false
    }
};

client.send(new CreateTableCommand(params))
    .then((res) => console.log('table created', res))
    .catch((err) => console.log('ERROR', err))