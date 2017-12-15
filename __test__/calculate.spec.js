const calculate = require('../calculate')

describe('Calculate function', () => {
  describe('given objects that all have prices', () => {
    it('should be reduced correctly to a single value string', () => {
      const data = [
        {
          available: 2,
          price: 2
        },
        {
          available: 3,
          price: 1
        }
      ]
      expect(calculate(data)).toBe('7.00000000')
    })
  })

  describe("given some objects that don't have a price", () => {
    const data = [
      {
        available: 2
      },
      {
        available: 3,
        price: 2
      }
    ]

    it('should be reduced correctly to a single value string', () => {
      expect(calculate(data)).toBe('8.00000000')
    })
  })
})
