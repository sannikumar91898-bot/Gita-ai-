// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/auth"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. 🔥 Database se session delete karein
    try {
      if (typeof destroySession === 'function') {
        await destroySession();
      }
    } catch (dbError) {
      console.error("[Logout] DB Session destruction failed:", dbError);
    }

    // 2. 🔥 HttpOnly Cookie ko delete karein (Browser se hatane ke liye)
    const cookieStore = cookies();
    
    // 🔥 MAIN FIX: Cookie ka naam "session" se badal kar "gita_session" kiya gaya hai
    cookieStore.set({
      name: "gita_session", // Yeh aapke auth.ts se match karta hai
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Expire date ko past mein set karne se cookie turant delete ho jati hai
    });

    // 3. Success Response bhejein
    return NextResponse.json(
      { 
        success: true, 
        message: "Logged out successfully." 
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error("[Logout] Unhandled error:", error?.message);
    
    return NextResponse.json(
      { success: true, message: "Logged out." }, 
      { status: 200 }
    );
  }
}