const requests = require('./requests')

const mapTickers = currencies => {
  const tickers = Promise.all(requests.makeTickerRequests(currencies))
  return Promise.resolve(tickers)
}

const fetchData = async () => {
  try {
    const currencies = await requests.getCurrencies()
    return await mapTickers(currencies)
  } catch (err) {
    throw err
  }
}

module.exports = fetchData
