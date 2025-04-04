import { NextResponse } from "next/server"

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
]

// GET: Fetch all customers
export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

// POST: Create a new customer
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
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

