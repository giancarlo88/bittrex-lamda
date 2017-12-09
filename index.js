require('dotenv').config()
const crypto = require('crypto')
const request = require('superagent')
const calculate = require('./calculate')
const updateDB = require('./aws')
const url = 'https://bittrex.com/api/v1.1'

module.exports.track = function index(event, context, cb) {
  const makeSign = (uri) => {
    return crypto.createHmac('sha512', process.env.API_SECRET).update(uri).digest('hex')
  }

  const makeNonce = () => Date.now()

  const getCurrencies = () =>
    new Promise((resolve, reject) => {
      const uri = `${url}/account/getbalances?apikey=${process.env.API_KEY}&nonce=${makeNonce()}`
      const apisign = makeSign(uri)

      request
        .get(uri)
        .set('apisign', apisign)
        .then((res) => {
          if (res.body && res.body.success) {
            return resolve(res.body)
          }
          return reject(res.body.message)
        })
        .catch((err) => {
          return reject(err)
        })
    })

  const getTicker = (market) =>
    new Promise((resolve, reject) => {
      const uri = `${url}/public/getticker?market=${market}`
      request
        .get(uri)
        .then((res) => {
          if (res.body && res.body.success) {
            console.log(`💰 ${market}: ${JSON.stringify(res.body.result)}💰`)
            return resolve(res.body.result)
          }
          return reject(res.body.message)
        })
        .catch((err) => {
          return reject(err)
        })
    })

  const makeTickerRequests = (currencies) => {
    return currencies.result.map(
      ({ Currency: currency, Available: available }) =>
        new Promise((resolve) => {
          // TODO: Find a way to make this less specific
          if (currency === 'BTC') return resolve({ currency, available })
          if (currency === 'USDT') return resolve()
          getTicker(`BTC-${currency}`)
            .then((res) =>
              resolve({
                currency,
                available: Number(available),
                price: Number(res.Last)
              })
            )
            // In case a market is not listed temporarily
            .catch((err) => {
              console.log(`🤯 The request for ${currency} returned an error: ${err}`)
              resolve()
            })
        })
    )
  }

  const mapTickers = (currencies) => {
    const tickers = Promise.all(makeTickerRequests(currencies))
    return Promise.resolve(tickers)
  }

  const update = () =>
    new Promise((resolve, reject) => {
      getCurrencies()
        .then((currencies) => mapTickers(currencies))
        .then((results) => resolve(results))
        .catch((err) => {
          return reject(err)
        })
    })

  return update()
    .then((res) => {
      const value = calculate(res)
      return updateDB(value)
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
