"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PaymentForm } from "@/components/payments/payment-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { useApiQuery } from "@/hooks/use-api-query"
import { formatCurrency } from "@/lib/utils"
import type { Payment } from "@/lib/types"

export default function PaymentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const paymentId = params?.paymentId as string
  const [isEditing, setIsEditing] = useState(false)

  // Fetch payment details
  const { data: payment, isLoading, error, refetch } = useApiQuery<Payment>({
    endpoint: `/api/payments/${paymentId}`,
    enabled: !!paymentId,
  })

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load payment details. Please try again.",
        variant: "destructive",
      })
    }
  }, [error])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleUpdate = () => {
    refetch()
    setIsEditing(false)
    toast({
      title: "Success",
      description: "Payment has been updated.",
    })
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment has been deleted.",
        })
        router.push("/payments")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete payment")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      case "cancelled":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title={isEditing ? "Edit Payment" : "Payment Details"}
        description={isEditing ? "Update payment information" : "View and manage payment details"}
        backButton={{ href: "/payments", label: "Back to Payments" }}
      />

      {isLoading ? (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : payment ? (
        <>
          {isEditing ? (
            <div className="mt-6">
              <PaymentForm
                payment={payment}
                onSuccess={handleUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <div className="grid gap-6 mt-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Payment Information</span>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Payment ID: {payment.paymentId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="text-lg font-bold">{formatCurrency(payment.amount, payment.currency)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-lg">{payment.date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Method</p>
                      <p className="text-lg">{payment.method.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reference Number</p>
                      <p className="text-lg">{payment.referenceNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-lg">{payment.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={handleEditToggle} variant="outline">
                    Edit Payment
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete Payment</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the
                          payment record from the system.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Details of the payment recipient</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <p className="text-lg font-bold">{payment.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer ID</p>
                    <p className="text-lg">{payment.customerId}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/customers/${payment.customerId}`)}
                  >
                    View Customer Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 p-6 bg-red-50 text-red-800 rounded-lg">
          <h3 className="text-lg font-semibold">Payment not found</h3>
          <p>The requested payment could not be found or you don't have permission to view it.</p>
          <Button className="mt-4" onClick={() => router.push("/payments")}>
            Return to Payments
          </Button>
        </div>
      )}
    </div>
  )
}
