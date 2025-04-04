"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw } from "lucide-react"
import { NewClaimModal } from "@/components/modals/new-claim-modal"
import type { Claim } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Function to fetch claims
  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/claims", {
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh data
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setClaims(data)
    } catch (error) {
      console.error("Error fetching claims:", error)
      setError("Failed to load claims. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load claims. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch claims on component mount
  useEffect(() => {
    fetchClaims()
  }, [])

  // Function to add a new claim to the UI
  const handleNewClaim = (claim: Claim) => {
    setClaims((prevClaims) => [claim, ...prevClaims])
    toast({
      title: "Claim Created",
      description: `Claim ${claim.claimId} has been created successfully.`,
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Claims</h2>
          <div className="flex items-center space-x-2">
            <NewClaimModal onClaimCreated={handleNewClaim} />
            <Button variant="outline" size="icon" onClick={fetchClaims} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search claims..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Claim Status" />
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

        {loading ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">Loading claims...</p>
          </div>
        ) : error ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchClaims}>
              Retry
            </Button>
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">No claims found.</p>
            <Button variant="outline" className="mt-4" onClick={fetchClaims}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Incident Date</TableHead>
                  <TableHead>Filed Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.claimId}</TableCell>
                    <TableCell>{claim.policyNumber}</TableCell>
                    <TableCell>{claim.customer}</TableCell>
                    <TableCell>${claim.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(claim.incidentDate)}</TableCell>
                    <TableCell>{formatDate(claim.filedDate)}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

