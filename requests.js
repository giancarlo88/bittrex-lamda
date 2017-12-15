const crypto = require('crypto')
const request = require('superagent')
const url = 'https://bittrex.com/api/v1.1'

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


module.exports = {
  getCurrencies,
  getTicker,
  makeTickerRequests
}
