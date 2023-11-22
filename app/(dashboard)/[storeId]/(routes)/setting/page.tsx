
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingForm } from "./components/settings-form";


const settingPage =async ({
    params
}:{
    params:{storeId:string}
})=>{
   
    const{ userId} = auth();

    if(!userId){
        redirect('/sign-in')
    }
    const store = await prismadb.store.findFirst({

        where:{
            id:params.storeId,
            userId
        }
    })

    if(!store){
        redirect('/')
    }

return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initalData={store}/>
        </div>
    </div>
)
}

export default settingPage;