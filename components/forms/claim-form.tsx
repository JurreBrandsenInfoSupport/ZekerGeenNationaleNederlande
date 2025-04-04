"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import type { Claim } from "@/lib/types"

// Define the form schema with Zod
const formSchema = z.object({
  policyNumber: z.string().min(1, "Policy number is required"),
  customerId: z.coerce.number().positive("Customer ID is required"),
  customer: z.string().min(2, "Customer name is required"),
  amount: z.coerce.number().positive("Claim amount must be a positive number"),
  incidentDate: z.date({
    required_error: "Incident date is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

type FormValues = z.infer<typeof formSchema>

interface ClaimFormProps {
  onSuccess?: (claim: Claim) => void
  onCancel?: () => void
}

export function ClaimForm({ onSuccess, onCancel }: ClaimFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyNumber: "",
      customerId: undefined,
      customer: "",
      amount: undefined,
      description: "",
    },
  })

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      // Prepare the data for submission
      const claimData = {
        policyNumber: values.policyNumber,
        customerId: values.customerId,
        customer: values.customer,
        amount: values.amount,
        incidentDate: format(values.incidentDate, "yyyy-MM-dd"),
        description: values.description,
      }

      // Submit the data to the API
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create claim")
      }

      const newClaim: Claim = await response.json()

      // Show success message
      toast({
        title: "Claim Created",
        description: `Claim ${newClaim.claimId} has been created successfully.`,
      })

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(newClaim)
      }
    } catch (error) {
      console.error("Error creating claim:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create claim",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="policyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Policy Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. POL-1001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer ID</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Customer ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Customer Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Claim Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Claim Amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="incidentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Incident Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date(new Date().setHours(23, 59, 59, 999))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The date when the incident occurred</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the incident and claim details" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Provide a detailed description of the incident and claim</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Submit Claim"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

