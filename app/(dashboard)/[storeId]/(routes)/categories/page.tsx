import prismadb from "@/lib/prismadb"
import { CategoryClient} from "./components/client"
import { format } from "date-fns";
import { CategoryColumns } from "./components/column";

const CategoriesPage=async({params}:{params:{storeId:string}})=>{
  
    const categories = await prismadb.category.findMany({
        where:{
        storeId:params.storeId
        },
        include:{
          billboard:true
        },
        orderBy:{
            createdAt:'desc'
        }
    });

    const formattedBillboards:CategoryColumns[] = categories.map((item)=>({
        id:item.id,
        name:item.name,
        billboardLable:item.billboard.lable,
        createdAt:format(item.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryClient data={formattedBillboards}/>
            </div>
        </div>
    )

}
export default CategoriesPage