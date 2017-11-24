require('dotenv').config()
const request = require('superagent')
const crypto = require('crypto')
const write = require('./write')

const url = 'https://bittrex.com/api/v1.1'

const makeSign = (uri) => {
  return crypto.createHmac('sha512', process.env.API_SECRET).update(uri).digest('hex')
}

const makeNonce = () => Date.now()
const getCurrencies = async () => {
  const uri = `${url}/account/getbalances?apikey=${process.env.API_KEY}&nonce=${makeNonce()}`
  const sign = makeSign(uri)
  const res = await request.get(uri).set('apisign', sign)
  if (res.body && res.body.success) return res.body
  throw res.body.message
}

const getTicker = async (market) => {
  const uri = `${url}/public/getticker?market=${market}`
  const res = await request.get(uri)
  if (res.body && res.body.success) return res.body.result
  throw res.body.message
}

const update = async () => {
  write.message('🤔  Updating! 🤔')
  console.clear()

  const currencies = await getCurrencies()

  const tickers = await Promise.all(
    currencies.result.map(async ({ Currency }) => {
      if (Currency === 'BTC') return { Currency }
      const res = await getTicker(`BTC-${Currency}`)
      return { Currency, res }
    })
  )

  await write.currencies(currencies)
  await write.tickers(tickers)
}

update()

const timer = setInterval(update, 1000000)
