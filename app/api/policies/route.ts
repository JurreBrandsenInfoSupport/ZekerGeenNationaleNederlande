import { type NextRequest, NextResponse } from "next/server"
import type { Policy, FilterOption, SortOption } from "@/lib/types"

// In-memory storage for policies (simulating a database)
const policies = [
  {
    id: 1,
    policyNumber: "POL-1001",
    customerId: 1,
    customer: "John Smith",
    type: "Auto Insurance",
    premium: 1200,
    startDate: "2023-01-15",
    endDate: "2024-01-14",
    status: "active",
    coverageDetails: {
      vehicleModel: "Toyota Camry",
      vehicleYear: 2020,
      coverageType: "Comprehensive",
      deductible: 500,
    },
  },
  {
    id: 2,
    policyNumber: "POL-1002",
    customerId: 2,
    customer: "Sarah Johnson",
    type: "Home Insurance",
    premium: 950,
    startDate: "2023-02-20",
    endDate: "2024-02-19",
    status: "active",
    coverageDetails: {
      propertyType: "Single Family Home",
      propertyValue: 350000,
      coverageType: "Standard",
      deductible: 1000,
    },
  },
  {
    id: 3,
    policyNumber: "POL-1003",
    customerId: 3,
    customer: "Michael Brown",
    type: "Life Insurance",
    premium: 2500,
    startDate: "2023-03-10",
    endDate: "2024-03-09",
    status: "active",
    coverageDetails: {
      beneficiary: "Lisa Brown",
      coverageAmount: 500000,
      policyType: "Term Life",
    },
  },
  {
    id: 4,
    policyNumber: "POL-1004",
    customerId: 4,
    customer: "Emily Davis",
    type: "Health Insurance",
    premium: 3200,
    startDate: "2023-01-05",
    endDate: "2024-01-04",
    status: "active",
    coverageDetails: {
      planType: "Family",
      deductible: 2000,
      coPayment: 25,
    },
  },
  {
    id: 5,
    policyNumber: "POL-1005",
    customerId: 5,
    customer: "David Wilson",
    type: "Auto Insurance",
    premium: 1450,
    startDate: "2023-04-12",
    endDate: "2024-04-11",
    status: "pending",
    coverageDetails: {
      vehicleModel: "Honda Accord",
      vehicleYear: 2021,
      coverageType: "Comprehensive",
      deductible: 750,
    },
  },
  {
    id: 6,
    policyNumber: "POL-1006",
    customerId: 6,
    customer: "Jennifer Martinez",
    type: "Home Insurance",
    premium: 1100,
    startDate: "2022-05-18",
    endDate: "2023-05-17",
    status: "expired",
    coverageDetails: {
      propertyType: "Condominium",
      propertyValue: 280000,
      coverageType: "Standard",
      deductible: 1500,
    },
  },
  {
    id: 7,
    policyNumber: "POL-1007",
    customerId: 7,
    customer: "Robert Taylor",
    type: "Auto Insurance",
    premium: 1350,
    startDate: "2023-06-10",
    endDate: "2024-06-09",
    status: "active",
    coverageDetails: {
      vehicleModel: "Ford Explorer",
      vehicleYear: 2019,
      coverageType: "Comprehensive",
      deductible: 600,
    },
  },
  {
    id: 8,
    policyNumber: "POL-1008",
    customerId: 8,
    customer: "Jessica Anderson",
    type: "Life Insurance",
    premium: 2800,
    startDate: "2023-07-05",
    endDate: "2024-07-04",
    status: "active",
    coverageDetails: {
      beneficiary: "Mark Anderson",
      coverageAmount: 600000,
      policyType: "Whole Life",
    },
  },
  {
    id: 9,
    policyNumber: "POL-1009",
    customerId: 9,
    customer: "Thomas White",
    type: "Health Insurance",
    premium: 2900,
    startDate: "2023-03-22",
    endDate: "2024-03-21",
    status: "active",
    coverageDetails: {
      planType: "Individual",
      deductible: 1500,
      coPayment: 20,
    },
  },
  {
    id: 10,
    policyNumber: "POL-1010",
    customerId: 10,
    customer: "Amanda Harris",
    type: "Home Insurance",
    premium: 1050,
    startDate: "2023-01-30",
    endDate: "2024-01-29",
    status: "pending",
    coverageDetails: {
      propertyType: "Townhouse",
      propertyValue: 320000,
      coverageType: "Premium",
      deductible: 800,
    },
  },
  {
    id: 11,
    policyNumber: "POL-1011",
    customerId: 11,
    customer: "Daniel Clark",
    type: "Auto Insurance",
    premium: 1150,
    startDate: "2022-11-15",
    endDate: "2023-11-14",
    status: "expired",
    coverageDetails: {
      vehicleModel: "Chevrolet Malibu",
      vehicleYear: 2018,
      coverageType: "Basic",
      deductible: 1000,
    },
  },
  {
    id: 12,
    policyNumber: "POL-1012",
    customerId: 12,
    customer: "Michelle Lewis",
    type: "Life Insurance",
    premium: 3100,
    startDate: "2023-05-08",
    endDate: "2024-05-07",
    status: "active",
    coverageDetails: {
      beneficiary: "James Lewis",
      coverageAmount: 750000,
      policyType: "Term Life",
    },
  },
]

// Helper function to apply filters
function applyFilters(data: Policy[], filters: FilterOption[]): Policy[] {
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
function applySearch(data: Policy[], search: string): Policy[] {
  if (!search) return data

  const searchLower = search.toLowerCase()

  return data.filter((item) => {
    // Search in multiple fields
    return (
      item.policyNumber.toLowerCase().includes(searchLower) ||
      item.customer.toLowerCase().includes(searchLower) ||
      item.type.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    )
  })
}

// Helper function to apply sorting
function applySort(data: Policy[], sort?: SortOption): Policy[] {
  if (!sort) return data

  return [...data].sort((a, b) => {
    const aValue = (a as any)[sort.field]
    const bValue = (b as any)[sort.field]

    if (aValue === bValue) return 0

    const comparison = aValue < bValue ? -1 : 1
    return sort.direction === "asc" ? comparison : -comparison
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
 * /api/policies:
 *   get:
 *     summary: Get a list of policies
 *     description: Retrieve a paginated list of policies with optional filtering, sorting, and search
 *     tags:
 *       - Policies
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/sortField'
 *       - $ref: '#/components/parameters/sortDirection'
 *       - name: type
 *         in: query
 *         description: Filter by policy type
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter by policy status
 *         schema:
 *           type: string
 *           enum: [active, pending, expired, cancelled]
 *     responses:
 *       200:
 *         description: A paginated list of policies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Policy'
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
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const status = searchParams.get("status") || ""
    const sortField = searchParams.get("sortField") || ""
    const sortDirection = searchParams.get("sortDirection") || "asc"

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Apply filters
    let filteredData = [...policies]

    // Apply type filter if provided
    if (type && type !== "all") {
      filteredData = filteredData.filter((policy) => policy.type === type)
    }

    // Apply status filter if provided
    if (status && status !== "all") {
      filteredData = filteredData.filter((policy) => policy.status === status)
    }

    // Apply search if provided
    if (search) {
      filteredData = applySearch(filteredData, search)
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
    console.error("Error in policies API:", error)
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/policies:
 *   post:
 *     summary: Create a new policy
 *     description: Create a new insurance policy
 *     tags:
 *       - Policies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - customer
 *               - type
 *               - premium
 *               - startDate
 *               - endDate
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: The customer ID
 *               customer:
 *                 type: string
 *                 description: The customer name
 *               type:
 *                 type: string
 *                 description: The policy type
 *               premium:
 *                 type: number
 *                 description: The annual premium amount
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The policy start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The policy end date
 *               coverageDetails:
 *                 type: object
 *                 description: The policy coverage details
 *     responses:
 *       201:
 *         description: Policy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Policy'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["customerId", "customer", "type", "premium", "startDate", "endDate"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate a new ID (max ID + 1)
    const newId = Math.max(...policies.map((p) => p.id)) + 1

    // Generate a policy number
    const policyNumber = `POL-${1000 + newId}`

    // Create a new policy
    const newPolicy = {
      id: newId,
      policyNumber,
      ...body,
      status: "pending",
    }

    // Add to our in-memory "database"
    policies.push(newPolicy)

    return NextResponse.json(newPolicy, { status: 201 })
  } catch (error) {
    console.error("Error creating policy:", error)
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
}

