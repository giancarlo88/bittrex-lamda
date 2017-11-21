const chalk = require('chalk')

const log = console.log

const error = (err) => {
  log(chalk.redBright(err))
}

const message = (text) => {
  log(chalk.cyanBright(text))
}

const update = (res) => {
  try {

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
  }
  catch (err) {
    error(err)
  }
}

module.exports = {
  error,
  message,
  update
}
