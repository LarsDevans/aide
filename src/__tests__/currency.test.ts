import {
  convertCentsToEuros,
  euroToCents,
  centsToCurrency,
} from "@/lib/helpers/currency"

describe("convertCentsToEuros", () => {
  it("converts cents to euros", () => {
    expect(convertCentsToEuros(123)).toBe(1.23)
    expect(convertCentsToEuros(0)).toBe(0)
    expect(convertCentsToEuros(-100)).toBe(-1)
  })
})

describe("euroToCents", () => {
  it("converts euros to cents and rounds", () => {
    expect(euroToCents(1.23)).toBe(123)
    expect(euroToCents(0)).toBe(0)
    expect(euroToCents(-1)).toBe(-100)
    expect(euroToCents(1.235)).toBe(124)
  })
})

describe("centsToCurrency", () => {
  it("formats cents as Dutch euro currency string", () => {
    expect(centsToCurrency(123)).toBe("1,23")
    expect(centsToCurrency(0)).toBe("0,00")
    expect(centsToCurrency(100000)).toBe("1.000,00")
    expect(centsToCurrency(-123)).toBe("-1,23")
  })
})
