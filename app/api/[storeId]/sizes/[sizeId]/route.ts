import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId:string} }
) {
  try {
    
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,  
      }
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("[size_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId:string,sizeId: string } }
) {
  try {
    const { userId } = auth();

    const body  = await req.json();

    const { name,value } = body;
 

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
        return new NextResponse("Size is required", { status: 400 });
      }
  

    if (!params.sizeId) {
      return new NextResponse("Category  ID is required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
         name,
         value
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[Size_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string ,sizeId:string} }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.sizeId) {
      return new NextResponse("size ID is required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[size_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
