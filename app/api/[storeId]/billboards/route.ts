import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// POST
export async function POST (req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {imageUrl,lable} = body;

        if (!userId) {
            return new NextResponse("user unauthenticated", { status: 403 });
          }

        if (!lable) {
            return new NextResponse("Label is required", { status: 403 });
          }
          if (!imageUrl) {
            return new NextResponse("imageurl is required", { status: 403 });
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

          const billboard = await prismadb.billboard.create({
            data:{
                lable,
                imageUrl,
                storeId:params.storeId
            }
          })
          return NextResponse.json(billboard)
      
      
    } catch (error) {
        console.log('[Billboard_post]',error);
        return new NextResponse("internal Error",{status:500});
    }
}


// Get 
export async function GET (req:Request,{params}:{params:{storeId:string}}){
    try {
          if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 403 });
          }
       
          const billboards = await prismadb.billboard.findMany({
            where:{
                storeId:params.storeId
            }
          })
          return NextResponse.json(billboards)
      
    } catch (error) {
        console.log('[Billboard_GET]',error);
        return new NextResponse("internal Error",{status:500});
    }
}