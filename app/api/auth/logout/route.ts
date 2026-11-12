// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/auth"; // 🔥 Ensure karein ki ye function aapke auth.ts mein export ho

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. 🔥 Database se session delete karein
    // (Agar aapke auth.ts mein destroySession() hai, toh ye automatically DB se session hata dega)
    try {
      if (typeof destroySession === 'function') {
        await destroySession();
      }
    } catch (dbError) {
      // Agar DB fail bhi ho jaye, toh hum aage badhenge taaki cookie clear ho sake
      console.error("[Logout] DB Session destruction failed:", dbError);
    }

    // 2. 🔥 HttpOnly Cookie ko delete karein (Browser se hatane ke liye)
    // Cookie ka naam wahi hona chahiye jo aapne login ke waqt set kiya tha (e.g., "session", "auth_token", etc.)
    const cookieStore = cookies();
    
    // Note: Agar aapke cookie ka naam "session" se alag hai, toh use yahan change karein.
    cookieStore.set({
      name: "session", 
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // 🔥 Expire date ko past mein set karne se cookie turant delete ho jati hai
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
    
    // Agar yahan tak koi error aaya hai (jo ki rare hai), toh bhi frontend ko safe response bhejein
    // taaki user ko network error na dikhe.
    return NextResponse.json(
      { success: true, message: "Logged out." }, 
      { status: 200 }
    );
  }
}