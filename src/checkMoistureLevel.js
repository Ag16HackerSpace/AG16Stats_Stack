const AWS = require('aws-sdk')

const { REGION, MOISTURE_DATA_TABLE } = process.env

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: REGION })

// Example event
// [
//   {
//     "measurement": "living_room",
//     "time": 1617445622004,
//     "fields": {
//       "pressure": 997.4546896197445,
//       "temperature": 23.413760257395914,
//       "temperature2": 23.700000000000003,
//       "humidity": 41,
//       "DP": 9.400139079551964
//     }
//   }
// ]

const handle = async (event, _ctx) => {
  const sensorData = {
    time: event[0].time,
    measurement: event[0].measurement,
    ...event[0].fields
  }

  try {
    await dynamodb
      .put({
        TableName: MOISTURE_DATA_TABLE,
        Item: sensorData
      })
      .promise()
  } catch (error) {
    console.error(error)
  }

  return sensorData
}

module.exports = { handle }
