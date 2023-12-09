"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { CellActions } from "./cell-action"
import { Button } from "@/components/ui/button"


export type SizeColumns = {
  id: string
  name: string
  value:string
  createdAt:string
}

export const columns: ColumnDef<SizeColumns>[] = [
  {
    accessorKey: "name",
    header:({column})=>{
      return (
        <Button variant={'ghost'}
        onClick={()=>column.toggleSorting(column.getIsSorted()==='asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
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
