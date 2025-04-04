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
import { ClaimForm } from "@/components/forms/claim-form"
import { Plus } from "lucide-react"
import type { Claim } from "@/lib/types"

interface NewClaimModalProps {
  onClaimCreated?: (claim: Claim) => void
}

export function NewClaimModal({ onClaimCreated }: NewClaimModalProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = (claim: Claim) => {
    setOpen(false)
    if (onClaimCreated) {
      onClaimCreated(claim)
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
          New Claim
        </Button>
      </DialogTrigger>
      {open && (
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit New Claim</DialogTitle>
            <DialogDescription>Fill out the form below to submit a new insurance claim.</DialogDescription>
          </DialogHeader>
          <ClaimForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        </DialogContent>
      )}
    </Dialog>
  )
}

