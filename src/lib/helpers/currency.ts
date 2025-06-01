export const centsToEuro = (cents: number): string =>
  (cents / 100).toLocaleString("nl-NL", { minimumFractionDigits: 2 })
