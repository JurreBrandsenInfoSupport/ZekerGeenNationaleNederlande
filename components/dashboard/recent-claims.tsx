import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Claim } from "@/lib/types"

interface RecentClaimsProps {
  claims?: Claim[]
}

export function RecentClaims({ claims = [] }: RecentClaimsProps) {
  if (claims.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">No recent claims found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {claims.map((claim) => (
        <div key={claim.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="Customer avatar" />
            <AvatarFallback>
              {claim.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{claim.customer}</p>
            <p className="text-sm text-muted-foreground">
              {claim.claimId} • ${claim.amount.toLocaleString()}
            </p>
          </div>
          <div className="ml-auto">
            <Badge
              variant={
                claim.status === "approved" ? "primary" : claim.status === "processing" ? "secondary" : "outline"
              }
            >
              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

