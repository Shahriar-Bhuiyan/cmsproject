import prismadb from "@/lib/prismadb"
import { ColorsClient } from "./components/client"
import { format } from "date-fns";
import { ColorColumns} from "./components/column";

const ColorsPage=async({params}:{params:{storeId:string}})=>{
  
    const colors = await prismadb.color.findMany({
        where:{
        storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    const formattedSizess:ColorColumns[] = colors.map((item)=>({
        id:item.id,
        name:item.name,
        value:item.value,
        createdAt:format(item.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorsClient data={formattedSizess}/>
            </div>
        </div>
    )

}
export default ColorsPage