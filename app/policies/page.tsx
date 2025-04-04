"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Download, FileText } from "lucide-react"
import { NewPolicyModal } from "@/components/modals/new-policy-modal"
import { DataTable } from "@/components/ui/data-table"
import { handleApiResponse, buildQueryString } from "@/lib/api-utils"
import type { Policy, PaginationInfo } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/format-utils"

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter and sort state
  const [search, setSearch] = useState("")
  const [policyType, setPolicyType] = useState("all")
  const [policyStatus, setPolicyStatus] = useState("all")
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
  }, [debouncedSearch, policyType, policyStatus])

  // Function to fetch policies
  const fetchPolicies = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const queryParams = {
        page,
        pageSize,
        search: debouncedSearch,
        type: policyType !== "all" ? policyType : "",
        status: policyStatus !== "all" ? policyStatus : "",
        sortField,
        sortDirection,
      }

      const queryString = buildQueryString(queryParams)

      const response = await fetch(`/api/policies${queryString}`, {
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh data
      })

      const result = await handleApiResponse<{ items: Policy[]; pagination: PaginationInfo }>(response)

      if (result.success && result.data) {
        setPolicies(result.data.items)
        setPagination(result.data.pagination)
      } else {
        throw new Error(result.error || "Failed to fetch policies")
      }
    } catch (error) {
      console.error("Error fetching policies:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load policies"
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

  // Fetch policies when dependencies change
  useEffect(() => {
    fetchPolicies()
  }, [page, pageSize, debouncedSearch, policyType, policyStatus, sortField, sortDirection])

  // Function to add a new policy to the UI
  const handleNewPolicy = (policy: Policy) => {
    // Refresh the list to include the new policy
    fetchPolicies()

    toast({
      title: "Policy Created",
      description: `Policy ${policy.policyNumber} has been created successfully.`,
    })
  }

  // Handle sorting
  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field)
    setSortDirection(direction)
  }

  // Export policies as CSV
  const exportPolicies = () => {
    // Create CSV content
    const headers = ["Policy Number", "Customer", "Type", "Premium", "Start Date", "End Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...policies.map((policy) =>
        [
          policy.policyNumber,
          policy.customer,
          policy.type,
          policy.premium,
          policy.startDate,
          policy.endDate,
          policy.status,
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `policies_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Policies have been exported to CSV successfully.",
    })
  }

  // Table columns
  const columns = [
    {
      key: "policyNumber",
      header: "Policy Number",
      cell: (policy: Policy) => <span className="font-medium">{policy.policyNumber}</span>,
      sortable: true,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (policy: Policy) => policy.customer,
      sortable: true,
    },
    {
      key: "type",
      header: "Type",
      cell: (policy: Policy) => policy.type,
      sortable: true,
    },
    {
      key: "premium",
      header: "Premium",
      cell: (policy: Policy) => <span>${policy.premium.toLocaleString()}/year</span>,
      sortable: true,
    },
    {
      key: "startDate",
      header: "Start Date",
      cell: (policy: Policy) => formatDate(policy.startDate),
      sortable: true,
    },
    {
      key: "endDate",
      header: "End Date",
      cell: (policy: Policy) => formatDate(policy.endDate),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (policy: Policy) => (
        <Badge
          variant={
            policy.status === "active"
              ? "default"
              : policy.status === "pending"
                ? "secondary"
                : policy.status === "expired"
                  ? "destructive"
                  : "outline"
          }
        >
          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (policy: Policy) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
      ),
    },
  ]

  // Empty state component
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-8">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No policies found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {search || policyType !== "all" || policyStatus !== "all"
          ? "Try adjusting your filters or search term"
          : "Get started by creating your first policy"}
      </p>
      <NewPolicyModal onPolicyCreated={handleNewPolicy} />
    </div>
  )

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportPolicies} disabled={policies.length === 0 || loading}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <NewPolicyModal onPolicyCreated={handleNewPolicy} />
            <Button variant="outline" size="icon" onClick={fetchPolicies} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Policies</CardTitle>
            <CardDescription>Use the filters below to find specific policies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search policies..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="flex-1">
                  <Select value={policyType} onValueChange={setPolicyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Policy Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Auto Insurance">Auto Insurance</SelectItem>
                      <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                      <SelectItem value="Life Insurance">Life Insurance</SelectItem>
                      <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={policyStatus} onValueChange={setPolicyStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchPolicies}>
              Retry
            </Button>
          </div>
        ) : (
          <DataTable
            data={policies}
            columns={columns}
            pagination={pagination}
            onPageChange={setPage}
            onSort={handleSort}
            sortKey={sortField}
            sortDirection={sortDirection}
            isLoading={loading}
            emptyState={emptyState}
          />
        )}
      </div>
    </div>
  )
}

