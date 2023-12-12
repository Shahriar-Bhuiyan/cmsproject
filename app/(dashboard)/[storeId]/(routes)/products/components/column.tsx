"use client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CellActions } from "./cell-action"


export type ProductColumns = {
  id: string
  name: string,
  price:string,
  size:string,
  category:string,
  color:string,
  isFeatured:boolean,
  isArchived:boolean,
  createdAt:string
}

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey:'isArchived',
    header:'Archived'
  },
  {
    accessorKey:'isFeatured',
    header:'Featured'
  },
  {
    accessorKey:'price',
    header:'Price'
  },
  {
    accessorKey:'category',
    header:'Category'
  },
  {
    accessorKey:'size',
    header:'Size'
  },
  {
    accessorKey:'color',
    header:'Color',
    cell:({row})=>(
      <div className="flex items-center gap-x-2">
       {row.original.color}
       <div className="h-6 w-6 rounded-full" style={{backgroundColor:row.original.color}}/>
      </div>
    )
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
