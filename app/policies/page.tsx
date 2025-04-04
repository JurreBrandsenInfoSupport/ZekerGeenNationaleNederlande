"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw } from "lucide-react"
import { NewPolicyModal } from "@/components/modals/new-policy-modal"
import type { Policy } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Function to fetch policies
  const fetchPolicies = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/policies", {
        cache: "no-store",
        next: { revalidate: 0 }, // Ensure fresh data
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setPolicies(data)
    } catch (error) {
      console.error("Error fetching policies:", error)
      setError("Failed to load policies. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load policies. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch policies on component mount
  useEffect(() => {
    fetchPolicies()
  }, [])

  // Function to add a new policy to the UI
  const handleNewPolicy = (policy: Policy) => {
    setPolicies((prevPolicies) => [policy, ...prevPolicies])
    toast({
      title: "Policy Created",
      description: `Policy ${policy.policyNumber} has been created successfully.`,
    })
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
          <div className="flex items-center space-x-2">
            <NewPolicyModal onPolicyCreated={handleNewPolicy} />
            <Button variant="outline" size="icon" onClick={fetchPolicies} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search policies..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Policy Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="auto">Auto Insurance</SelectItem>
                <SelectItem value="home">Home Insurance</SelectItem>
                <SelectItem value="life">Life Insurance</SelectItem>
                <SelectItem value="health">Health Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">Loading policies...</p>
          </div>
        ) : error ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchPolicies}>
              Retry
            </Button>
          </div>
        ) : policies.length === 0 ? (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">No policies found.</p>
            <Button variant="outline" className="mt-4" onClick={fetchPolicies}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">{policy.policyNumber}</TableCell>
                    <TableCell>{policy.customer}</TableCell>
                    <TableCell>{policy.type}</TableCell>
                    <TableCell>${policy.premium.toLocaleString()}/year</TableCell>
                    <TableCell>{formatDate(policy.startDate)}</TableCell>
                    <TableCell>{formatDate(policy.endDate)}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
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

