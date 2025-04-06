// Common types used throughout the application

export type Policy = {
  id: number
  policyNumber: string
  customerId: number
  customer: string
  type: string
  premium: number
  startDate: string
  endDate: string
  status: string
  coverageDetails?: {
    [key: string]: any
  }
}

export type Claim = {
  id: number
  claimId: string
  policyNumber: string
  customerId: number
  customer: string
  amount: number
  incidentDate: string
  filedDate: string
  status: string
  description?: string
  documents?: string[]
}

export type Customer = {
  id: number
  name: string
  email: string
  phone: string
  customerSince: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  policies?: string[]
  claims?: string[]
  avatar: string
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  pagination?: PaginationInfo
}

export type PaginationInfo = {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type SortDirection = "asc" | "desc"

export type SortOption = {
  field: string
  direction: SortDirection
}

export type FilterOption = {
  field: string
  value: string | number | boolean
  operator?: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "startsWith" | "endsWith"
}

export type PaginatedRequest = {
  page?: number
  pageSize?: number
  sort?: SortOption
  filters?: FilterOption[]
  search?: string
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: PaginationInfo
}

// Payment related types
export interface Payment {
  id: number
  paymentId: string
  customerId: number
  customer: string
  amount: number
  currency: string
  date: string
  method: 'bank_transfer' | 'credit_card' | 'check' | 'direct_debit'
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  description: string
  referenceNumber: string
}

export interface PaymentCreate {
  customerId: number
  customer: string
  amount: number
  currency: string
  date: string
  method: 'bank_transfer' | 'credit_card' | 'check' | 'direct_debit'
  description: string
}

export interface PaymentUpdate {
  amount?: number
  currency?: string
  date?: string
  method?: 'bank_transfer' | 'credit_card' | 'check' | 'direct_debit'
  status?: 'completed' | 'pending' | 'failed' | 'cancelled'
  description?: string
}

