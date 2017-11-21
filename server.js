require('dotenv').config()
const request = require('superagent')
const crypto = require('crypto')
const write = require('./write')

const url = 'https://bittrex.com/api/v1.1'

const makeSign = (uri) => {
  return crypto.createHmac('sha512', process.env.API_SECRET).update(uri).digest('hex')
}

const makeNonce = () => Date.now()
const getBalances = async () => {
  const uri = `${url}/account/getbalances?apikey=${process.env.API_KEY}&nonce=${makeNonce()}`
  const sign = makeSign(uri)
  const res = await request.get(uri).set('apisign', sign)
  if (res.body && res.body.success) return res.body
  throw res.body.message
}

const getTicker = async (market) => {
  const uri = `${url}/public/getticker?market=${market}`
  const res = await request.get(uri)
  if (res.body && res.body.success) return res.body
  throw res.body.message
}

const update = () => {
  write.message('🤔  Updating! 🤔')
  console.clear()

  Promise.all([getBalances(), getTicker('BTC-LTC'), getTicker('BTC-NAV')])
    .then((res) => write.update(res))
    .catch((err) => {
      return new Error(write.error(`🔥  There was an error: 🔥\n ${err}`))
    })
}

update()

const timer = setInterval(update, 1000000)
