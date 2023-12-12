import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// POST
export async function POST (req:Request,{params}:{params:{storeId:string}}){
    try {
        const {userId} = auth();
        const body = await req.json();
        const {
          name,
          price,
          categoryId,
          sizeId,
          colorId,
          isFeatured,
          isArchived,
          images
        } = body;

        if (!userId) {
            return new NextResponse("user unauthenticated", { status: 403 });
          }

        if (!name) {
            return new NextResponse("Name is required", { status: 403 });
          }
          if (!price) {
            return new NextResponse("Price is required", { status: 403 });
          }
          if (!colorId) {
            return new NextResponse("Color is required", { status: 403 });
          }
          if (!sizeId) {
            return new NextResponse("Size is required", { status: 403 });
          }
          if (!categoryId) {
            return new NextResponse("Category is required", { status: 403 });
          }

          if (!images || !images.length) {
            return new NextResponse("images is required", { status: 403 });
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

          const product = await prismadb.product .create({
            data:{
              name,
              price,
              categoryId,
              sizeId,
              colorId,
              isFeatured,
              isArchived,
              storeId:params.storeId,
              // important note need to revise

              images:{
                createMany:{
                  data:[
                    ...images.map((image:{url:string})=>image)
                  ]
                }
              }
            }

            // end of the image including 
          })
          return NextResponse.json(product)
      
      
    } catch (error) {
        console.log('[Product_post]',error);
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