import { type NextRequest, NextResponse } from "next/server"
import type { Customer, FilterOption, SortOption } from "@/lib/types"

// In-memory storage for customers (simulating a database)
const customers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    customerSince: "2020-05-12",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
    policies: ["POL-1001"],
    claims: ["CLM-1001"],
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "(555) 234-5678",
    customerSince: "2021-02-18",
    address: {
      street: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
      zipCode: "67890",
    },
    policies: ["POL-1002"],
    claims: ["CLM-1002"],
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@example.com",
    phone: "(555) 345-6789",
    customerSince: "2019-11-05",
    address: {
      street: "789 Pine Rd",
      city: "Elsewhere",
      state: "TX",
      zipCode: "54321",
    },
    policies: ["POL-1003"],
    claims: ["CLM-1004"],
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "(555) 456-7890",
    customerSince: "2022-01-30",
    address: {
      street: "321 Maple Dr",
      city: "Nowhere",
      state: "FL",
      zipCode: "98765",
    },
    policies: ["POL-1004"],
    claims: ["CLM-1003", "CLM-1006"],
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@example.com",
    phone: "(555) 567-8901",
    customerSince: "2020-08-22",
    address: {
      street: "654 Birch Ln",
      city: "Someplace",
      state: "IL",
      zipCode: "13579",
    },
    policies: ["POL-1005"],
    claims: ["CLM-1005"],
    avatar: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Jennifer Martinez",
    email: "j.martinez@example.com",
    phone: "(555) 678-9012",
    customerSince: "2021-04-15",
    address: {
      street: "987 Cedar Ct",
      city: "Anyplace",
      state: "WA",
      zipCode: "24680",
    },
    policies: ["POL-1006"],
    claims: [],
    avatar: "/placeholder.svg",
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "r.taylor@example.com",
    phone: "(555) 789-0123",
    customerSince: "2019-07-20",
    address: {
      street: "246 Elm St",
      city: "Othertown",
      state: "AZ",
      zipCode: "54321",
    },
    policies: ["POL-1007"],
    claims: ["CLM-1007"],
    avatar: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Jessica Anderson",
    email: "j.anderson@example.com",
    phone: "(555) 890-1234",
    customerSince: "2020-03-10",
    address: {
      street: "135 Willow Ave",
      city: "Somewhere",
      state: "CO",
      zipCode: "80123",
    },
    policies: ["POL-1008"],
    claims: ["CLM-1008"],
    avatar: "/placeholder.svg",
  },
  {
    id: 9,
    name: "Thomas White",
    email: "t.white@example.com",
    phone: "(555) 901-2345",
    customerSince: "2021-09-05",
    address: {
      street: "753 Spruce Rd",
      city: "Elsewhere",
      state: "OR",
      zipCode: "97531",
    },
    policies: ["POL-1009"],
    claims: ["CLM-1009"],
    avatar: "/placeholder.svg",
  },
  {
    id: 10,
    name: "Amanda Harris",
    email: "a.harris@example.com",
    phone: "(555) 012-3456",
    customerSince: "2022-02-15",
    address: {
      street: "864 Aspen Dr",
      city: "Nowhere",
      state: "MI",
      zipCode: "48765",
    },
    policies: ["POL-1010"],
    claims: ["CLM-1010"],
    avatar: "/placeholder.svg",
  },
]

// Helper function to apply filters
function applyFilters(data: Customer[], filters: FilterOption[]): Customer[] {
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
function applySearch(data: Customer[], search: string): Customer[] {
  if (!search) return data

  const searchLower = search.toLowerCase()

  return data.filter((item) => {
    // Search in multiple fields
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.phone.includes(search) ||
      (item.address && item.address.city.toLowerCase().includes(searchLower)) ||
      (item.address && item.address.state.toLowerCase().includes(searchLower))
    )
  })
}

// Helper function to apply sorting
function applySort(data: Customer[], sort?: SortOption): Customer[] {
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
 * /api/customers:
 *   get:
 *     summary: Get a list of customers
 *     description: Retrieve a paginated list of customers with optional filtering, sorting, and search
 *     tags:
 *       - Customers
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/sortField'
 *       - $ref: '#/components/parameters/sortDirection'
 *       - name: state
 *         in: query
 *         description: Filter by customer state
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
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
    const state = searchParams.get("state") || ""
    const sortField = searchParams.get("sortField") || ""
    const sortDirection = searchParams.get("sortDirection") || "asc"

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Apply filters
    let filteredData = [...customers]

    // Apply state filter if provided
    if (state && state !== "all") {
      filteredData = filteredData.filter((customer) => customer.address && customer.address.state === state)
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
    console.error("Error in customers API:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Create a new customer record
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 description: The customer's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The customer's email address
 *               phone:
 *                 type: string
 *                 description: The customer's phone number
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - zipCode
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Street address
 *                   city:
 *                     type: string
 *                     description: City
 *                   state:
 *                     type: string
 *                     description: State
 *                   zipCode:
 *                     type: string
 *                     description: ZIP code
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "address"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate a new ID (max ID + 1)
    const newId = Math.max(...customers.map((c) => c.id)) + 1

    // Create a new customer
    const newCustomer = {
      id: newId,
      ...body,
      customerSince: new Date().toISOString().split("T")[0],
      policies: [],
      claims: [],
      avatar: "/placeholder.svg",
    }

    // Add to our in-memory "database"
    customers.push(newCustomer)

    return NextResponse.json(newCustomer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

