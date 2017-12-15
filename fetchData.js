const requests = require('./requests')

const mapTickers = (currencies) => {
  const tickers = Promise.all(requests.makeTickerRequests(currencies))
  return Promise.resolve(tickers)
}

const fetchData = () =>
new Promise((resolve, reject) => {
  requests.getCurrencies()
    .then((currencies) => mapTickers(currencies))
    .then((results) => resolve(results))
    .catch((err) => {
      return reject(err)
    })
})

module.exports = fetchData
