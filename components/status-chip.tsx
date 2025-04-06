import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusChipProps {
  status: string
  className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "expired":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Badge className={cn("font-medium border", getStatusStyle(status), className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
