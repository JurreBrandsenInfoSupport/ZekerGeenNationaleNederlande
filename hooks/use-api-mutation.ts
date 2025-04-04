"use client"

import { useState } from "react"
import { handleApiResponse } from "@/lib/api-utils"
import { useToast } from "@/components/ui/use-toast"

interface UseApiMutationOptions<T, R> {
  endpoint: string
  method?: "POST" | "PUT" | "DELETE" | "PATCH"
  onSuccess?: (data: R) => void
  onError?: (error: string) => void
  successMessage?: string
}

interface UseApiMutationResult<T, R> {
  mutate: (data: T) => Promise<R | undefined>
  isLoading: boolean
  error: string | null
  reset: () => void
}

export function useApiMutation<T, R = any>({
  endpoint,
  method = "POST",
  onSuccess,
  onError,
  successMessage,
}: UseApiMutationOptions<T, R>): UseApiMutationResult<T, R> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const reset = () => {
    setError(null)
  }

  const mutate = async (data: T): Promise<R | undefined> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await handleApiResponse<R>(response)

      if (result.success && result.data) {
        if (successMessage) {
          toast({
            title: "Success",
            description: successMessage,
          })
        }

        onSuccess?.(result.data)
        return result.data
      } else {
        throw new Error(result.error || `Failed to ${method.toLowerCase()} data to ${endpoint}`)
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

      return undefined
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    isLoading,
    error,
    reset,
  }
}

