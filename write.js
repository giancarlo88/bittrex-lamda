const chalk = require('chalk')

const log = console.log

const error = (err) => {
  log(chalk.redBright(err))
}

const message = (text) => {
  log(chalk.cyanBright(text))
}

const currencies = (res) => {
  log(chalk.cyanBright('💶 💷  My currencies 💷 💶 \n'))
  res.result.forEach((currency) => log(chalk.green(JSON.stringify(currency) + '\n')))
}

const tickers = (res) => {
  try {
    log(chalk.cyanBright('💵 💴  Current prices 💴 💵 \n'))
    res.forEach(({ Currency, res }) => {
      log(chalk.magenta(`${Currency}: \n`))
      log(chalk.yellow(JSON.stringify(res) + '\n'))
    })
  } catch (err) {
    error(err)
  }
}

module.exports = {
  error,
  message,
  currencies,
  tickers
}
