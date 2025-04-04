"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import type { PaginationInfo } from "@/lib/types"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"

interface Column<T> {
  key: string
  header: string
  cell: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onSort?: (key: string, direction: "asc" | "desc") => void
  sortKey?: string
  sortDirection?: "asc" | "desc"
  isLoading?: boolean
  emptyState?: React.ReactNode
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  onPageChange,
  onSort,
  sortKey,
  sortDirection,
  isLoading,
  emptyState,
}: DataTableProps<T>) {
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null)

  const handleSort = (key: string) => {
    if (!onSort) return

    const newDirection = sortKey === key && sortDirection === "asc" ? "desc" : "asc"
    onSort(key, newDirection)
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />
    }

    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.sortable && onSort ? "cursor-pointer select-none" : ""}
                  onClick={() => column.sortable && onSort && handleSort(column.key)}
                  onMouseEnter={() => column.sortable && onSort && setHoveredHeader(column.key)}
                  onMouseLeave={() => setHoveredHeader(null)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && onSort && (
                      <span
                        className={`inline-flex ${hoveredHeader === column.key || sortKey === column.key ? "opacity-100" : "opacity-0"} transition-opacity`}
                      >
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(pagination?.pageSize || 5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column, cellIndex) => (
                      <TableCell key={cellIndex} className="py-3">
                        <div className="h-5 w-full animate-pulse rounded bg-muted"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyState || "No results found."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{column.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} className="py-4" />
      )}
    </div>
  )
}

