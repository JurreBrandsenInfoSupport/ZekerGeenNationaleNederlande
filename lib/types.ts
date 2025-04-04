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
}

