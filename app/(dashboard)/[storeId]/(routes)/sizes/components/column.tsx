"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CellActions } from "./cell-action"


export type SizeColumns = {
  id: string
  name: string
  value:string
  createdAt:string
}

export const columns: ColumnDef<SizeColumns>[] = [
  {
    accessorKey: "name",
    header:'Name'
  },
  {
    accessorKey: "value",
    header:'Value'
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id:"actions",
    cell:({row})=><CellActions data={row.original}/>
  }
  
]
