"use client"

import { useState, useEffect, useCallback } from "react"
import { handleApiResponse, buildQueryString } from "@/lib/api-utils"
import { useToast } from "@/components/ui/use-toast"
import type { PaginationInfo } from "@/lib/types"

interface UseApiQueryOptions<T, P> {
  endpoint: string
  params?: P
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  enabled?: boolean
}

interface UseApiQueryResult<T> {
  data: T | undefined
  pagination: PaginationInfo | undefined
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApiQuery<T, P extends Record<string, any> = Record<string, any>>({
  endpoint,
  params,
  initialData,
  onSuccess,
  onError,
  enabled = true,
}: UseApiQueryOptions<T, P>): UseApiQueryResult<T> {
  const [data, setData] = useState<T | undefined>(initialData)
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const queryString = params ? buildQueryString(params) : ""
      const url = `${endpoint}${queryString}`

      const response = await fetch(url, {
        cache: "no-store",
        next: { revalidate: 0 },
      })

      const result = await handleApiResponse<any>(response)

      if (result.success && result.data) {
        // Check if the response has pagination
        if (result.data.pagination && result.data.items) {
          setData(result.data.items as T)
          setPagination(result.data.pagination)
        } else {
          setData(result.data as T)
        }

        onSuccess?.(result.data as T)
      } else {
        throw new Error(result.error || `Failed to fetch data from ${endpoint}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      onError?.(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, params, enabled, onSuccess, onError, toast])

  useEffect(() => {
    if (enabled) {
      fetchData()
    }
  }, [fetchData, enabled])

  return {
    data,
    pagination,
    isLoading,
    error,
    refetch: fetchData,
  }
}

