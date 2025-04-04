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
import { PolicyForm } from "@/components/forms/policy-form"
import { Plus } from "lucide-react"
import type { Policy } from "@/lib/types"

interface NewPolicyModalProps {
  onPolicyCreated?: (policy: Policy) => void
}

export function NewPolicyModal({ onPolicyCreated }: NewPolicyModalProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = (policy: Policy) => {
    setOpen(false)
    if (onPolicyCreated) {
      onPolicyCreated(policy)
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
          New Policy
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Policy</DialogTitle>
            <DialogDescription>Fill out the form below to create a new insurance policy.</DialogDescription>
          </DialogHeader>
          <PolicyForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        </DialogContent>
      )}
    </Dialog>
  )
}

