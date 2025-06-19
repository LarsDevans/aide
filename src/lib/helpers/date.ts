export type FirestoreDateLike = {
  toDate: () => Date
}

export type AllowedDateInput =
  | Date
  | string
  | FirestoreDateLike
  | null
  | undefined

export function toDate(date: AllowedDateInput): Date {
  if (!date) {
    return new Date()
  }
  if (date instanceof Date) {
    return date
  }
  if (typeof date === "string") {
    return new Date(date)
  }
  if ("toDate" in date && typeof date.toDate === "function") {
    return date.toDate()
  }
  return new Date()
}

export function getMonthString(date: AllowedDateInput): string {
  const dateObj = toDate(date)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

function getDateParts(date: AllowedDateInput): {
  year: string
  month: string
  day: string
} {
  const dateObj = toDate(date)
  const year = String(dateObj.getFullYear())
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  return { year, month, day }
}

export function formatDate(date: AllowedDateInput): string {
  const { year, month, day } = getDateParts(date)
  return `${day}-${month}-${year}`
}

export function formatDateForInput(date: AllowedDateInput): string {
  const { year, month, day } = getDateParts(date)
  return `${year}-${month}-${day}`
}

export function sortByDateDesc<T extends { createdAt: AllowedDateInput }>(
  a: T,
  b: T,
): number {
  return toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime()
}

export function getDatesInMonth(year: number, month: number) {
  const dates = []
  const date = new Date(year, month, 1)

  while (date.getMonth() === month) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}
