"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 32400,
  },
  {
    name: "Feb",
    total: 34800,
  },
  {
    name: "Mar",
    total: 38600,
  },
  {
    name: "Apr",
    total: 42100,
  },
  {
    name: "May",
    total: 45700,
  },
  {
    name: "Jun",
    total: 48200,
  },
  {
    name: "Jul",
    total: 51000,
  },
  {
    name: "Aug",
    total: 53500,
  },
  {
    name: "Sep",
    total: 56200,
  },
  {
    name: "Oct",
    total: 58900,
  },
  {
    name: "Nov",
    total: 61500,
  },
  {
    name: "Dec",
    total: 64200,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Premium"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="#ff8000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

