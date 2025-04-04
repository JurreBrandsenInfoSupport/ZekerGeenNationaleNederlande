import { NextResponse } from "next/server"

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
]

// GET: Fetch all policies
export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json(policies)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 })
  }
}

// POST: Create a new policy
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
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 })
  }
}

