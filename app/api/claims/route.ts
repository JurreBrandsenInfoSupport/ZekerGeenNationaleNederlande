import { NextResponse } from "next/server"

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
]

// GET: Fetch all claims
export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json(claims)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 })
  }
}

// POST: Create a new claim
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
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}

