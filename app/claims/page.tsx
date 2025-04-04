"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Download, FileText } from "lucide-react"
import { NewClaimModal } from "@/components/modals/new-claim-modal"
import { DataTable } from "@/components/ui/data-table"
import { handleApiResponse, buildQueryString } from "@/lib/api-utils"
import type { Claim, PaginationInfo } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { formatCurrency, formatDate } from "@/lib/format-utils"

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter and sort state
  const [search, setSearch] = useState("")
  const [claimStatus, setClaimStatus] = useState("all")
  const [amountRange, setAmountRange] = useState([0, 10000])
  const [sortField, setSortField] = useState("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Debounced search and filters
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [debouncedAmountRange, setDebouncedAmountRange] = useState(amountRange)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmountRange(amountRange)
    }, 500)

    return () => clearTimeout(timer)
  }, [amountRange])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, claimStatus, debouncedAmountRange])

  // Function to fetch claims
  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const queryParams = {
        page,
        pageSize,
        search: debouncedSearch,
        status: claimStatus !== "all" ? claimStatus : "",
        minAmount: debouncedAmountRange[0],
        maxAmount: debouncedAmountRange[1],
        sortField,
        sortDirection,
      }

      const queryString = buildQueryString(queryParams)

      const response = await fetch(`/api/claims${queryString}`, {
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh data
      })

      const result = await handleApiResponse<{ items: Claim[]; pagination: PaginationInfo }>(response)

      if (result.success && result.data) {
        setClaims(result.data.items)
        setPagination(result.data.pagination)
      } else {
        throw new Error(result.error || "Failed to fetch claims")
      }
    } catch (error) {
      console.error("Error fetching claims:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to load claims"
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

  // Fetch claims when dependencies change
  useEffect(() => {
    fetchClaims()
  }, [page, pageSize, debouncedSearch, claimStatus, debouncedAmountRange, sortField, sortDirection])

  // Function to add a new claim to the UI
  const handleNewClaim = (claim: Claim) => {
    // Refresh the list to include the new claim
    fetchClaims()

    toast({
      title: "Claim Created",
      description: `Claim ${claim.claimId} has been created successfully.`,
    })
  }

  // Handle sorting
  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field)
    setSortDirection(direction)
  }

  // Export claims as CSV
  const exportClaims = () => {
    // Create CSV content
    const headers = ["Claim ID", "Policy Number", "Customer", "Amount", "Incident Date", "Filed Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...claims.map((claim) =>
        [
          claim.claimId,
          claim.policyNumber,
          claim.customer,
          claim.amount,
          claim.incidentDate,
          claim.filedDate,
          claim.status,
        ].join(","),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `claims_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Claims have been exported to CSV successfully.",
    })
  }

  // Table columns
  const columns = [
    {
      key: "claimId",
      header: "Claim ID",
      cell: (claim: Claim) => <span className="font-medium">{claim.claimId}</span>,
      sortable: true,
    },
    {
      key: "policyNumber",
      header: "Policy Number",
      cell: (claim: Claim) => claim.policyNumber,
      sortable: true,
    },
    {
      key: "customer",
      header: "Customer",
      cell: (claim: Claim) => claim.customer,
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (claim: Claim) => <span>${claim.amount.toLocaleString()}</span>,
      sortable: true,
    },
    {
      key: "incidentDate",
      header: "Incident Date",
      cell: (claim: Claim) => formatDate(claim.incidentDate),
      sortable: true,
    },
    {
      key: "filedDate",
      header: "Filed Date",
      cell: (claim: Claim) => formatDate(claim.filedDate),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (claim: Claim) => (
        <Badge
          variant={
            claim.status === "approved"
              ? "primary"
              : claim.status === "processing"
                ? "secondary"
                : claim.status === "rejected"
                  ? "destructive"
                  : "outline"
          }
        >
          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      cell: (claim: Claim) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm">
            Process
          </Button>
        </div>
      ),
    },
  ]

  // Empty state component
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-8">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No claims found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {search || claimStatus !== "all" || amountRange[0] > 0 || amountRange[1] < 10000
          ? "Try adjusting your filters or search term"
          : "Get started by creating your first claim"}
      </p>
      <NewClaimModal onClaimCreated={handleNewClaim} />
    </div>
  )

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Claims</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportClaims} disabled={claims.length === 0 || loading}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <NewClaimModal onClaimCreated={handleNewClaim} />
            <Button variant="outline" size="icon" onClick={fetchClaims} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Claims</CardTitle>
            <CardDescription>Use the filters below to find specific claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search claims..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select value={claimStatus} onValueChange={setClaimStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount Range</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(amountRange[0])} - {formatCurrency(amountRange[1])}
                  </span>
                </div>
                <Slider
                  value={amountRange}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={setAmountRange}
                  className="py-4"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchClaims}>
              Retry
            </Button>
          </div>
        ) : (
          <DataTable
            data={claims}
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

