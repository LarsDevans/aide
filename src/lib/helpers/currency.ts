export const centsToEuro = (cents: number): string =>
  (cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 2 })

export const euroToCents = (euros: number): number => Math.round(euros * 100)
