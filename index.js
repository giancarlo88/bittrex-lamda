require('dotenv').config()
const fetchData = require('./fetchData')
const calculate = require('./calculate')
const aws = require('./aws')

module.exports.track = async function index(event, context, cb) {
  try {
    const data = await fetchData()
    const value = calculate(data)
    const params = await aws.update(value)
    console.log(`
    📝 Added the following information to the table:

    date: ${params.Item.date}
    BTC value: ${params.Item.value}

    ✅ All done.
  `)
    return cb(null, '🎉')
  } catch (err) {
    console.error(
      '\n💣 Failed to add to table for the following reason: \n',
      err
    )
    return cb(err)
  }
}
