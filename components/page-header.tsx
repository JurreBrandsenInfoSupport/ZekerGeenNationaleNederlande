import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  backButton?: {
    href: string
    label: string
  }
}

export function PageHeader({
  title,
  description,
  actions,
  backButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        {backButton && (
          <Link href={backButton.href} className="inline-block mb-2">
            <Button variant="ghost" size="sm" className="gap-1 pl-0 h-8">
              <ChevronLeft className="h-4 w-4" />
              {backButton.label}
            </Button>
          </Link>
        )}
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
