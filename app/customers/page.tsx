"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Mail, Phone, RefreshCw, Download, MapPin, Calendar } from "lucide-react"
import { NewCustomerModal } from "@/components/modals/new-customer-modal"
import { handleApiResponse, buildQueryString } from "@/lib/api-utils"
import type { Customer, PaginationInfo } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { formatDate } from "@/lib/format-utils"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter and sort state
  const [search, setSearch] = useState("")
  const [state, setState] = useState("all")
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9) // Show 9 customers per page for grid layout

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, state])

  // Function to fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const queryParams = {
        page,
        pageSize,
        search: debouncedSearch,
        state: state !== "all" ? state : "",
        sortField,
        sortDirection,
      }

      const queryString = buildQueryString(queryParams)

      const response = await fetch(`/api/customers${queryString}`, {
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh data
      })

      const result = await handleApiResponse<{ items: Customer[]; pagination: PaginationInfo }>(response)

      if (result.success && result.data) {
        setCustomers(result.data.items)
        setPagination(result.data.pagination)
      } else {
        throw new Error(result.error || "Failed to fetch customers")
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load customers"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch customers when dependencies change
  useEffect(() => {
    fetchCustomers()
  }, [page, pageSize, debouncedSearch, state, sortField, sortDirection])

  // Function to add a new customer to the UI
  const handleNewCustomer = (customer: Customer) => {
    // Refresh the list to include the new customer
    fetchCustomers()

    toast({
      title: "Customer Added",
      description: `Customer ${customer.name} has been added successfully.`,
    })
  }

  // Export customers as CSV
  const exportCustomers = () => {
    // Create CSV content
    const headers = ["Name", "Email", "Phone", "Customer Since", "State", "City"]
    const csvContent = [
      headers.join(","),
      ...customers.map((customer) =>
        [
          customer.name,
          customer.email,
          customer.phone,
          customer.customerSince,
          customer.address?.state || "",
          customer.address?.city || "",
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `customers_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Customers have been exported to CSV successfully.",
    })
  }

  // States for filter dropdown
  const states = [
    { value: "all", label: "All States" },
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ]

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportCustomers} disabled={customers.length === 0 || loading}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <NewCustomerModal onCustomerCreated={handleNewCustomer} />
            <Button variant="outline" size="icon" onClick={fetchCustomers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Customers</CardTitle>
            <CardDescription>Use the filters below to find specific customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-[200px]">
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(pageSize)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1.5">
                      <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-10 w-full bg-muted animate-pulse rounded mt-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            <h3 className="text-lg font-medium mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              {search || state !== "all"
                ? "Try adjusting your filters or search term"
                : "Get started by adding your first customer"}
            </p>
            <NewCustomerModal onCustomerCreated={handleNewCustomer} />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customers.map((customer) => (
                <Card key={customer.id} className="overflow-hidden">
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
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        Customer since {formatDate(customer.customerSince)}
                      </CardDescription>
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
                      {customer.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {customer.address.city}, {customer.address.state}
                          </span>
                        </div>
                      )}
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Policies ({customer.policies?.length || 0})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {pagination && <Pagination pagination={pagination} onPageChange={setPage} className="py-4" />}
          </>
        )}
      </div>
    </div>
  )
}

