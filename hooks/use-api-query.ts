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
  const [isLoading, setIsLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [hasInitialFetch, setHasInitialFetch] = useState(false)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const queryString = params ? buildQueryString(params) : ""
      const response = await fetch(`${endpoint}${queryString}`, {
        cache: "no-store",
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      const result = await handleApiResponse<any>(response)

      if (result.success && result.data) {
        if (result.data.items && result.data.pagination) {
          setData(result.data.items as T)
          setPagination(result.data.pagination)
        } else {
          setData(result.data as T)
        }

        if (onSuccess) {
          onSuccess(result.data as T)
        }
      } else {
        throw new Error(result.error || `Failed to fetch data from ${endpoint}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)

      if (onError) {
        onError(errorMessage)
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setHasInitialFetch(true)
    }
  }, [endpoint, params, onSuccess, onError, toast])

  useEffect(() => {
    if (enabled && !hasInitialFetch) {
      fetchData()
    }
  }, [enabled, fetchData, hasInitialFetch])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    pagination,
    refetch,
  }
}

