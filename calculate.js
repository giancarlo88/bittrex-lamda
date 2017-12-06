const calculate = (data = []) => {
  const calculated = data.reduce((acc, { available, price }) => {
    return price ? available * price + acc : available + acc
  }, 0)
  console.log(`Current BTC value is ${calculated}`)
  return calculated.toFixed(8)
}

module.exports = calculate
