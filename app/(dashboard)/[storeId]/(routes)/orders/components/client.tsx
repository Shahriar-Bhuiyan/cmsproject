"use client"

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrderColumns, columns } from "./column";
import { DataTable } from "@/components/ui/data-table";


interface OrderClientProps{
  data:OrderColumns[]
}

export const OrderClient:React.FC<OrderClientProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();
  return <>
   <div className="flex items-center justify-between">
      <Heading title={`Orders (${data.length})`} description="Manage orders for your store"/>
   </div>
   <Separator/>
   <DataTable searchKey="product" columns={columns} data={data}/>
  </>;
};
