const AWS = require('aws-sdk')

const updateDB = value => {
  AWS.config.update({
    region: 'eu-west-2',
    endpoint: 'dynamodb.eu-west-2.amazonaws.com'
  })

  const client = new AWS.DynamoDB.DocumentClient()

  const table = 'btx-tracker'

  const date = new Date(Date.now()).toString()

  var params = {
    TableName: table,
    Item: {
      Date: date,
      price: value
    }
  }

  console.log('Adding a new item...')
  client.put(params, function(err, data) {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2))
    }
  })
}

module.exports = updateDB
