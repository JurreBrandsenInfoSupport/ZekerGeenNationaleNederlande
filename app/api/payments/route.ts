import { type NextRequest, NextResponse } from "next/server"
import type { Payment, FilterOption, SortOption } from "@/lib/types"

// In-memory storage for payments (simulating a database)
const payments = [
  {
    id: 1,
    paymentId: "PAY-1001",
    customerId: 1,
    customer: "John Smith",
    amount: 750.50,
    currency: "EUR",
    date: "2023-04-15",
    method: "bank_transfer",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-123456",
  },
  {
    id: 2,
    paymentId: "PAY-1002",
    customerId: 2,
    customer: "Sarah Johnson",
    amount: 925.75,
    currency: "EUR",
    date: "2023-04-15",
    method: "direct_debit",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-234567",
  },
  {
    id: 3,
    paymentId: "PAY-1003",
    customerId: 3,
    customer: "Michael Brown",
    amount: 1025.25,
    currency: "EUR",
    date: "2023-04-16",
    method: "check",
    status: "pending",
    description: "Monthly pension payment",
    referenceNumber: "REF-345678",
  },
  {
    id: 4,
    paymentId: "PAY-1004",
    customerId: 4,
    customer: "Emily Davis",
    amount: 875.00,
    currency: "EUR",
    date: "2023-04-16",
    method: "bank_transfer",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-456789",
  },
  {
    id: 5,
    paymentId: "PAY-1005",
    customerId: 5,
    customer: "David Wilson",
    amount: 1125.50,
    currency: "EUR",
    date: "2023-04-17",
    method: "credit_card",
    status: "failed",
    description: "Monthly pension payment - card declined",
    referenceNumber: "REF-567890",
  },
  {
    id: 6,
    paymentId: "PAY-1006",
    customerId: 6,
    customer: "Jennifer Martinez",
    amount: 950.25,
    currency: "EUR",
    date: "2023-04-17",
    method: "direct_debit",
    status: "pending",
    description: "Monthly pension payment",
    referenceNumber: "REF-678901",
  },
  {
    id: 7,
    paymentId: "PAY-1007",
    customerId: 7,
    customer: "Robert Taylor",
    amount: 1050.75,
    currency: "EUR",
    date: "2023-04-18",
    method: "bank_transfer",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-789012",
  },
  {
    id: 8,
    paymentId: "PAY-1008",
    customerId: 8,
    customer: "Jessica Anderson",
    amount: 825.50,
    currency: "EUR",
    date: "2023-04-18",
    method: "check",
    status: "cancelled",
    description: "Monthly pension payment - cancelled by customer",
    referenceNumber: "REF-890123",
  },
  {
    id: 9,
    paymentId: "PAY-1009",
    customerId: 9,
    customer: "Thomas White",
    amount: 1100.00,
    currency: "EUR",
    date: "2023-04-19",
    method: "direct_debit",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-901234",
  },
  {
    id: 10,
    paymentId: "PAY-1010",
    customerId: 10,
    customer: "Amanda Harris",
    amount: 975.25,
    currency: "EUR",
    date: "2023-04-19",
    method: "bank_transfer",
    status: "pending",
    description: "Monthly pension payment",
    referenceNumber: "REF-012345",
  },
  {
    id: 11,
    paymentId: "PAY-1011",
    customerId: 1,
    customer: "John Smith",
    amount: 750.50,
    currency: "EUR",
    date: "2023-05-15",
    method: "bank_transfer",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-123457",
  },
  {
    id: 12,
    paymentId: "PAY-1012",
    customerId: 2,
    customer: "Sarah Johnson",
    amount: 925.75,
    currency: "EUR",
    date: "2023-05-15",
    method: "direct_debit",
    status: "completed",
    description: "Monthly pension payment",
    referenceNumber: "REF-234568",
  },
]

// Helper function to apply filters
function applyFilters(data: Payment[], filters: FilterOption[]): Payment[] {
  if (!filters || filters.length === 0) return data

  return data.filter((item) => {
    return filters.every((filter) => {
      const itemValue = (item as any)[filter.field]

      if (itemValue === undefined) return false

      switch (filter.operator) {
        case "eq":
          return itemValue === filter.value
        case "neq":
          return itemValue !== filter.value
        case "gt":
          return itemValue > filter.value
        case "gte":
          return itemValue >= filter.value
        case "lt":
          return itemValue < filter.value
        case "lte":
          return itemValue <= filter.value
        case "contains":
          return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase())
        case "startsWith":
          return String(itemValue).toLowerCase().startsWith(String(filter.value).toLowerCase())
        case "endsWith":
          return String(itemValue).toLowerCase().endsWith(String(filter.value).toLowerCase())
        default:
          // Default to equality
          return itemValue === filter.value
      }
    })
  })
}

// Helper function to apply search
function applySearch(data: Payment[], search: string): Payment[] {
  if (!search) return data

  const searchLower = search.toLowerCase()
  return data.filter((item) => {
    return (
      item.paymentId.toLowerCase().includes(searchLower) ||
      item.customer.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.referenceNumber.toLowerCase().includes(searchLower) ||
      String(item.amount).includes(searchLower)
    )
  })
}

// Helper function to apply sorting
function applySort(data: Payment[], sort?: SortOption): Payment[] {
  if (!sort || !sort.field) return data

  return [...data].sort((a, b) => {
    const valueA = (a as any)[sort.field]
    const valueB = (b as any)[sort.field]

    // Handle different data types
    if (typeof valueA === "string" && typeof valueB === "string") {
      const comparison = valueA.localeCompare(valueB)
      return sort.direction === "desc" ? -comparison : comparison
    } else {
      // Numeric sort
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0
      return sort.direction === "desc" ? -comparison : comparison
    }
  })
}

// Helper function to apply pagination
function applyPagination<T>(
  data: T[],
  page = 1,
  pageSize = 10,
): {
  items: T[]
  pagination: {
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
} {
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const currentPage = Math.max(1, Math.min(page, totalPages))

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return {
    items: data.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  }
}

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get a list of payments
 *     description: Retrieve a paginated list of pension payments with optional filtering by customer, date range, or status
 *     tags:
 *       - Payments
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/sortField'
 *       - $ref: '#/components/parameters/sortDirection'
 *       - name: customerId
 *         in: query
 *         description: Filter by Customer ID
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter payments by status
 *         schema:
 *           type: string
 *           enum: [completed, pending, failed, cancelled]
 *     responses:
 *       200:
 *         description: A paginated list of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")
    const customerId = searchParams.get("customerId") ? Number.parseInt(searchParams.get("customerId")!) : null
    const status = searchParams.get("status") || ""
    const sortField = searchParams.get("sortField") || ""
    const sortDirection = searchParams.get("sortDirection") || "asc"

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Apply filters
    let filteredData = [...payments]

    // Apply customerId filter if provided
    if (customerId !== null) {
      filteredData = filteredData.filter((payment) => payment.customerId === customerId)
    }

    // Apply status filter if provided
    if (status && status !== "all") {
      filteredData = filteredData.filter((payment) => payment.status === status)
    }

    // Apply sorting if provided
    if (sortField) {
      filteredData = applySort(filteredData, { field: sortField, direction: sortDirection as "asc" | "desc" })
    }

    // Apply pagination
    const paginatedResult = applyPagination(filteredData, page, pageSize)

    // Add cache control headers to response
    const response = NextResponse.json(paginatedResult)
    response.headers.set('Cache-Control', 'private, max-age=60')
    return response
  } catch (error) {
    console.error("Error in payments API:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     description: Create and schedule a new pension payment
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentCreate'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["customerId", "customer", "amount", "currency", "date", "method"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate method
    const validMethods = ["bank_transfer", "credit_card", "check", "direct_debit"]
    if (!validMethods.includes(body.method)) {
      return NextResponse.json({ error: `Invalid payment method: ${body.method}` }, { status: 400 })
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate a new ID (max ID + 1)
    const newId = Math.max(...payments.map((p) => p.id)) + 1

    // Generate a payment ID
    const paymentId = `PAY-${1000 + newId}`

    // Generate a reference number
    const referenceNumber = `REF-${Math.floor(100000 + Math.random() * 900000)}`

    // Create a new payment
    const newPayment = {
      id: newId,
      paymentId,
      customerId: body.customerId,
      customer: body.customer,
      amount: body.amount,
      currency: body.currency,
      date: body.date,
      method: body.method,
      status: "pending",
      description: body.description || "Monthly pension payment",
      referenceNumber,
    }

    // Add to our in-memory "database"
    payments.push(newPayment)

    return NextResponse.json(newPayment, { status: 201 })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
