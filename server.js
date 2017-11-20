import request from 'superagent'

const url = 'https://bittrex.com/api/v1.1'

const getBalances = async () => { 
  try {
    const res = request.get(`${url}/account/getbalances?apikey=${process.env.API-KEY}`)
    return res
  }
  catch (err) { 
    throw new Error(`There was an error:\n ${err}`)
  }
}

const update = async () => { 
  const res = await Promise.all(getBalances)
  console.log(res)
}

const start = () => setInterval(update, 30000)

start()