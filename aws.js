const AWS = require('aws-sdk')

const updateDB = value => {
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
  client.put(params, (err) => {
    if (err) {
      console.error(
        '\n💣 Failed to add to table for the following reason: \n',
        JSON.stringify(err, null, 2)
      )
    } else {
      // TODO: determine why the data object in the callback is empty
      console.log(`
      📝 Added the following information to the table:
      date: ${params.Item.date}
      BTC value: ${params.Item.value}

      ✅ All done.
      `)
    }
  })
}

module.exports = updateDB
