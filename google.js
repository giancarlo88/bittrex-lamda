const request = require('superagent')

const updateSheet = value => {
  request
    .post(
      'https://sheets.googleapis.com/v4/spreadsheets/1eUB4t0WObwGK9wsw22rtIVLC5_NsuQaHG4rkVtCkVk8/values/Sheet1!A1:C1:append?valueInputOption=USER_ENTERED&key=1eUB4t0WObwGK9wsw22rtIVLC5_NsuQaHG4rkVtCkVk8'
    )
    .send({
      range: 'Sheet1!A1:B1',
      majorDimension: 'ROWS',
      values: [[Date.now(), value]]
    })
    .end((err, res) => console.log(res.body))
}

module.exports = updateSheet
