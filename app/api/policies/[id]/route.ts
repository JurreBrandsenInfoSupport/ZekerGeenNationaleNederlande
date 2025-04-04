import { NextResponse } from "next/server"

// Mock data for a specific policy
const mockPolicy = {
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
}

// GET: Fetch a specific policy by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, this would fetch from a database
    // For demo purposes, we'll return a mock policy
    return NextResponse.json({
      ...mockPolicy,
      id: Number.parseInt(id),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch policy" }, { status: 500 })
  }
}

// PUT: Update a policy
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, this would update in a database
    // For demo purposes, we'll just return the updated policy
    const updatedPolicy = {
      id: Number.parseInt(id),
      ...body,
    }

    return NextResponse.json(updatedPolicy)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 })
  }
}

// DELETE: Delete a policy
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // In a real app, this would delete from a database
    // For demo purposes, we'll just return a success message

    return NextResponse.json({ message: `Policy ${id} deleted successfully` })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 })
  }
}

