import {
  toDate,
  getMonthString,
  formatDate,
  formatDateForInput,
  sortByDateDesc,
  getDatesInMonth,
} from "@/lib/helpers/date"

describe("toDate", () => {
  it("returns current date for null or undefined", () => {
    const now = Date.now()
    expect(Math.abs(toDate(null).getTime() - now)).toBeLessThan(100)
    expect(Math.abs(toDate(undefined).getTime() - now)).toBeLessThan(100)
  })

  it("returns the same Date instance for Date input", () => {
    const d = new Date("2024-06-22")
    expect(toDate(d)).toBe(d)
  })

  it("parses string input", () => {
    const d = toDate("2024-06-22")
    expect(d).toBeInstanceOf(Date)
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(5)
    expect(d.getDate()).toBe(22)
  })

  it("calls toDate on FirestoreDateLike", () => {
    const fake = { toDate: () => new Date("2023-01-01") }
    expect(toDate(fake).getFullYear()).toBe(2023)
  })

  it("returns current date for null input", () => {
    //ts-ignore-next-line
    expect(toDate({})).toBeInstanceOf(Date)
  })
})

describe("getMonthString", () => {
  it("returns YYYY-MM for Date", () => {
    expect(getMonthString(new Date("2024-06-05"))).toBe("2024-06")
  })
  it("pads month with zero", () => {
    expect(getMonthString(new Date("2024-01-05"))).toBe("2024-01")
  })
})

describe("formatDate", () => {
  it("returns DD-MM-YYYY", () => {
    expect(formatDate(new Date("2024-06-05"))).toBe("05-06-2024")
  })
})

describe("formatDateForInput", () => {
  it("returns YYYY-MM-DD", () => {
    expect(formatDateForInput(new Date("2024-06-05"))).toBe("2024-06-05")
  })
})

describe("sortByDateDesc", () => {
  it("sorts by createdAt descending", () => {
    const arr = [
      { createdAt: "2024-06-01" },
      { createdAt: "2024-06-03" },
      { createdAt: "2024-06-02" },
    ]
    arr.sort(sortByDateDesc)
    expect(arr.map((a) => a.createdAt)).toEqual([
      "2024-06-03",
      "2024-06-02",
      "2024-06-01",
    ])
  })
})

describe("getDatesInMonth", () => {
  it("returns all dates in a month", () => {
    const dates = getDatesInMonth(2024, 1) // February 2024 (leap year)
    expect(dates.length).toBe(29)
    expect(dates[0].getDate()).toBe(1)
    expect(dates[28].getDate()).toBe(29)
    expect(dates[0].getMonth()).toBe(1)
  })
})
