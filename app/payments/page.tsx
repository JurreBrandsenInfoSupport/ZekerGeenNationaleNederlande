"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { PaymentsTable } from "@/components/payments/payments-table"
import { PaymentFilters } from "@/components/payments/payment-filters"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useApiQuery } from "@/hooks/use-api-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Payment } from "@/lib/types"
import { StatusChip } from "@/components/status-chip"

export default function PaymentsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchParams, setSearchParams] = useState({
    page: 1,
    pageSize: 10,
    status: "",
    sortField: "date",
    sortDirection: "desc" as "asc" | "desc",
  })

  // Fetch payments based on filters
  const { data: payments, isLoading, pagination, refetch } = useApiQuery<Payment[]>({
    endpoint: "/api/payments",
    params: searchParams,
    enabled: true,
  })

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setSearchParams((prev) => ({
      ...prev,
      ...filters,
      page: 1, // Reset to first page on filter change
    }))
  }

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({
      ...prev,
      page,
    }))
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSearchParams((prev) => ({
      ...prev,
      status: value === "all" ? "" : value,
      page: 1, // Reset to first page on tab change
    }))
  }

  // Navigate to create new payment page
  const handleCreatePayment = () => {
    router.push("/payments/create")
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title="Pension Payments"
        description="Manage and track pension payments for customers"
        actions={
          <Button onClick={handleCreatePayment}>Create New Payment</Button>
        }
      />

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Payments</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <StatusChip status="pending" className="ml-2" />
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <StatusChip status="completed" className="ml-2" />
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed
              <StatusChip status="failed" className="ml-2" />
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled
              <StatusChip status="cancelled" className="ml-2" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              <PaymentFilters onChange={handleFilterChange} />

              <PaymentsTable
                payments={payments || []}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={handlePageChange}
                onRefresh={refetch}
                sortField={searchParams.sortField}
                sortDirection={searchParams.sortDirection}
                onSort={(field) => {
                  setSearchParams((prev) => ({
                    ...prev,
                    sortField: field,
                    sortDirection:
                      prev.sortField === field && prev.sortDirection === "asc"
                        ? "desc"
                        : "asc",
                  }))
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
