"use client"

import { PageHeader } from "@/components/page-header"
import { PaymentForm } from "@/components/payments/payment-form"
import { useRouter } from "next/navigation"

export default function CreatePaymentPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  const handleSuccess = () => {
    router.push("/payments")
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title="Create New Payment"
        description="Schedule a new pension payment for a customer"
        backButton={{ href: "/payments", label: "Back to Payments" }}
      />

      <div className="mt-6">
        <PaymentForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
