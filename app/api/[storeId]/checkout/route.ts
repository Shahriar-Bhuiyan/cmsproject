import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

import prismadb from "@/lib/prismadb";
import { string } from "zod";



const corsHeaders = {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type,Authorizatioin",
}

export async function OPTIONS() {
    return NextResponse.json({},{headers:corsHeaders})
}

export async function POST (req:Request,
    {params}:{params:{storeId:string}}){
    

    const {productIds} = await req.json();

    if(!productIds || productIds.length === 0){
       return new NextResponse("Product ids are required",{status:400})
    }

    const products = await prismadb.product.findMany({
        where:{
            id:{
                in:productIds
            }
        }
    });

    const line_items:Stripe.Checkout.SessionCreateParams.LineItem[]= [];

    products.forEach((product)=>{
        line_items.push({
            quantity:1,
            price_data:{
                currency:'BDT',
                product_data:{
                    name:product.name
                },
                unit_amount:product.price.toNumber()*100
            }
        })
    })


}