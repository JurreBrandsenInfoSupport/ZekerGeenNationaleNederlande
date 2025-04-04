import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const claims = [
  {
    id: "CLM-1234",
    customer: {
      name: "Olivia Johnson",
      email: "olivia.j@example.com",
      avatar: "/placeholder.svg",
    },
    amount: 2850,
    status: "pending",
    date: "2023-04-12T09:35:00",
  },
  {
    id: "CLM-1235",
    customer: {
      name: "William Chen",
      email: "will.chen@example.com",
      avatar: "/placeholder.svg",
    },
    amount: 1450,
    status: "processing",
    date: "2023-04-11T14:20:00",
  },
  {
    id: "CLM-1236",
    customer: {
      name: "Emma Rodriguez",
      email: "emma.r@example.com",
      avatar: "/placeholder.svg",
    },
    amount: 3200,
    status: "approved",
    date: "2023-04-10T11:05:00",
  },
  {
    id: "CLM-1237",
    customer: {
      name: "James Wilson",
      email: "j.wilson@example.com",
      avatar: "/placeholder.svg",
    },
    amount: 950,
    status: "pending",
    date: "2023-04-09T16:45:00",
  },
]

export function RecentClaims() {
  return (
    <div className="space-y-8">
      {claims.map((claim) => (
        <div key={claim.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={claim.customer.avatar} alt="Customer avatar" />
            <AvatarFallback>
              {claim.customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{claim.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {claim.id} • ${claim.amount.toLocaleString()}
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

