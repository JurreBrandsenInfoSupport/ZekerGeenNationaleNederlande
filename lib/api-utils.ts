import type { ApiResponse } from "@/lib/types"

/**
 * Handles API responses with consistent error handling
 */
export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    // Try to get error details from the response
    try {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || `API error: ${response.status} ${response.statusText}`,
      }
    } catch (e) {
      // If we can't parse the error, return a generic error
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      }
    }
  }

  try {
    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (e) {
    return {
      success: false,
      error: "Failed to parse API response",
    }
  }
}

/**
 * Builds a query string from an object of parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  // Filter out undefined or null values
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, any>,
    )

  // If no params, return empty string
  if (Object.keys(filteredParams).length === 0) {
    return ""
  }

  // Build query string
  return "?" + new URLSearchParams(filteredParams as Record<string, string>).toString()
}

/**
 * Formats a date to YYYY-MM-DD
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString().split("T")[0]
}

