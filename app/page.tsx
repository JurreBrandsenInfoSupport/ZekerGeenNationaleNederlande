"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Users, BarChart3, ArrowRight, RefreshCw } from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { RecentClaims } from "@/components/dashboard/recent-claims"
import { useApiQuery } from "@/hooks/use-api-query"
import type { Policy, Claim, Customer } from "@/lib/types"
import { useState } from "react"
import { ErrorMessage } from "@/components/ui/error-message"
import { formatNumber, formatCurrency } from "@/lib/format-utils"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch summary data
  const {
    data: policiesData,
    isLoading: policiesLoading,
    error: policiesError,
    refetch: refetchPolicies,
  } = useApiQuery<Policy[]>({
    endpoint: "/api/policies",
    params: { pageSize: 100 }, // Get all policies for counting
  })

  const {
    data: claimsData,
    isLoading: claimsLoading,
    error: claimsError,
    refetch: refetchClaims,
  } = useApiQuery<Claim[]>({
    endpoint: "/api/claims",
    params: {
      pageSize: 100,
      sortField: "filedDate",
      sortDirection: "desc",
    },
  })

  const {
    data: customersData,
    isLoading: customersLoading,
    error: customersError,
    refetch: refetchCustomers,
  } = useApiQuery<Customer[]>({
    endpoint: "/api/customers",
    params: { pageSize: 100 }, // Get all customers for counting
  })

  // Calculate statistics
  const totalPolicies = policiesData?.length || 0
  const activeClaims =
    claimsData?.filter((claim) => claim.status === "pending" || claim.status === "processing").length || 0
  const totalCustomers = customersData?.length || 0

  // Calculate premium revenue
  const premiumRevenue =
    policiesData?.filter((policy) => policy.status === "active").reduce((total, policy) => total + policy.premium, 0) ||
    0

  // Get recent claims for display
  const recentClaims = claimsData?.slice(0, 4) || []

  // Handle refresh
  const handleRefresh = () => {
    refetchPolicies()
    refetchClaims()
    refetchCustomers()
    setRefreshKey((prev) => prev + 1)
  }

  // Check for errors
  const hasError = policiesError || claimsError || customersError

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={policiesLoading || claimsLoading || customersLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${policiesLoading || claimsLoading || customersLoading ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>
        </div>

        {hasError && (
          <ErrorMessage
            title="Data Loading Error"
            message="There was an error loading dashboard data. Please try refreshing."
            onRetry={handleRefresh}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {policiesLoading ? (
                <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatNumber(totalPolicies)}</div>
                  <p className="text-xs text-muted-foreground">
                    {policiesData?.filter((p) => p.status === "active").length || 0} active policies
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {claimsLoading ? (
                <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatNumber(activeClaims)}</div>
                  <p className="text-xs text-muted-foreground">
                    {claimsData?.filter((c) => c.status === "pending").length || 0} pending review
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {customersLoading ? (
                <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatNumber(totalCustomers)}</div>
                  <p className="text-xs text-muted-foreground">
                    {customersData?.filter(
                      (c) => new Date(c.customerSince) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    ).length || 0}{" "}
                    new this month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {policiesLoading ? (
                <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{formatCurrency(premiumRevenue)}</div>
                  <p className="text-xs text-muted-foreground">Annual projected revenue</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Premium Overview</CardTitle>
              <CardDescription>Monthly premium collection for the current year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview key={refreshKey} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Recently submitted claims requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {claimsLoading ? (
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                        <div className="ml-4 space-y-1">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="ml-auto">
                          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <RecentClaims claims={recentClaims} />
              )}
            </CardContent>
            <CardFooter>
              <Link href="/claims">
                <Button variant="outline" size="sm" className="flex items-center">
                  View all claims
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

