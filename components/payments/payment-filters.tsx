"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApiQuery } from "@/hooks/use-api-query"
import type { Customer } from "@/lib/types"

interface PaymentFiltersProps {
  onChange: (filters: any) => void
}

export function PaymentFilters({ onChange }: PaymentFiltersProps) {
  const [customerId, setCustomerId] = useState("")

  // Fetch customers for the dropdown
  const { data: customers } = useApiQuery<Customer[]>({
    endpoint: "/api/customers",
    params: { pageSize: 100 }, // Fetch more customers for dropdown
  })

  const handleCustomerChange = (value: string) => {
    setCustomerId(value)
    onChange({ customerId: value === "all" ? "" : value })
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="customer">Customer</Label>
        <Select
          value={customerId}
          onValueChange={handleCustomerChange}
        >
          <SelectTrigger id="customer">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customers?.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
