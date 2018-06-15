const AWS = require('aws-sdk')

const update = (value) =>
  new Promise((resolve, reject) => {
    AWS.config.update({
      region: 'eu-west-2',
      endpoint: 'dynamodb.eu-west-2.amazonaws.com'
    })

    const client = new AWS.DynamoDB.DocumentClient()
    const table = 'btx'
    const utc = Date.now()
    const date = new Date(utc).toString()

    const params = {
      TableName: table,
      Item: {
        date,
        value,
        utc
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

module.exports = { update }
