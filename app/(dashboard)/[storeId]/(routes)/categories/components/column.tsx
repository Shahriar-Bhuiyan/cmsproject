"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CellActions } from "./cell-action"


export type CategoryColumns = {
  id: string
  name: string
  billboardLable:string
  createdAt:string
}

export const columns: ColumnDef<CategoryColumns>[] = [
  {
    accessorKey: "Name",
    header:'Name',
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell:({row})=> row.original.billboardLable
  },
  {
    accessorKey:'createdAt',
    header:'Date'
   
  },
  {
    id:"actions",
    cell:({row})=><CellActions data={row.original}/>
  }
  
]
