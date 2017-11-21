require('dotenv').config()
const request = require('superagent')
const url = 'https://bittrex.com/api/v1.1'
const crypto = require('crypto')
const chalk = require('chalk')

const log = console.log

const makeSign = uri => {
  return crypto
    .createHmac('sha512', process.env.API_SECRET)
    .update(uri)
    .digest('hex')
}

const makeNonce = () => Date.now()
const getBalances = async () => {
  const uri = `${url}/account/getbalances?apikey=${process.env.API_KEY}&nonce=${makeNonce()}`
  const sign = makeSign(uri)
  const res = await request.get(uri).set('apisign', sign)
  if (res.body && res.body.success) return res.body
  else throw res.body.message
}

const getTicker = async market => {
  const uri = `${url}/public/getticker?market=${market}`
  const res = await request.get(uri)
  if (res.body && res.body.success) return res.body
  else throw res.body.message
}

const update = () => {
  log(chalk.cyanBright('🤔  Updating! 🤔'))
  console.clear()
  Promise.all([getBalances(), getTicker('BTC-LTC'), getTicker('BTC-NAV')])
    .then(res => {
      log(chalk.cyanBright('💶 💷  My currencies 💷 💶 \n'))
      res[0].result.forEach(currency =>
        log(chalk.green(JSON.stringify(currency) + '\n'))
      )
      log(chalk.cyanBright('💵 💴  Current prices 💴 💵 \n'))
      res.forEach((response, index) => {
        if (index > 0) {
          log(chalk.yellow(JSON.stringify(response.result) + '\n'))
        }
      })
    })
    .catch(err => {
      throw new Error(chalk.red(`🔥 There was an error 🔥:\n ${err}`))
    })
}

update()

const start = setInterval(update, 100000)
