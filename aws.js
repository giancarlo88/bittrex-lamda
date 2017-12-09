const AWS = require('aws-sdk')

const updateDB = (value) =>
  new Promise((resolve, reject) => {
    AWS.config.update({
      region: 'eu-west-2',
      endpoint: 'dynamodb.eu-west-2.amazonaws.com'
    })

    const client = new AWS.DynamoDB.DocumentClient()

    const table = 'btx'

    const date = new Date(Date.now()).toString()

    var params = {
      TableName: table,
      Item: {
        date,
        value
      }
    }
    client.put(params, (err, data) => {
      if (err) {
        return reject(err)
      } else {
        console.log(data)
        // TODO: determine why the data object in the callback is empty
        return resolve(params)
      }
    })
  })

module.exports = updateDB
