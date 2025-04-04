"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CustomerForm } from "@/components/forms/customer-form"
import { Plus } from "lucide-react"
import type { Customer } from "@/lib/types"

interface NewCustomerModalProps {
  onCustomerCreated?: (customer: Customer) => void
}

export function NewCustomerModal({ onCustomerCreated }: NewCustomerModalProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = (customer: Customer) => {
    setOpen(false)
    if (onCustomerCreated) {
      onCustomerCreated(customer)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Fill out the form below to add a new customer to the system.</DialogDescription>
          </DialogHeader>
          <CustomerForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        </DialogContent>
      )}
    </Dialog>
  )
}

