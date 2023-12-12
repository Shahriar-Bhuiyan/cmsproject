import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId:string} }
) {
  try {
    
    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,  
      }
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("[Color_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// updating color code
export async function PATCH(
  req: Request,
  { params }: { params: { storeId:string,colorId: string } }
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
  

    if (!params.colorId) {
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

    const size = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
         name,
         value
      }
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[Color_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string ,colorId:string} }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      }
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[Color_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
