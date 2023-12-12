import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// POST
export async function POST (req:Request,
  {params}:{params:{storeId:string}}){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name,value} = body;

        if (!userId) {
            return new NextResponse("user unauthenticated", { status: 403 });
          }

        if (!name) {
            return new NextResponse("Name is required", { status: 403 });
          }
          if (!value) {
            return new NextResponse("Value is required", { status: 403 });
          }
          if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 403 });
          }
       
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse('Unauthorized',{status:403})
        }

          const color = await prismadb.color.create({
            data:{
                name,
                value,
                storeId:params.storeId
            }
          })
          return NextResponse.json(color)
      
      
    } catch (error) {
        console.log('[Color_post]',error);
        return new NextResponse("internal Error",{status:500});
    }
}


// Get 
export async function GET (req:Request,{params}:{params:{storeId:string}}){
    try {
          if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 403 });
          }
       
          const colors = await prismadb.color.findMany({
            where:{
                storeId:params.storeId
            }
          })
          return NextResponse.json(colors)
      
    } catch (error) {
        console.log('[Colors_GET]',error);
        return new NextResponse("internal Error",{status:500});
    }
}