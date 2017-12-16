require('dotenv').config()
const fetchData = require('./fetchData')
const calculate = require('./calculate')
const aws = require('./aws')

module.exports.track = function index(event, context, cb) {
  return fetchData()
    .then((res) => {
      const value = calculate(res)
      return aws.update(value)
    })
    .then((params) => {
      console.log(`
      📝 Added the following information to the table:

      date: ${params.Item.date}
      BTC value: ${params.Item.value}

      ✅ All done.
    `)
      cb(null, '🎉')
    })
    .catch((err) => {
      console.error('\n💣 Failed to add to table for the following reason: \n', err)
      return cb(err)
    })
}
