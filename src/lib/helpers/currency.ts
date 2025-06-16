export function centsToEuro(cents: number) {
  return cents / 100
}

export const euroToCents = (euros: number): number => Math.round(euros * 100)

export function centsToCurrency(cents: number): string {
  return centsToEuro(cents).toLocaleString("nl-NL", { minimumFractionDigits: 2 })
}
