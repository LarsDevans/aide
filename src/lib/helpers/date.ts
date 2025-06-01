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

export function formatDate(date: AllowedDateInput): string {
  const dateObj = toDate(date)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, "0")
  const day = String(dateObj.getDate()).padStart(2, "0")
  return `${day}-${month}-${year}`
}
