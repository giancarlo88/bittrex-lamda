require('dotenv').config()
const crypto = require('crypto')
const request = require('superagent')
const url = 'https://bittrex.com/api/v1.1'

const makeSign = uri => {
  return crypto
    .createHmac('sha512', process.env.API_SECRET)
    .update(uri)
    .digest('hex')
}

const makeNonce = () => Date.now()
const getCurrencies = () =>
  new Promise((resolve, reject) => {
    const uri = `${url}/account/getbalances?apikey=${process.env.API_KEY}&nonce=${makeNonce()}`
    const apisign = makeSign(uri)

    request
      .get(uri)
      .set('apisign', apisign)
      .then(res => {
        if (res.body && res.body.success) {
          return resolve(res.body)
        }
        return reject(res.body.message)
      })
      .catch(err => {
        return reject(err)
      })
  })

const getTicker = market =>
  new Promise((resolve, reject) => {
    const uri = `${url}/public/getticker?market=${market}`
    request
      .get(uri)
      .then(res => {
        if (res.body && res.body.success) return resolve(res.body.result)
        return reject(res.body.message)
      })
      .catch(err => {
        return reject(err)
      })
  })

makeTickerRequests = currencies =>
  currencies.result.map(
    ({ Currency }) =>
      new Promise((resolve, reject) => {
        if (Currency === 'BTC') return resolve({ Currency })
        getTicker(`BTC-${Currency}`).then(res => resolve({ Currency, res }))
      })
  )

const mapTickers = currencies =>
  new Promise((resolve, reject) => {
    const tickers = Promise.all(makeTickerRequests(currencies))
    return resolve(tickers)
  })

const update = () =>
  new Promise((resolve, reject) => {
    getCurrencies()
      .then(currencies => mapTickers(currencies))
      .then(results => resolve(results))
      .catch(err => {
        return console.log(err)
      })
  })

update().then(res => {
  console.log(res)
})
