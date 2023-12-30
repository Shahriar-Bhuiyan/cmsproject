import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

import prismadb from "@/lib/prismadb";



const corsHeaders = {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type,Authorizatioin",
}

export async function OPTIONS() {
    return NextResponse.json({},{headers:corsHeaders})
}