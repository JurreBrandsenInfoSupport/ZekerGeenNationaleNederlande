"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, Mail, Phone, RefreshCw } from "lucide-react"
import { NewCustomerModal } from "@/components/modals/new-customer-modal"
import type { Customer } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/customers", {
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh data
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error fetching customers:", error)
      setError("Failed to load customers. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Function to add a new customer to the UI
  const handleNewCustomer = (customer: Customer) => {
    setCustomers((prevCustomers) => [customer, ...prevCustomers])
    toast({
      title: "Customer Added",
      description: `Customer ${customer.name} has been added successfully.`,
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <div className="flex items-center space-x-2">
            <NewCustomerModal onCustomerCreated={handleNewCustomer} />
            <Button variant="outline" size="icon" onClick={fetchCustomers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        ) : error ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchCustomers}>
              Retry
            </Button>
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">No customers found.</p>
            <Button variant="outline" className="mt-4" onClick={fetchCustomers}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={customer.avatar} alt={customer.name} />
                    <AvatarFallback>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{customer.name}</CardTitle>
                    <CardDescription>Customer since {formatDate(customer.customerSince)}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Policies
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to format dates
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

