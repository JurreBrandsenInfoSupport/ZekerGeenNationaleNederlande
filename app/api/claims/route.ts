import { type NextRequest, NextResponse } from "next/server"
import type { Claim, FilterOption, SortOption } from "@/lib/types"

// In-memory storage for claims (simulating a database)
const claims = [
  {
    id: 1,
    claimId: "CLM-1001",
    policyNumber: "POL-1001",
    customerId: 1,
    customer: "John Smith",
    amount: 2500,
    incidentDate: "2023-03-15",
    filedDate: "2023-03-17",
    status: "approved",
    description: "Vehicle damage due to hail storm",
    documents: ["accident_report.pdf", "damage_photos.jpg"],
  },
  {
    id: 2,
    claimId: "CLM-1002",
    policyNumber: "POL-1002",
    customerId: 2,
    customer: "Sarah Johnson",
    amount: 1800,
    incidentDate: "2023-03-20",
    filedDate: "2023-03-22",
    status: "processing",
    description: "Water damage from burst pipe",
    documents: ["plumber_report.pdf", "damage_photos.jpg"],
  },
  {
    id: 3,
    claimId: "CLM-1003",
    policyNumber: "POL-1004",
    customerId: 4,
    customer: "Emily Davis",
    amount: 3200,
    incidentDate: "2023-03-25",
    filedDate: "2023-03-26",
    status: "pending",
    description: "Emergency room visit",
    documents: ["medical_report.pdf", "hospital_bill.pdf"],
  },
  {
    id: 4,
    claimId: "CLM-1004",
    policyNumber: "POL-1003",
    customerId: 3,
    customer: "Michael Brown",
    amount: 4500,
    incidentDate: "2023-03-10",
    filedDate: "2023-03-12",
    status: "rejected",
    description: "Claim for policy that was not active",
    documents: ["claim_form.pdf"],
  },
  {
    id: 5,
    claimId: "CLM-1005",
    policyNumber: "POL-1005",
    customerId: 5,
    customer: "David Wilson",
    amount: 1200,
    incidentDate: "2023-04-02",
    filedDate: "2023-04-03",
    status: "pending",
    description: "Minor fender bender",
    documents: ["police_report.pdf", "damage_photos.jpg"],
  },
  {
    id: 6,
    claimId: "CLM-1006",
    policyNumber: "POL-1004",
    customerId: 4,
    customer: "Emily Davis",
    amount: 950,
    incidentDate: "2023-04-05",
    filedDate: "2023-04-06",
    status: "processing",
    description: "Prescription medication",
    documents: ["prescription.pdf", "receipt.pdf"],
  },
  {
    id: 7,
    claimId: "CLM-1007",
    policyNumber: "POL-1007",
    customerId: 7,
    customer: "Robert Taylor",
    amount: 3800,
    incidentDate: "2023-05-12",
    filedDate: "2023-05-14",
    status: "approved",
    description: "Car accident with minor injuries",
    documents: ["police_report.pdf", "medical_report.pdf", "repair_estimate.pdf"],
  },
  {
    id: 8,
    claimId: "CLM-1008",
    policyNumber: "POL-1008",
    customerId: 8,
    customer: "Jessica Anderson",
    amount: 5000,
    incidentDate: "2023-06-03",
    filedDate: "2023-06-05",
    status: "processing",
    description: "Critical illness claim",
    documents: ["medical_diagnosis.pdf", "treatment_plan.pdf"],
  },
  {
    id: 9,
    claimId: "CLM-1009",
    policyNumber: "POL-1009",
    customerId: 9,
    customer: "Thomas White",
    amount: 1500,
    incidentDate: "2023-04-18",
    filedDate: "2023-04-20",
    status: "approved",
    description: "Specialist consultation fees",
    documents: ["specialist_invoice.pdf", "referral.pdf"],
  },
  {
    id: 10,
    claimId: "CLM-1010",
    policyNumber: "POL-1010",
    customerId: 10,
    customer: "Amanda Harris",
    amount: 4200,
    incidentDate: "2023-02-28",
    filedDate: "2023-03-02",
    status: "pending",
    description: "Roof damage from storm",
    documents: ["contractor_estimate.pdf", "damage_photos.jpg"],
  },
  {
    id: 11,
    claimId: "CLM-1011",
    policyNumber: "POL-1011",
    customerId: 11,
    customer: "Daniel Clark",
    amount: 850,
    incidentDate: "2023-01-10",
    filedDate: "2023-01-12",
    status: "rejected",
    description: "Claim filed after policy expiration",
    documents: ["claim_form.pdf"],
  },
  {
    id: 12,
    claimId: "CLM-1012",
    policyNumber: "POL-1012",
    customerId: 12,
    customer: "Michelle Lewis",
    amount: 2300,
    incidentDate: "2023-05-25",
    filedDate: "2023-05-27",
    status: "processing",
    description: "Hospitalization due to accident",
    documents: ["hospital_bill.pdf", "accident_report.pdf"],
  },
]

// Helper function to apply filters
function applyFilters(data: Claim[], filters: FilterOption[]): Claim[] {
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
function applySearch(data: Claim[], search: string): Claim[] {
  if (!search) return data

  const searchLower = search.toLowerCase()

  return data.filter((item) => {
    // Search in multiple fields
    return (
      item.claimId.toLowerCase().includes(searchLower) ||
      item.policyNumber.toLowerCase().includes(searchLower) ||
      item.customer.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower))
    )
  })
}

// Helper function to apply sorting
function applySort(data: Claim[], sort?: SortOption): Claim[] {
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
 * /api/claims:
 *   get:
 *     summary: Get a list of claims
 *     description: Retrieve a paginated list of claims with optional filtering, sorting, and search
 *     tags:
 *       - Claims
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/pageSize'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/sortField'
 *       - $ref: '#/components/parameters/sortDirection'
 *       - name: status
 *         in: query
 *         description: Filter by claim status
 *         schema:
 *           type: string
 *           enum: [pending, processing, approved, rejected]
 *       - name: minAmount
 *         in: query
 *         description: Minimum claim amount
 *         schema:
 *           type: number
 *       - name: maxAmount
 *         in: query
 *         description: Maximum claim amount
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: A paginated list of claims
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Claim'
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
    const status = searchParams.get("status") || ""
    const minAmount = searchParams.get("minAmount") ? Number.parseFloat(searchParams.get("minAmount")!) : null
    const maxAmount = searchParams.get("maxAmount") ? Number.parseFloat(searchParams.get("maxAmount")!) : null
    const sortField = searchParams.get("sortField") || ""
    const sortDirection = searchParams.get("sortDirection") || "asc"

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Apply filters
    let filteredData = [...claims]

    // Apply status filter if provided
    if (status && status !== "all") {
      filteredData = filteredData.filter((claim) => claim.status === status)
    }

    // Apply amount range filters if provided
    if (minAmount !== null) {
      filteredData = filteredData.filter((claim) => claim.amount >= minAmount)
    }

    if (maxAmount !== null) {
      filteredData = filteredData.filter((claim) => claim.amount <= maxAmount)
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
    console.error("Error in claims API:", error)
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/claims:
 *   post:
 *     summary: Create a new claim
 *     description: Submit a new insurance claim
 *     tags:
 *       - Claims
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - policyNumber
 *               - customerId
 *               - customer
 *               - amount
 *               - incidentDate
 *               - description
 *             properties:
 *               policyNumber:
 *                 type: string
 *                 description: The policy number
 *               customerId:
 *                 type: integer
 *                 description: The customer ID
 *               customer:
 *                 type: string
 *                 description: The customer name
 *               amount:
 *                 type: number
 *                 description: The claim amount
 *               incidentDate:
 *                 type: string
 *                 format: date
 *                 description: The date of the incident
 *               description:
 *                 type: string
 *                 description: The claim description
 *     responses:
 *       201:
 *         description: Claim created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Claim'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["policyNumber", "customerId", "customer", "amount", "incidentDate", "description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate a new ID (max ID + 1)
    const newId = Math.max(...claims.map((c) => c.id)) + 1

    // Generate a claim ID
    const claimId = `CLM-${1000 + newId}`

    // Create a new claim
    const newClaim = {
      id: newId,
      claimId,
      ...body,
      filedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      documents: [],
    }

    // Add to our in-memory "database"
    claims.push(newClaim)

    return NextResponse.json(newClaim, { status: 201 })
  } catch (error) {
    console.error("Error creating claim:", error)
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}

