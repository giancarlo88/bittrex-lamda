const calculate = (data = []) => {
  const calculated = data.reduce((acc, { available = 0, price = 0 } = {}) => {
    return price ? available * price + acc : available + acc
  }, 0)
  const btcValue = calculated.toFixed(8)
  console.log(`✨ Current BTC value is ${btcValue} ✨`)
  return btcValue
}

module.exports = calculate
