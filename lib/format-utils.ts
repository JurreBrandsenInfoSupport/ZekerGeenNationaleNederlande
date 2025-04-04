/**
 * Formats a number consistently across server and client
 * to avoid hydration errors
 */
export function formatNumber(value: number): string {
  // Use a specific locale (en-US) to ensure consistency
  return value.toLocaleString("en-US")
}

/**
 * Formats a currency value consistently
 */
export function formatCurrency(value: number): string {
  return `$${formatNumber(value)}`
}

/**
 * Formats a date consistently
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

