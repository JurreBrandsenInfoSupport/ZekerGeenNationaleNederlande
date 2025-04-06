import { NextResponse } from "next/server"
import type { Payment } from "@/lib/types"

// Reference to the in-memory payments data (would be database in production)
// This is just to simulate access to the same data across endpoints
let payments: Payment[] = []

// Function to initialize the payments array by importing it
async function getPayments() {
  if (payments.length === 0) {
    // Dynamically import to avoid circular dependencies
    const paymentsModule = await import('../route')
    // Access the payments array from the module
    // Note: This is a trick for demo purposes; in a real app with a DB this wouldn't be needed
    payments = (paymentsModule as any).payments || []
  }
  return payments
}

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   get:
 *     summary: Get a specific payment
 *     description: Retrieve detailed information for a single pension payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function GET(request: Request, { params }: { params: { paymentId: string } }) {
  try {
    const { paymentId } = params

    // Get the payments array
    const paymentsArray = await getPayments()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find the payment
    const payment = paymentsArray.find(p => p.paymentId === paymentId)

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error retrieving payment:", error)
    return NextResponse.json({ error: "Failed to retrieve payment" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   put:
 *     summary: Update a specific payment
 *     description: Update details of an existing pension payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentUpdate'
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function PUT(request: Request, { params }: { params: { paymentId: string } }) {
  try {
    const { paymentId } = params
    const body = await request.json()

    // Get the payments array
    const paymentsArray = await getPayments()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find the payment index
    const paymentIndex = paymentsArray.findIndex(p => p.paymentId === paymentId)

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Validate method if provided
    if (body.method) {
      const validMethods = ["bank_transfer", "credit_card", "check", "direct_debit"]
      if (!validMethods.includes(body.method)) {
        return NextResponse.json({ error: `Invalid payment method: ${body.method}` }, { status: 400 })
      }
    }

    // Validate status if provided
    if (body.status) {
      const validStatuses = ["completed", "pending", "failed", "cancelled"]
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: `Invalid payment status: ${body.status}` }, { status: 400 })
      }
    }

    // Update payment
    const updatedPayment = {
      ...paymentsArray[paymentIndex],
      ...body,
    }

    // Save to our in-memory "database"
    paymentsArray[paymentIndex] = updatedPayment

    return NextResponse.json(updatedPayment)
  } catch (error) {
    console.error("Error updating payment:", error)
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
  }
}

/**
 * @swagger
 * /api/payments/{paymentId}:
 *   delete:
 *     summary: Delete a specific payment
 *     description: Remove a pension payment record
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Payment deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export async function DELETE(request: Request, { params }: { params: { paymentId: string } }) {
  try {
    const { paymentId } = params

    // Get the payments array
    const paymentsArray = await getPayments()

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find the payment index
    const paymentIndex = paymentsArray.findIndex(p => p.paymentId === paymentId)

    if (paymentIndex === -1) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Remove from our in-memory "database"
    paymentsArray.splice(paymentIndex, 1)

    // Return 204 No Content for successful deletion
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting payment:", error)
    return NextResponse.json({ error: "Failed to delete payment" }, { status: 500 })
  }
}
