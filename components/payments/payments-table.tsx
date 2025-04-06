"use client"

import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/status-chip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination } from "@/components/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react"
import type { Payment, PaginationInfo } from "@/lib/types"

interface PaymentsTableProps {
  payments: Payment[]
  isLoading: boolean
  pagination?: PaginationInfo
  onPageChange: (page: number) => void
  onRefresh: () => void
  sortField?: string
  sortDirection?: "asc" | "desc"
  onSort: (field: string) => void
}

export function PaymentsTable({
  payments,
  isLoading,
  pagination,
  onPageChange,
  onRefresh,
  sortField,
  sortDirection,
  onSort,
}: PaymentsTableProps) {
  const router = useRouter()

  const handleRowClick = (payment: Payment) => {
    router.push(`/payments/${payment.paymentId}`)
  }

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />
    }

    return sortDirection === "asc" ?
      <ChevronUp className="w-4 h-4 ml-1" /> :
      <ChevronDown className="w-4 h-4 ml-1" />
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </div>
    )
  }

  // No data state
  if (!payments.length) {
    return (
      <div className="text-center p-8 border rounded-md">
        <h3 className="text-lg font-medium">No payments found</h3>
        <p className="text-sm text-gray-500 mt-1">
          There are no payments matching your criteria.
        </p>
        <Button className="mt-4" onClick={onRefresh}>
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("paymentId")}
              >
                <div className="flex items-center">
                  Payment ID
                  {renderSortIndicator("paymentId")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("customer")}
              >
                <div className="flex items-center">
                  Customer
                  {renderSortIndicator("customer")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  {renderSortIndicator("amount")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {renderSortIndicator("date")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("method")}
              >
                <div className="flex items-center">
                  Method
                  {renderSortIndicator("method")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIndicator("status")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(payment)}
              >
                <TableCell className="font-medium">{payment.paymentId}</TableCell>
                <TableCell>{payment.customer}</TableCell>
                <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  {payment.method.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </TableCell>
                <TableCell>
                  <StatusChip status={payment.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
