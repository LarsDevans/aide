export function convertCentsToEuros(cents: number) {
  return cents / 100
}

export const euroToCents = (euros: number): number => Math.round(euros * 100)

export function centsToCurrency(cents: number): string {
  return convertCentsToEuros(cents).toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
  })
}
