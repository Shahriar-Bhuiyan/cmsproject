"use client"
 
import * as React from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"


import { ProductColumns } from "./column"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps{
    data:ProductColumns;
}

export const CellActions:React.FC<CellActionProps> = ({data})=>{
    const router = useRouter();
    const params = useParams();

    const [loading,setLoading] = useState<boolean>(false)
    const [open,setOpen] = useState<boolean>(false)
  
    const onConfirm = async () => {
      try {
        setLoading(true);
        await axios.delete(`/api/${params.storeId}/products/${data.id}`);
        toast.success('Product deleted.');
        router.refresh();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
        setOpen(false);
      }
    };
  
    const onCopy = (id: string) => {
      navigator.clipboard.writeText(id);
      toast.success('Product ID copied to clipboard.');
    }
    return (
    <>
    <AlertModal isOpen={open} 
    onClose={()=>setOpen(false)} 
    onConfirm={onConfirm} 
    loading={loading}/>

    <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant='ghost' className="h-8 w-8 p-0">
           <span className="sr-only">open menu</span>
           <MoreHorizontal className="h-4 w-4 "/>
           </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                <Copy className="mr-2 h-4 w-4" />
                 Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/products/${data.id}`)}>
                <Edit className="mr-2 h-4 w-4"/>
                Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setOpen(true)}>
                <Trash className="mr-2 h-4 w-4"/>
                Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu></>)
}